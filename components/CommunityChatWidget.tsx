import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { communityChatService } from '../services/communityChatService.ts';

interface CommunityChatWidgetProps {
  onOpenChat: () => void;
  isOpen: boolean;
}

export const CommunityChatWidget: React.FC<CommunityChatWidgetProps> = ({
  onOpenChat,
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

  // Clear unread badge when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      <button
        type="button"
        onClick={onOpenChat}
        className="group relative flex items-center space-x-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#0d0f17]/95 hover:bg-black text-white border border-white/20 hover:border-red-500/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
        title="Open Community Live Chat (All users connected, 12h auto-delete)"
      >
        {/* Glowing live pulse background */}
        <div className="absolute inset-0 rounded-full bg-red-600/10 group-hover:bg-red-600/20 transition-colors" />

        {/* Message Icon with badge */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/50 group-hover:rotate-6 transition-transform">
            <MessageSquare className="w-4 h-4 fill-white" />
          </div>
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-black animate-bounce" />
          )}
        </div>

        {/* Label & Online Presence */}
        <div className="text-left flex flex-col pr-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-black tracking-wider uppercase text-white group-hover:text-red-400 transition-colors">
              Community Chat
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-gray-400 font-medium flex items-center space-x-1">
            <span>{onlineCount} online</span>
            <span>•</span>
            <span className="text-amber-400/90 font-semibold">12h purge</span>
          </span>
        </div>
      </button>
    </div>
  );
};

export default CommunityChatWidget;
