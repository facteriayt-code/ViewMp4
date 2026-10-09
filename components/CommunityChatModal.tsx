import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, Send, X, Clock, Users, ShieldAlert, Sparkles, 
  Trash2, LogIn, Flame, Film, Popcorn, Heart, ThumbsUp, 
  Minimize2, Maximize2, AlertCircle, CheckCircle2, Wifi, WifiOff
} from 'lucide-react';
import { User, ChatMessage } from '../types.ts';
import { communityChatService, CHAT_RETENTION_MS } from '../services/communityChatService.ts';

interface CommunityChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLoginClick: () => void;
}

const QUICK_EMOJIS = ['🔥', '🍿', '🎬', '❤️', '👏', '🚀', '💯', '✨'];

export const CommunityChatModal: React.FC<CommunityChatModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginClick
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat connection and subscriptions
  useEffect(() => {
    communityChatService.connect();

    const unsubMessages = communityChatService.subscribeMessages((newMsgs) => {
      setMessages(newMsgs);
    });

    const unsubPresence = communityChatService.subscribePresence((count) => {
      setOnlineCount(count);
    });

    const unsubStatus = communityChatService.subscribeStatus((connected) => {
      setIsConnected(connected);
    });

    return () => {
      unsubMessages();
      unsubPresence();
      unsubStatus();
    };
  }, []);

  // Strict deduplication by ID for rendering
  const displayMessages = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const m of messages) {
      if (m && m.id) {
        map.set(m.id, m);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && user) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized, user]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (!user) {
      setErrorMsg('Please sign in to send messages.');
      onLoginClick();
      return;
    }

    const text = inputText.trim();
    setInputText('');
    setIsSending(true);
    setErrorMsg(null);

    try {
      await communityChatService.sendMessage(user, text);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
      setInputText(text); // restore text if failed
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickEmoji = (emoji: string) => {
    if (!user) {
      onLoginClick();
      return;
    }
    setInputText(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!user) return;
    try {
      await communityChatService.deleteMessage(msgId, user.id);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  if (!isOpen) return null;

  // Minimized Floating Widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[999] flex items-center bg-[#0d0f17] border border-white/20 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in">
        <button 
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 text-xs font-bold hover:text-red-400 transition"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span>Community Chat ({onlineCount} online)</span>
        </button>
        <button 
          onClick={onClose}
          className="ml-3 p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[420px] sm:h-[640px] max-h-[100vh] sm:max-h-[calc(100vh-2rem)] z-[999] flex flex-col bg-[#0b0d14]/98 backdrop-blur-2xl border border-white/15 sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-bottom-3">
      {/* 1. Header */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-600/30 shrink-0">
            <MessageSquare className="w-4 h-4 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider truncate">
                Community Live Chat
              </h3>
              <span className="flex items-center space-x-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{onlineCount} online</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-400 truncate flex items-center space-x-1 mt-0.5">
              <span>Connected for all users</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">Auto-deletes in 12h</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1 shrink-0 ml-2">
          <button 
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Minimize chat"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition active:scale-95"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 12-Hour Self-Destruct Notice Banner */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-red-950/40 via-amber-950/25 to-zinc-900 border-b border-white/5 flex items-center justify-between text-[11px] text-gray-300 shrink-0">
        <div className="flex items-center space-x-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate">
            Ephemeral Chat: Messages automatically expire & purge after 12h
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-gray-400 shrink-0 ml-1">
          {isConnected ? (
            <span className="flex items-center space-x-1 text-emerald-400">
              <Wifi className="w-3 h-3" />
              <span className="hidden xs:inline">Live Sync</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-amber-400">
              <WifiOff className="w-3 h-3" />
              <span>Connecting...</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 no-scrollbar bg-[#08090e]/80">
        {displayMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
            <MessageSquare className="w-10 h-10 text-gray-600 animate-pulse" />
            <p className="text-xs font-bold text-gray-300">No active messages in the last 12 hours</p>
            <p className="text-[11px] text-gray-500">Be the first registered user to break the ice!</p>
          </div>
        ) : (
          displayMessages.map((msg, index) => {
            const isMe = user?.id === msg.userId;
            const isSystem = msg.userId === 'system';
            const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const expiresIn = communityChatService.formatTimeUntilExpiration(msg.expiresAt);
            const itemKey = msg.id || `msg_${msg.createdAt}_${index}`;

            if (isSystem) {
              return (
                <div key={itemKey} className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-center space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-[10px] font-black uppercase tracking-wider text-red-400">
                    <Sparkles className="w-3 h-3 text-red-400" />
                    <span>GeminiStream System Notice</span>
                  </div>
                  <p className="text-xs text-gray-200">{msg.text}</p>
                  <span className="text-[9px] text-gray-400 block">{expiresIn}</span>
                </div>
              );
            }

            return (
              <div 
                key={itemKey}
                className={`flex items-start space-x-2 group ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <img 
                  src={msg.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.userName)}&background=E50914&color=fff`} 
                  alt={msg.userName}
                  className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0 mt-0.5 shadow-sm"
                />

                {/* Message Bubble Content */}
                <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender & Timestamp */}
                  <div className={`flex items-center space-x-1.5 text-[10px] text-gray-400 mb-0.5 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <span className={`font-bold ${isMe ? 'text-red-400' : 'text-gray-200'}`}>
                      {isMe ? 'You' : msg.userName}
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">{formattedTime}</span>
                    <span className="text-[9px] text-amber-400/80 hidden group-hover:inline transition-opacity">
                      ({expiresIn})
                    </span>
                  </div>

                  {/* Bubble */}
                  <div className={`relative px-3 py-2 rounded-2xl text-xs sm:text-sm break-words shadow-md transition-all ${
                    isMe 
                      ? 'bg-red-600 text-white rounded-tr-none' 
                      : 'bg-zinc-800/95 text-gray-100 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.text}

                    {/* Delete button if sent by me */}
                    {isMe && (
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 absolute -left-6 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-400 transition active:scale-90"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Emoji Tray */}
      {user && (
        <div className="px-3 py-1.5 bg-zinc-950/80 border-t border-white/5 flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Quick:</span>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleQuickEmoji(emoji)}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-sm transition active:scale-90 shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* 5. Input Area / Login Prompt */}
      <div className="p-3 bg-zinc-950 border-t border-white/10 shrink-0">
        {errorMsg && (
          <div className="mb-2 p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-gray-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {user ? (
          <form onSubmit={handleSendMessage} className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
              <span className="truncate">
                Posting as <strong className="text-white font-semibold">{user.name}</strong>
              </span>
              <span>{inputText.length}/500</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message to all streamers..."
                maxLength={500}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/15 focus:border-red-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-gray-400 focus:outline-none transition shadow-inner font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="p-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white rounded-xl transition shadow-md shadow-red-600/30 active:scale-95 shrink-0 flex items-center justify-center font-bold"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-red-500/20 text-center space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-gray-200">
              <LogIn className="w-3.5 h-3.5 text-red-500" />
              <span>Sign in to join the conversation</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Only registered users can send text messages to all connected streamers.
            </p>
            <button
              type="button"
              onClick={onLoginClick}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-red-600/40 active:scale-95"
            >
              Sign In / Register Free
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityChatModal;
