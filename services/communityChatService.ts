import { ChatMessage, User } from '../types.ts';

export const CHAT_RETENTION_MS = 12 * 60 * 60 * 1000; // 12 hours

type MessageListener = (messages: ChatMessage[]) => void;
type PresenceListener = (onlineCount: number) => void;
type StatusListener = (connected: boolean) => void;

class CommunityChatService {
  private socket: WebSocket | null = null;
  private messages: ChatMessage[] = [];
  private onlineCount: number = 1;
  private isConnected: boolean = false;
  private reconnectTimer: any = null;
  private pingInterval: any = null;
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

  // Starts the WebSocket connection and fetches initial history with resilient background polling
  public connect() {
    this.fetchInitialMessages();
    this.initWebSocket();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(() => {
        this.fetchInitialMessages();
      }, 4000);
    }
  }

  // Disconnects
  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.notifyStatus();
  }

  // Fetch from REST API for high reliability
  public async fetchInitialMessages(): Promise<ChatMessage[]> {
    try {
      const res = await fetch('/api/chat/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const valid = data.messages.filter((m: ChatMessage) => this.isMessageActive(m));
          this.setMessages(valid);
          if (typeof data.onlineCount === 'number') {
            this.setOnlineCount(data.onlineCount);
          }
          return valid;
        }
      }
    } catch (e) {
      console.warn('Initial chat fetch failed, waiting for WebSocket:', e);
    }
    return this.messages;
  }

  private initWebSocket() {
    if (typeof window === 'undefined') return;
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/chat`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.notifyStatus();
        this.startHeartbeat();
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleIncomingEvent(payload);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.notifyStatus();
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnected = false;
        this.notifyStatus();
      };
    } catch (err) {
      console.warn('WebSocket init exception:', err);
      this.scheduleReconnect();
    }
  }

  private handleIncomingEvent(event: any) {
    if (!event || !event.type) return;

    switch (event.type) {
      case 'chat:init':
        if (Array.isArray(event.messages)) {
          const active = event.messages.filter((m: ChatMessage) => this.isMessageActive(m));
          this.setMessages(active);
        }
        if (typeof event.onlineCount === 'number') {
          this.setOnlineCount(event.onlineCount);
        }
        break;

      case 'chat:message':
        if (event.message && this.isMessageActive(event.message)) {
          this.addMessage(event.message, event.clientTempId);
        }
        break;

      case 'chat:presence':
        if (typeof event.onlineCount === 'number') {
          this.setOnlineCount(event.onlineCount);
        }
        break;

      case 'chat:pruned':
        if (Array.isArray(event.messages)) {
          const active = event.messages.filter((m: ChatMessage) => this.isMessageActive(m));
          this.setMessages(active);
        }
        break;

      case 'chat:deleted':
        if (event.id) {
          this.removeMessage(event.id);
        }
        break;

      case 'chat:pong':
        // Heartbeat acknowledged
        break;
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'chat:ping' }));
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.initWebSocket();
    }, 3000);
  }

  private startAutoPurgeTimer() {
    // Purges expired messages every 20 seconds on the client
    this.purgeInterval = setInterval(() => {
      const active = this.messages.filter(m => this.isMessageActive(m));
      if (active.length !== this.messages.length) {
        this.setMessages(active);
      }
    }, 20000);
  }

  // Send a message (All connected users can chat)
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

    // Optimistically add to local UI state
    this.addMessage(optimisticMessage);

    // Guaranteed send via REST API
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

      if (!response.ok) {
        let errDesc = 'Failed to send message. Please try again.';
        try {
          const errJson = await response.json();
          if (errJson && errJson.error) {
            errDesc = errJson.error;
          }
        } catch (_) {
          // ignore
        }
        throw new Error(errDesc);
      }

      const resData = await response.json();
      if (resData && resData.message) {
        this.addMessage(resData.message, tempId);
        return resData.message;
      }
    } catch (err: any) {
      this.removeMessage(tempId);
      throw err;
    }

    // Also notify WebSocket if connected
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify({
          type: 'chat:send',
          userId: effectiveUserId,
          userName: effectiveUserName,
          userAvatar: effectiveAvatar,
          userEmail: effectiveEmail,
          text: trimmed,
          clientTempId: tempId
        }));
      } catch (wsErr) {
        console.warn('WebSocket send warning:', wsErr);
      }
    }

    return optimisticMessage;
  }

  // Delete message
  public async deleteMessage(messageId: string, userId: string): Promise<void> {
    this.removeMessage(messageId);
    try {
      await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (e) {
      console.error('Delete message error:', e);
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

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const communityChatService = new CommunityChatService();
