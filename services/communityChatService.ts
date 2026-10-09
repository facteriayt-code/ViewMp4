import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  limit, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { ChatMessage, User } from '../types.ts';

export const CHAT_RETENTION_MS = 12 * 60 * 60 * 1000; // 12 hours
const MESSAGES_COLLECTION = 'messages';

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

  private messageListeners: Set<MessageListener> = new Set();
  private presenceListeners: Set<PresenceListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();

  constructor() {
    this.startAutoPurgeTimer();
  }

  // Check if message is under 12 hours old
  public isMessageActive(msg: ChatMessage): boolean {
    if (!msg || typeof msg.createdAt !== 'number') return false;
    return (Date.now() - msg.createdAt) < CHAT_RETENTION_MS;
  }

  // Formats time until message deletes automatically
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

  // Connects to Firestore real-time listener and REST backup
  public connect() {
    if (this.unsubscribeFirestore) return;

    this.isConnected = true;
    this.notifyStatus();

    // 1. Initial REST cache fetch
    this.fetchInitialRestMessages();

    // 2. Real-time Firestore live listener
    this.initFirestoreListener();

    // 3. Periodic fallback polling in background
    if (!this.pollInterval) {
      this.pollInterval = setInterval(() => {
        this.fetchInitialRestMessages();
      }, 5000);
    }
  }

  // Disconnects
  public disconnect() {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private initFirestoreListener() {
    try {
      const messagesRef = collection(db, MESSAGES_COLLECTION);
      const twelveHoursAgo = Date.now() - CHAT_RETENTION_MS;

      // Real-time listener for messages from the last 12 hours
      const q = query(
        messagesRef,
        where('createdAt', '>=', twelveHoursAgo),
        limit(150)
      );

      this.unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          this.isConnected = true;
          this.notifyStatus();

          const now = Date.now();
          const parsedMessages: ChatMessage[] = [];
          const expiredIds: string[] = [];

          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
            const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : (createdAt + CHAT_RETENTION_MS);

            // Filter expired messages (> 12 hours old)
            if (now - createdAt >= CHAT_RETENTION_MS || now >= expiresAt) {
              expiredIds.push(docSnap.id);
            } else {
              parsedMessages.push({
                id: docSnap.id,
                userId: data.userId || data.senderId || 'user',
                userName: data.userName || data.senderName || 'Streamer',
                userAvatar: data.userAvatar || data.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.userName || data.senderName || 'Streamer')}&background=E50914&color=fff`,
                userEmail: data.userEmail || '',
                text: data.text || '',
                createdAt,
                expiresAt
              });
            }
          });

          // Sort chronologically ascending
          parsedMessages.sort((a, b) => a.createdAt - b.createdAt);

          // Update active count based on recent senders
          const recentSenders = new Set(parsedMessages.map(m => m.userId));
          this.setOnlineCount(Math.max(1, recentSenders.size));

          if (parsedMessages.length > 0) {
            this.setMessages(parsedMessages);
          }

          // Background purge of expired documents
          if (expiredIds.length > 0) {
            expiredIds.forEach((id) => {
              deleteDoc(doc(db, MESSAGES_COLLECTION, id)).catch(() => {});
            });
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot listener fallback:', error);
          // If Firestore query fails, fallback query without filters
          this.initFirestoreFallbackListener();
        }
      );
    } catch (err) {
      console.warn('Firestore init exception, falling back:', err);
      this.initFirestoreFallbackListener();
    }
  }

  private initFirestoreFallbackListener() {
    try {
      const messagesRef = collection(db, MESSAGES_COLLECTION);
      const fallbackQuery = query(messagesRef, limit(100));

      this.unsubscribeFirestore = onSnapshot(
        fallbackQuery,
        (snapshot) => {
          this.isConnected = true;
          this.notifyStatus();

          const now = Date.now();
          const fallbackList: ChatMessage[] = [];

          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
            if (now - createdAt < CHAT_RETENTION_MS) {
              fallbackList.push({
                id: docSnap.id,
                userId: data.userId || data.senderId || 'user',
                userName: data.userName || data.senderName || 'Streamer',
                userAvatar: data.userAvatar || data.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.userName || data.senderName || 'Streamer')}&background=E50914&color=fff`,
                userEmail: data.userEmail || '',
                text: data.text || '',
                createdAt,
                expiresAt: createdAt + CHAT_RETENTION_MS
              });
            }
          });

          fallbackList.sort((a, b) => a.createdAt - b.createdAt);
          if (fallbackList.length > 0) {
            this.setMessages(fallbackList);
          }
        },
        (err) => {
          console.warn('Fallback Firestore error:', err);
        }
      );
    } catch (e) {
      console.warn('Fallback listener error:', e);
    }
  }

  // Fetch from REST API as resilient redundancy
  public async fetchInitialRestMessages(): Promise<ChatMessage[]> {
    try {
      const res = await fetch('/api/chat/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const valid = data.messages.filter((m: ChatMessage) => this.isMessageActive(m));
          // Merge without overriding newer Firestore items
          if (this.messages.length === 0 && valid.length > 0) {
            this.setMessages(valid);
          }
          if (typeof data.onlineCount === 'number') {
            this.setOnlineCount(Math.max(this.onlineCount, data.onlineCount));
          }
          return valid;
        }
      }
    } catch (_) {
      // ignore
    }
    return this.messages;
  }

  private startAutoPurgeTimer() {
    this.purgeInterval = setInterval(() => {
      const active = this.messages.filter(m => this.isMessageActive(m));
      if (active.length !== this.messages.length) {
        this.setMessages(active);
      }
    }, 15000);
  }

  // Send a message (Guaranteed delivery across all registered users & visitors)
  public async sendMessage(user: User | null, text: string): Promise<ChatMessage> {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Message cannot be empty.');

    const effectiveUserId = user?.id || (user?.email ? `u_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : `streamer_${Date.now()}`);
    const effectiveUserName = user?.name?.trim() || (user?.email ? user.email.split('@')[0] : 'Streamer');
    const effectiveAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(effectiveUserName)}&background=E50914&color=fff`;
    const effectiveEmail = user?.email || '';

    const now = Date.now();
    const tempId = `temp_${now}_${Math.random().toString(36).slice(2, 9)}`;
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

    // 1. Optimistically display in UI immediately
    this.addMessage(optimisticMessage);

    let confirmedMessage: ChatMessage = optimisticMessage;
    let didSave = false;

    // 2. Primary: Save directly to Firebase Firestore
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
        confirmedMessage = {
          ...optimisticMessage,
          id: docRef.id
        };
        this.addMessage(confirmedMessage, tempId);
        didSave = true;
      }
    } catch (firestoreErr) {
      console.warn('Firestore direct write failed, falling back to server API:', firestoreErr);
    }

    // 3. Secondary Backup: Save via server REST API
    try {
      const response = await fetch('/api/chat/send', {
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

      if (response.ok) {
        const resData = await response.json();
        if (resData && resData.message) {
          confirmedMessage = resData.message;
          this.addMessage(confirmedMessage, tempId);
          didSave = true;
        }
      }
    } catch (apiErr) {
      console.warn('API backup chat send failed:', apiErr);
    }

    if (!didSave) {
      // If both completely failed, remove optimistic message and throw friendly error
      this.removeMessage(tempId);
      throw new Error('Could not send message. Please check your internet connection.');
    }

    this.isConnected = true;
    this.notifyStatus();
    return confirmedMessage;
  }

  // Delete message
  public async deleteMessage(messageId: string, userId: string): Promise<void> {
    this.removeMessage(messageId);

    // Delete in Firestore
    try {
      await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId));
    } catch (e) {
      console.warn('Firestore message delete error:', e);
    }

    // Also notify server API
    try {
      await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (e) {
      // ignore
    }
  }

  // Strictly deduplicates and sorts messages by timestamp
  private deduplicateAndSort(msgs: ChatMessage[]): ChatMessage[] {
    const map = new Map<string, ChatMessage>();
    for (const m of msgs) {
      if (m && m.id) {
        map.set(m.id, m);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
  }

  // Internal state modifiers
  private setMessages(newMessages: ChatMessage[]) {
    this.messages = this.deduplicateAndSort(newMessages);
    this.notifyMessages();
  }

  private addMessage(msg: ChatMessage, replaceTempId?: string) {
    if (!msg || !msg.id) return;
    let list = this.messages;
    if (replaceTempId) {
      list = list.filter(m => m.id !== replaceTempId);
    }
    list = list.filter(m => m.id !== msg.id);
    list.push(msg);
    this.messages = this.deduplicateAndSort(list);
    this.notifyMessages();
  }

  private removeMessage(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.notifyMessages();
  }

  private setOnlineCount(count: number) {
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
