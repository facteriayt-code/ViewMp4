import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  limit, 
  deleteDoc, 
  doc,
  getDocs
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
  private ws: WebSocket | null = null;
  private wsReconnectTimer: any = null;
  private unsubscribeFirestore: (() => void) | null = null;
  private purgeInterval: any = null;
  private pollInterval: any = null;
  private pingInterval: any = null;

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

  // Connects via WebSocket, Firestore real-time listener, and HTTP polling redundancy
  public connect() {
    this.isConnected = true;
    this.notifyStatus();

    // 1. Initial REST cache fetch
    this.fetchInitialRestMessages();

    // 2. Real-time WebSocket connection for instant zero-latency message sync
    this.initWebSocket();

    // 3. Real-time Firestore live listener for cross-device cloud persistence
    this.initFirestoreListener();

    // 4. Periodic resilient polling every 3.5 seconds
    if (!this.pollInterval) {
      this.pollInterval = setInterval(() => {
        this.fetchInitialRestMessages();
      }, 3500);
    }
  }

  // Disconnects
  public disconnect() {
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  // Initialize resilient real-time WebSocket connection to /ws/chat
  private initWebSocket() {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyStatus();

        // Send periodic ping to prevent connection idle timeout
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
              this.ws.send(JSON.stringify({ type: 'chat:ping' }));
            } catch (_) {}
          }
        }, 25000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat:init') {
            if (Array.isArray(data.messages)) {
              this.mergeMessages(data.messages);
            }
            if (typeof data.onlineCount === 'number') {
              this.setOnlineCount(data.onlineCount);
            }
          } else if (data.type === 'chat:message' && data.message) {
            this.addMessage(data.message, data.clientTempId);
          } else if (data.type === 'chat:deleted' && data.id) {
            this.removeMessage(data.id);
          } else if (data.type === 'chat:presence' && typeof data.onlineCount === 'number') {
            this.setOnlineCount(data.onlineCount);
          }
        } catch (err) {
          console.warn('[WS] Parse message error:', err);
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
        }
        // Auto-reconnect after 3 seconds
        if (!this.wsReconnectTimer) {
          this.wsReconnectTimer = setTimeout(() => {
            this.wsReconnectTimer = null;
            this.initWebSocket();
          }, 3000);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[WS] Chat connection error:', err);
      };
    } catch (err) {
      console.warn('[WS] Chat init failed, will retry:', err);
    }
  }

  // Real-time Firestore listener with robust fallback
  private initFirestoreListener() {
    if (this.unsubscribeFirestore) return;

    try {
      const messagesRef = collection(db, MESSAGES_COLLECTION);
      const fallbackQuery = query(messagesRef, limit(150));

      this.unsubscribeFirestore = onSnapshot(
        fallbackQuery,
        (snapshot) => {
          this.isConnected = true;
          this.notifyStatus();

          const now = Date.now();
          const firestoreMsgs: ChatMessage[] = [];
          const expiredIds: string[] = [];

          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
            const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : (createdAt + CHAT_RETENTION_MS);

            if (now - createdAt >= CHAT_RETENTION_MS || now >= expiresAt) {
              expiredIds.push(docSnap.id);
            } else {
              firestoreMsgs.push({
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

          // Safely merge without wiping out server REST messages!
          if (firestoreMsgs.length > 0) {
            this.mergeMessages(firestoreMsgs);
          }

          // Clean up expired docs in background
          if (expiredIds.length > 0) {
            expiredIds.forEach((id) => {
              deleteDoc(doc(db, MESSAGES_COLLECTION, id)).catch(() => {});
            });
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot listener error:', error);
        }
      );
    } catch (err) {
      console.warn('Firestore listener setup exception:', err);
    }
  }

  // Fetch from REST API as resilient backup and merge safely
  public async fetchInitialRestMessages(): Promise<ChatMessage[]> {
    try {
      const res = await fetch('/api/chat/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const valid = data.messages.filter((m: ChatMessage) => this.isMessageActive(m));
          // ALWAYS merge new messages so all users receive updates!
          if (valid.length > 0) {
            this.mergeMessages(valid);
          }
          if (typeof data.onlineCount === 'number') {
            this.setOnlineCount(Math.max(this.onlineCount, data.onlineCount));
          }
          return valid;
        }
      }
    } catch (_) {
      // ignore network blips
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

  // Send a message (Guaranteed delivery and multi-destination persistence)
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

    // 2. Primary: Post to server REST API (guarantees persistent save in community_chat_history.json & broadcasts to all WebSockets)
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
      console.warn('API send failed, falling back to WebSocket/Firestore:', apiErr);
    }

    // 3. Secondary: Send over WebSocket if connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({
          type: 'chat:send',
          userId: effectiveUserId,
          userName: effectiveUserName,
          userAvatar: effectiveAvatar,
          userEmail: effectiveEmail,
          text: trimmed,
          clientTempId: tempId
        }));
        didSave = true;
      } catch (wsErr) {
        console.warn('WebSocket send error:', wsErr);
      }
    }

    // 4. Cloud Backup: Save to Firestore
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

      if (docRef && docRef.id && !didSave) {
        confirmedMessage = {
          ...optimisticMessage,
          id: docRef.id
        };
        this.addMessage(confirmedMessage, tempId);
        didSave = true;
      }
    } catch (firestoreErr) {
      console.warn('Firestore write warning:', firestoreErr);
    }

    if (!didSave) {
      this.removeMessage(tempId);
      throw new Error('Failed to send message. Please check your connection.');
    }

    this.isConnected = true;
    this.notifyStatus();
    return confirmedMessage;
  }

  // Delete message across both server and Firestore
  public async deleteMessage(messageId: string, userId: string): Promise<void> {
    this.removeMessage(messageId);

    // Delete in server
    try {
      await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (_) {}

    // Delete in Firestore
    try {
      await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId));
    } catch (_) {}
  }

  // Strictly deduplicates and sorts messages by timestamp
  private deduplicateAndSort(msgs: ChatMessage[]): ChatMessage[] {
    const map = new Map<string, ChatMessage>();
    for (const m of msgs) {
      if (m && m.id) {
        // If message has same content, sender and within 2 seconds, treat as same
        const existing = map.get(m.id);
        if (!existing) {
          map.set(m.id, m);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
  }

  // Safe merge without wiping existing messages
  private mergeMessages(incoming: ChatMessage[]) {
    const activeIncoming = incoming.filter(m => this.isMessageActive(m));
    if (activeIncoming.length === 0) return;

    const currentMap = new Map<string, ChatMessage>();
    for (const m of this.messages) {
      if (m && m.id) currentMap.set(m.id, m);
    }

    let hasNew = false;
    for (const m of activeIncoming) {
      if (m && m.id && !currentMap.has(m.id)) {
        currentMap.set(m.id, m);
        hasNew = true;
      }
    }

    if (hasNew || this.messages.length === 0) {
      const merged = Array.from(currentMap.values()).sort((a, b) => a.createdAt - b.createdAt);
      this.setMessages(merged);
    }
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

  // Subscriptions
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
