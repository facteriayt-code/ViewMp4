import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, X, Clock, Sparkles, Smile, ShieldCheck, 
  User as UserIcon, AlertCircle, ChevronDown, CheckCircle2, Flame, LogIn
} from 'lucide-react';
import { User } from '../types.ts';
import { ChatMessage, subscribeToLiveChat, sendChatMessage } from '../services/chatService.ts';

interface LiveStreamChatProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLoginClick: () => void;
}

const QUICK_EMOJIS = ['🔥', '🍿', '🚀', '❤️', '👏', '😱', '💯'];

export const LiveStreamChat: React.FC<LiveStreamChatProps> = ({
  isOpen,
  onClose,
  user,
  onLoginClick
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubscribe = subscribeToLiveChat((liveMessages) => {
      setMessages(liveMessages);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && user) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, user]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      onLoginClick();
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      await sendChatMessage(user, trimmed);
      setInputText('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const formatMessageTime = (createdAt: number) => {
    const diffMs = Date.now() - createdAt;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const hours = Math.floor(diffMins / 60);
    if (hours < 12) return `${hours}h ago`;
    return '12h ago';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 md:w-[410px] sm:h-[540px] z-[160] flex flex-col bg-[#0b0d14]/98 backdrop-blur-2xl sm:rounded-3xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Chat Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10 bg-white/[0.02] shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="relative p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shadow-md">
            <MessageSquare className="w-4 h-4 text-red-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Live Community Chat
              </h3>
              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded bg-green-950 text-green-400 border border-green-500/30">
                Connected
              </span>
            </div>
            <p className="text-[10px] text-gray-400 flex items-center space-x-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-amber-400 inline" />
              <span>Messages auto-delete in 12 hours</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition active:scale-90"
          aria-label="Close Chat"
          title="Minimize Chat"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* 2. Chat Notice Banner */}
      <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5 truncate">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">All registered users are connected live!</span>
        </span>
        <span className="text-[10px] font-bold text-gray-400 shrink-0 ml-1">
          {messages.length} msgs
        </span>
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 no-scrollbar overscroll-contain">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isSelf = user?.id === msg.senderId;

            return (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-2.5 ${isSelf ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20 shrink-0 mt-0.5"
                />

                <div className={`max-w-[78%] space-y-1 ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center space-x-1.5 text-[10px] ${isSelf ? 'justify-end' : ''}`}>
                    <span className="font-bold text-gray-300 truncate max-w-[120px]">
                      {isSelf ? 'You' : msg.senderName}
                    </span>
                    <span className="text-[9px] text-gray-500">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>

                  <div 
                    className={`px-3 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-md ${
                      isSelf 
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white rounded-tr-xs' 
                        : 'bg-white/[0.07] hover:bg-white/[0.09] text-gray-100 border border-white/10 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-400">
            <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Messages Yet</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                Chat messages automatically vanish after 12 hours. Say hello to everyone watching right now!
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Reaction Emojis */}
      <div className="flex items-center space-x-1 px-3 py-1.5 border-t border-white/5 bg-black/40 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-gray-500 mr-1 shrink-0">React:</span>
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleAddEmoji(emoji)}
            className="p-1 hover:bg-white/10 rounded-lg text-sm transition active:scale-90 shrink-0"
            title={`Add ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 5. Input Area */}
      <div className="p-3 border-t border-white/10 bg-black/60 shrink-0">
        {user ? (
          <form onSubmit={handleSendMessage} className="space-y-1">
            {error && (
              <div className="text-[11px] text-red-400 flex items-center space-x-1 pb-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="truncate">{error}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to viewers..."
                maxLength={500}
                className="flex-1 bg-white/[0.05] focus:bg-white/[0.09] border border-white/15 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none transition shadow-inner"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center active:scale-95 shadow-md ${
                  inputText.trim() && !isSending 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30' 
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center text-[9px] text-gray-500 px-1 pt-0.5">
              <span>Press Enter to send</span>
              <span>{inputText.length}/500</span>
            </div>
          </form>
        ) : (
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-2">
            <p className="text-xs text-gray-300">
              Only registered users can send messages in the community chat.
            </p>
            <button
              type="button"
              onClick={onLoginClick}
              className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 active:scale-95 shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google to Chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamChat;
