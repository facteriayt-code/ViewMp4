import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { communityChatService } from '../services/communityChatService.ts';

interface CommunityChatWidgetProps {
  onOpenChat: () => void;
  onOpenGoogleChat?: () => void;
  isOpen: boolean;
}

export const CommunityChatWidget: React.FC<CommunityChatWidgetProps> = ({
  onOpenChat,
  onOpenGoogleChat,
  isOpen
}) => {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

  useEffect(() => {
    communityChatService.connect();

    const unsubPresence = communityChatService.subscribePresence((count) => {
      setOnlineCount(count);
    });

    let prevCount = communityChatService.getMessages().length;
    const unsubMessages = communityChatService.subscribeMessages((msgs) => {
      if (msgs.length > prevCount && !isOpen) {
        setHasNewMessage(true);
      }
      prevCount = msgs.length;
    });

    return () => {
      unsubPresence();
      unsubMessages();
    };
  }, [isOpen]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Clear unread badge when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  if (isOpen) return null;

  if (isCollapsed) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-[45]">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#0d0f17]/95 hover:bg-black text-white border border-white/20 shadow-xl backdrop-blur-xl transition active:scale-95 group"
          title="Open Chat Options"
        >
          <MessageSquare className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-[#0d0f17]" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2 fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-[45]">
      {/* 1. Dedicated Google Chat Quick Action Pill */}
      {onOpenGoogleChat && (
        <button
          type="button"
          onClick={onOpenGoogleChat}
          className="group relative flex items-center space-x-2 px-3 py-2 rounded-full bg-[#0a1122]/95 hover:bg-[#0e172e] text-blue-200 hover:text-white border border-blue-500/40 hover:border-blue-400 shadow-[0_10px_35px_rgba(30,58,138,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
          title="Open Google Workspace Chat (Spaces & Messages)"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/50 group-hover:rotate-6 transition-transform">
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
          </div>
          <span className="text-xs font-black tracking-wider uppercase pr-1 text-blue-100">
            Google Chat
          </span>
        </button>
      )}

      {/* 2. Community Live Stream Chat Action */}
      <button
        type="button"
        onClick={onOpenChat}
        className="group relative flex items-center space-x-2 px-3 py-2 rounded-full bg-[#0d0f17]/95 hover:bg-black text-white border border-white/20 hover:border-red-500/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
        title="Open Community Live Chat (All users connected, 12h auto-delete)"
      >
        {/* Message Icon with badge */}
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/50 group-hover:rotate-6 transition-transform">
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
          </div>
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-black animate-bounce" />
          )}
        </div>

        {/* Label & Online Presence */}
        <div className="text-left flex flex-col pr-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-black tracking-wider uppercase text-white group-hover:text-red-400 transition-colors">
              Live Stream
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            {onlineCount} online
          </span>
        </div>
      </button>

      {/* Minimize Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed(true)}
        className="w-6 h-6 rounded-full bg-black/60 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center text-xs transition shrink-0"
        title="Hide chat buttons"
      >
        ×
      </button>
    </div>
  );
};
