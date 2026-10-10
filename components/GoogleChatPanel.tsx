import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Plus, RefreshCw, AlertCircle, ExternalLink, 
  CheckCircle2, LogIn, Users, Hash, ShieldAlert, ArrowLeft, Loader2, Sparkles, Check
} from 'lucide-react';
import { GoogleChatSpace, GoogleChatMessage, User } from '../types.ts';
import { 
  connectGoogleChat, 
  disconnectGoogleChat, 
  isGoogleChatConnected, 
  listGoogleChatSpaces, 
  createGoogleChatSpace, 
  listGoogleChatMessages, 
  sendGoogleChatMessage,
  CHAT_API_CONFIG_URL,
  GOOGLE_CLOUD_PROJECT_ID
} from '../services/googleChatService.ts';

interface GoogleChatPanelProps {
  user: User | null;
  onLoginClick: () => void;
  sharedMovieTitle?: string;
  onClearSharedMovie?: () => void;
}

export const GoogleChatPanel: React.FC<GoogleChatPanelProps> = ({
  user,
  onLoginClick,
  sharedMovieTitle,
  onClearSharedMovie
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(isGoogleChatConnected());
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<GoogleChatSpace | null>(null);
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [configUrlRequired, setConfigUrlRequired] = useState<boolean>(false);

  // New Space Creation Modal State
  const [showNewSpaceModal, setShowNewSpaceModal] = useState<boolean>(false);
  const [newSpaceName, setNewSpaceName] = useState<string>('');
  const [isCreatingSpace, setIsCreatingSpace] = useState<boolean>(false);

  // User Confirmation Dialog State for sending message (MANDATORY per Workspace guidelines)
  const [pendingSendMessage, setPendingSendMessage] = useState<{ spaceName: string; spaceTitle: string; text: string } | null>(null);

  // Pre-fill text if movie title was shared
  useEffect(() => {
    if (sharedMovieTitle) {
      setInputText(`🎬 Watch Party on GeminiStream: Check out "${sharedMovieTitle}"!`);
      onClearSharedMovie?.();
    }
  }, [sharedMovieTitle, onClearSharedMovie]);

  // Load spaces when connected
  useEffect(() => {
    if (isConnected) {
      loadSpaces();
    }
  }, [isConnected]);

  // Load messages when selected space changes
  useEffect(() => {
    if (selectedSpace) {
      loadMessages(selectedSpace.name);
    } else {
      setMessages([]);
    }
  }, [selectedSpace]);

  const handleConnect = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    setConfigUrlRequired(false);
    try {
      await connectGoogleChat();
      setIsConnected(true);
    } catch (err: any) {
      console.error('Google Chat connect error:', err);
      const msg = err.message || 'Failed to authenticate with Google Chat.';
      setErrorMessage(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    disconnectGoogleChat();
    setIsConnected(false);
    setSpaces([]);
    setSelectedSpace(null);
    setMessages([]);
  };

  const loadSpaces = async () => {
    setIsLoadingSpaces(true);
    setErrorMessage(null);
    setConfigUrlRequired(false);
    try {
      const fetchedSpaces = await listGoogleChatSpaces();
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0 && !selectedSpace) {
        setSelectedSpace(fetchedSpaces[0]);
      }
    } catch (err: any) {
      console.warn('Error listing spaces:', err);
      const msg = err.message || '';
      if (msg.includes('Google Chat app not found') || err.status === 404 || msg.includes('turn on the Chat API')) {
        setConfigUrlRequired(true);
        setErrorMessage(
          'Google Chat app configuration is required in Google Cloud Console. Click the setup link below to configure your app name and avatar.'
        );
      } else if (msg.includes('403') || msg.includes('permission') || msg.includes('Workspace')) {
        setErrorMessage(
          'Google Chat API requires a Google Workspace (business or school) account. Personal @gmail.com accounts are restricted by Google Chat policy.'
        );
      } else {
        setErrorMessage(msg || 'Unable to retrieve Google Chat spaces.');
      }
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadMessages = async (spaceName: string) => {
    setIsLoadingMessages(true);
    setErrorMessage(null);
    try {
      const fetchedMessages = await listGoogleChatMessages(spaceName);
      setMessages(fetchedMessages);
    } catch (err: any) {
      console.warn('Error listing messages:', err);
      const msg = err.message || '';
      if (msg.includes('Google Chat app not found') || err.status === 404) {
        setConfigUrlRequired(true);
      }
      setErrorMessage(msg || 'Unable to load messages for this space.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    setIsCreatingSpace(true);
    setErrorMessage(null);
    try {
      const created = await createGoogleChatSpace(newSpaceName.trim());
      setShowNewSpaceModal(false);
      setNewSpaceName('');
      await loadSpaces();
      setSelectedSpace(created);
    } catch (err: any) {
      console.error('Error creating space:', err);
      const msg = err.message || 'Failed to create Google Chat space.';
      if (msg.includes('Google Chat app not found') || err.status === 404) {
        setConfigUrlRequired(true);
      }
      setErrorMessage(msg);
    } finally {
      setIsCreatingSpace(false);
    }
  };

  // Step 1 of send: Prompt user for explicit confirmation (Mandatory for Workspace operations)
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedSpace) return;

    setPendingSendMessage({
      spaceName: selectedSpace.name,
      spaceTitle: selectedSpace.displayName || selectedSpace.name,
      text: inputText.trim()
    });
  };

  // Step 2 of send: Confirmed by user in modal dialog
  const handleConfirmSend = async () => {
    if (!pendingSendMessage) return;

    const { spaceName, text } = pendingSendMessage;
    setPendingSendMessage(null);
    setIsSending(true);
    setErrorMessage(null);

    try {
      await sendGoogleChatMessage(spaceName, text);
      setInputText('');
      // Refresh messages
      await loadMessages(spaceName);
    } catch (err: any) {
      console.error('Error sending Google Chat message:', err);
      const msg = err.message || 'Failed to post message to Google Chat.';
      if (msg.includes('Google Chat app not found') || err.status === 404) {
        setConfigUrlRequired(true);
      }
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090b11] text-gray-200">
      {/* ── NOT CONNECTED VIEW ── */}
      {!isConnected ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
          </div>

          <div className="max-w-xs space-y-1">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Google Chat Integration
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Connect your Google Workspace account to read spaces, start watch party discussions, and send messages directly from GeminiStream.
            </p>
          </div>

          {/* Official Google Sign-In Material Button */}
          <button
            type="button"
            onClick={handleConnect}
            disabled={isAuthenticating}
            className="flex items-center space-x-3 px-5 py-3 rounded-full bg-white text-gray-900 font-medium text-xs shadow-lg hover:bg-gray-100 transition active:scale-95 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            <span className="font-semibold tracking-wide">
              {isAuthenticating ? 'Connecting...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Info Badge */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-w-xs text-[11px] text-gray-400 text-left space-y-1">
            <div className="flex items-center space-x-1.5 text-blue-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Features</span>
            </div>
            <p>
              Requires a Google Workspace account. Scopes granted will only be used to read and post chat messages with your permission.
            </p>
          </div>
        </div>
      ) : (
        /* ── CONNECTED VIEW ── */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Space Selector Bar */}
          <div className="p-3 bg-zinc-950/80 border-b border-white/10 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider shrink-0">
                Space:
              </span>
              <div className="relative flex-1 min-w-0">
                <select
                  value={selectedSpace?.name || ''}
                  onChange={(e) => {
                    const match = spaces.find(s => s.name === e.target.value);
                    if (match) setSelectedSpace(match);
                  }}
                  className="w-full bg-[#131722] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500 appearance-none truncate pr-6 cursor-pointer"
                >
                  {spaces.length === 0 ? (
                    <option value="">No spaces found</option>
                  ) : (
                    spaces.map(s => (
                      <option key={s.name} value={s.name}>
                        {s.displayName || s.name.replace('spaces/', 'Space ')}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Actions: + New Space, Refresh, Disconnect */}
            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowNewSpaceModal(true)}
                className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition text-xs flex items-center space-x-1"
                title="Create New Space"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-[10px] font-bold">New</span>
              </button>

              <button
                type="button"
                onClick={loadSpaces}
                disabled={isLoadingSpaces}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                title="Refresh spaces"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpaces ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                className="px-2 py-1 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-[10px] font-semibold transition"
                title="Sign out of Google Chat"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Error / Cloud Console Notice */}
          {errorMessage && (
            <div className="m-3 p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 space-y-2 shrink-0 animate-in fade-in">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{errorMessage}</p>
                  {configUrlRequired && (
                    <div className="pt-1">
                      <a
                        href={CHAT_API_CONFIG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 transition shadow"
                      >
                        <span>Configure Google Chat App in Console</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <p className="text-[10px] text-gray-400 mt-1">
                        One-time Google Cloud setup: set App name and Avatar URL, then refresh.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {isLoadingMessages ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Loading space messages...</span>
              </div>
            ) : spaces.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
                <Hash className="w-8 h-8 text-gray-600" />
                <p className="text-xs font-semibold text-gray-300">No Google Chat spaces found</p>
                <p className="text-[11px] max-w-xs text-gray-500">
                  Click the "+ New" button above to create a dedicated space for GeminiStream watch parties and movie discussions.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-600" />
                <p className="text-xs font-semibold text-gray-300">No messages in this space yet</p>
                <p className="text-[11px] max-w-xs text-gray-500">
                  Start the conversation below or share a movie watch party announcement.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const senderName = m.sender?.displayName || 'User';
                const avatar = m.sender?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=3B82F6&color=fff`;
                const dateStr = m.createTime ? new Date(m.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                return (
                  <div key={m.name} className="flex items-start space-x-2.5">
                    <img
                      src={avatar}
                      alt={senderName}
                      className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0 bg-[#141824] border border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <span className="text-[11px] font-bold text-blue-400 truncate">
                          {senderName}
                        </span>
                        <span className="text-[9px] text-gray-500 shrink-0">
                          {dateStr}
                        </span>
                      </div>
                      <p className="text-xs text-gray-200 break-words leading-relaxed">
                        {m.text || m.formattedText}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input Form */}
          <form
            onSubmit={handleInitiateSend}
            className="p-3 bg-zinc-950 border-t border-white/10 flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedSpace ? `Message ${selectedSpace.displayName || 'space'}...` : 'Select a space first'}
              disabled={!selectedSpace || isSending}
              className="flex-1 bg-[#131722] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || !selectedSpace || isSending}
              className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 shrink-0 shadow-lg shadow-blue-600/30"
              title="Send to Google Chat space"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── MANDATORY CONFIRMATION MODAL (Destructive/Mutating operations guard) ── */}
      {pendingSendMessage && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121622] border border-white/20 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Confirm Google Chat Message
                </h4>
                <p className="text-[11px] text-gray-400">
                  Target Space: <span className="text-blue-400 font-bold">{pendingSendMessage.spaceTitle}</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-300 italic break-words">
              "{pendingSendMessage.text}"
            </div>

            <p className="text-[11px] text-gray-400">
              This operation will publish this message to your organization's Google Chat space on your behalf with permission.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingSendMessage(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE NEW SPACE MODAL ── */}
      {showNewSpaceModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form 
            onSubmit={handleCreateSpace}
            className="bg-[#121622] border border-white/20 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Create Google Chat Space
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowNewSpaceModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Space Name
              </label>
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="e.g. GeminiStream Watch Party"
                className="w-full bg-[#181d2c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewSpaceModal(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newSpaceName.trim() || isCreatingSpace}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow disabled:opacity-50"
              >
                {isCreatingSpace ? 'Creating...' : 'Create Space'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
