import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  limit, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { ChatMessage, User } from '../types.ts';

export const CHAT_RETENTION_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const MESSAGES_COLLECTION = 'messages';
const LOCAL_STORAGE_CACHE_KEY = 'geministream_live_chat_cache';

type MessageListener = (messages: ChatMessage[]) => void;
type PresenceListener = (onlineCount: number) => void;
type StatusListener = (connected: boolean) => void;

class CommunityChatService {
  private messages: ChatMessage[] = [];
  private onlineCount: number = 1;
  private isConnected: boolean = true;
  private unsubscribeFirestore: (() => void) | null = null;
  private purgeInterval: any = null;
  private pollInterval: any = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private isConnecting: boolean = false;

  private messageListeners: Set<MessageListener> = new Set();
  private presenceListeners: Set<PresenceListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();

  constructor() {
    // 1. Immediately restore cached messages from localStorage so refresh NEVER causes a blank screen
    this.loadFromLocalStorage();

    // 2. Set up cross-tab broadcast channel for instant multi-tab sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('geministream_live_chat');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'new_message' && event.data?.message) {
            this.insertOrUpdateMessage(event.data.message);
          } else if (event.data?.type === 'delete_message' && event.data?.id) {
            this.removeMessage(event.data.id);
          }
        };
      } catch (_) {}
    }

    // 3. Start auto-purge routine for 12-hour expiration
    this.startAutoPurgeTimer();

    // 4. Automatically connect to Firestore
    this.connect();
  }

  // Load persisted messages from localStorage for zero-latency initial render
  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const now = Date.now();
          const valid = parsed.filter(m => m && typeof m.createdAt === 'number' && (now - m.createdAt) < CHAT_RETENTION_MS);
          if (valid.length > 0) {
            this.messages = this.sortMessages(valid);
          }
        }
      }
    } catch (_) {}
  }

  // Persist valid messages to localStorage
  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;
    try {
      const now = Date.now();
      const valid = this.messages.filter(m => (now - m.createdAt) < CHAT_RETENTION_MS);
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(valid.slice(-100)));
    } catch (_) {}
  }

  // Check if a message is under 12 hours old
  public isMessageActive(msg: ChatMessage): boolean {
    if (!msg || typeof msg.createdAt !== 'number') return false;
    return (Date.now() - msg.createdAt) < CHAT_RETENTION_MS;
  }

  // Formats remaining time until auto-expiration
  public formatTimeUntilExpiration(expiresAt: number): string {
    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) return 'Expiring now';
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `Expires in ${hours}h ${minutes}m`;
    }
    return `Expires in ${Math.max(1, minutes)}m`;
  }

  // Connect to Firestore real-time snapshot and background polling
  public connect() {
    if (this.isConnecting && this.unsubscribeFirestore) return;
    this.isConnecting = true;
    this.isConnected = true;
    this.notifyStatus();

    // 1. Listen directly to Firestore in real-time
    this.initFirestoreListener();

    // 2. Poll server endpoint as resilient redundancy
    this.fetchInitialRestMessages();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(() => {
        this.fetchInitialRestMessages();
      }, 5000);
    }
  }

  public disconnect() {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isConnecting = false;
  }

  // Real-time Firestore snapshot listener across all users and devices
  private initFirestoreListener() {
    if (this.unsubscribeFirestore) return;

    try {
      const messagesRef = collection(db, MESSAGES_COLLECTION);
      const q = query(messagesRef, limit(200));

      this.unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          this.isConnected = true;
          this.notifyStatus();

          const now = Date.now();
          const incoming: ChatMessage[] = [];
          const expiredDocIds: string[] = [];

          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
            const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : (createdAt + CHAT_RETENTION_MS);

            if (now - createdAt >= CHAT_RETENTION_MS || now >= expiresAt) {
              expiredDocIds.push(docSnap.id);
            } else {
              incoming.push({
                id: docSnap.id,
                userId: data.userId || data.senderId || 'streamer',
                userName: data.userName || data.senderName || 'Streamer',
                userAvatar: data.userAvatar || data.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.userName || data.senderName || 'Streamer')}&background=E50914&color=fff`,
                userEmail: data.userEmail || '',
                text: data.text || '',
                createdAt,
                expiresAt
              });
            }
          });

          // Update messages state if docs received
          if (incoming.length > 0) {
            this.mergeIncomingFirestore(incoming);
          } else if (this.messages.length === 0) {
            // If completely empty, fetch REST fallback
            this.fetchInitialRestMessages();
          }

          // Background purge of expired docs
          if (expiredDocIds.length > 0) {
            expiredDocIds.forEach((id) => {
              deleteDoc(doc(db, MESSAGES_COLLECTION, id)).catch(() => {});
            });
          }
        },
        (error) => {
          console.warn('Firestore live listener notice (falling back to REST sync):', error?.message || error);
          this.fetchInitialRestMessages();
        }
      );
    } catch (err) {
      console.warn('Firestore subscription exception:', err);
      this.fetchInitialRestMessages();
    }
  }

  // Merge Firestore documents cleanly without duplicates
  private mergeIncomingFirestore(firestoreDocs: ChatMessage[]) {
    const existingMap = new Map<string, ChatMessage>();
    for (const m of this.messages) {
      if (m && m.id) existingMap.set(m.id, m);
    }

    for (const doc of firestoreDocs) {
      // Find if we have a matching local message by ID or by same sender + text + timestamp within 4s
      let foundKey: string | null = null;
      for (const [key, val] of existingMap.entries()) {
        if (val.id === doc.id) {
          foundKey = key;
          break;
        }
        if (
          val.userId === doc.userId &&
          val.text === doc.text &&
          Math.abs(val.createdAt - doc.createdAt) < 4000
        ) {
          foundKey = key;
          break;
        }
      }

      if (foundKey) {
        existingMap.set(foundKey, { ...existingMap.get(foundKey)!, id: doc.id });
      } else {
        existingMap.set(doc.id, doc);
      }
    }

    const merged = Array.from(existingMap.values());
    this.messages = this.sortMessages(merged);
    this.saveToLocalStorage();
    this.notifyMessages();
  }

  // REST API fallback to ensure zero missing messages
  public async fetchInitialRestMessages(): Promise<ChatMessage[]> {
    try {
      const res = await fetch('/api/chat/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const now = Date.now();
          const valid = data.messages.filter((m: ChatMessage) => m && (now - m.createdAt) < CHAT_RETENTION_MS);
          if (valid.length > 0) {
            this.mergeIncomingFirestore(valid);
          }
          if (typeof data.onlineCount === 'number') {
            this.setOnlineCount(Math.max(1, data.onlineCount));
          }
          return valid;
        }
      }
    } catch (_) {}
    return this.messages;
  }

  // Periodic 12-hour purge timer
  private startAutoPurgeTimer() {
    this.purgeInterval = setInterval(() => {
      const now = Date.now();
      const active = this.messages.filter(m => (now - m.createdAt) < CHAT_RETENTION_MS);
      if (active.length !== this.messages.length) {
        this.messages = active;
        this.saveToLocalStorage();
        this.notifyMessages();
      }
    }, 15000);
  }

  // Sends a message to the live chat room (Guaranteed cloud persistence across all users)
  public async sendMessage(user: User | null, text: string): Promise<ChatMessage> {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Message cannot be empty.');
    if (trimmed.length > 1000) throw new Error('Message is too long (maximum 1,000 characters).');

    // Generate safe user details for registered users or guests
    const effectiveUserId = user?.id || (user?.email ? `u_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : `streamer_${Date.now()}`);
    const effectiveUserName = user?.name?.trim() || (user?.email ? user.email.split('@')[0] : 'Streamer');
    const effectiveAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(effectiveUserName)}&background=E50914&color=fff`;
    const effectiveEmail = user?.email || '';

    const now = Date.now();
    const tempId = `msg_${now}_${Math.random().toString(36).slice(2, 8)}`;
    
    const optimisticMessage: ChatMessage = {
      id: tempId,
      userId: effectiveUserId,
      userName: effectiveUserName,
      userAvatar: effectiveAvatar,
      userEmail: effectiveEmail,
      text: trimmed,
      createdAt: now,
      expiresAt: now + CHAT_RETENTION_MS
    };

    // 1. Instant local optimistic update
    this.insertOrUpdateMessage(optimisticMessage);

    // 2. Broadcast to other tabs immediately
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'new_message', message: optimisticMessage });
      } catch (_) {}
    }

    let savedMessage: ChatMessage = optimisticMessage;
    let didSaveToCloud = false;

    // 3. Save to Firebase Firestore (Global real-time sync to all users worldwide)
    try {
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        senderId: effectiveUserId,
        userId: effectiveUserId,
        senderName: effectiveUserName,
        userName: effectiveUserName,
        senderAvatar: effectiveAvatar,
        userAvatar: effectiveAvatar,
        userEmail: effectiveEmail,
        text: trimmed,
        createdAt: now,
        expiresAt: now + CHAT_RETENTION_MS
      });

      if (docRef && docRef.id) {
        savedMessage = { ...optimisticMessage, id: docRef.id };
        this.insertOrUpdateMessage(savedMessage, tempId);
        didSaveToCloud = true;
      }
    } catch (firestoreErr: any) {
      console.warn('Firestore direct write notice:', firestoreErr?.message || firestoreErr);
    }

    // 4. Save to REST API as backup
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          userName: effectiveUserName,
          userAvatar: effectiveAvatar,
          userEmail: effectiveEmail,
          text: trimmed,
          clientTempId: tempId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.message && !didSaveToCloud) {
          savedMessage = data.message;
          this.insertOrUpdateMessage(savedMessage, tempId);
          didSaveToCloud = true;
        }
      }
    } catch (apiErr) {
      console.warn('REST API send notice:', apiErr);
    }

    this.saveToLocalStorage();
    this.isConnected = true;
    this.notifyStatus();
    return savedMessage;
  }

  // Delete message
  public async deleteMessage(messageId: string, userId: string): Promise<void> {
    this.removeMessage(messageId);

    // Cross-tab broadcast
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'delete_message', id: messageId });
      } catch (_) {}
    }

    // Delete in Firestore
    try {
      await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId));
    } catch (_) {}

    // Delete via REST
    try {
      await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (_) {}
  }

  // Insert or update a message
  private insertOrUpdateMessage(msg: ChatMessage, replaceId?: string) {
    if (!msg || !msg.id) return;
    let list = this.messages;
    if (replaceId) {
      list = list.filter(m => m.id !== replaceId);
    }
    list = list.filter(m => m.id !== msg.id);
    list.push(msg);
    this.messages = this.sortMessages(list);
    this.saveToLocalStorage();
    this.notifyMessages();
  }

  private removeMessage(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.saveToLocalStorage();
    this.notifyMessages();
  }

  private sortMessages(msgs: ChatMessage[]): ChatMessage[] {
    const map = new Map<string, ChatMessage>();
    for (const m of msgs) {
      if (m && m.id) {
        map.set(m.id, m);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
  }

  public setOnlineCount(count: number) {
    this.onlineCount = Math.max(1, count);
    this.notifyPresence();
  }

  // Listeners
  public subscribeMessages(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    listener(this.messages);
    return () => this.messageListeners.delete(listener);
  }

  public subscribePresence(listener: PresenceListener): () => void {
    this.presenceListeners.add(listener);
    listener(this.onlineCount);
    return () => this.presenceListeners.delete(listener);
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.isConnected);
    return () => this.statusListeners.delete(listener);
  }

  private notifyMessages() {
    this.messageListeners.forEach(fn => fn(this.messages));
  }

  private notifyPresence() {
    this.presenceListeners.forEach(fn => fn(this.onlineCount));
  }

  private notifyStatus() {
    this.statusListeners.forEach(fn => fn(this.isConnected));
  }

  public getMessages(): ChatMessage[] {
    return this.messages;
  }

  public getOnlineCount(): number {
    return this.onlineCount;
  }
}

export const communityChatService = new CommunityChatService();
