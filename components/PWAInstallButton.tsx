import React, { useState } from 'react';
import { Download, Monitor, Smartphone, CheckCircle, X, Sparkles, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'banner' | 'dropdown';
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
  onInstalled
}) => {
  const { isInstallable, isInstalled, isIOS, isChrome, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running inside installed standalone PWA, completely hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isInstallable) {
      setInstalling(true);
      const success = await install();
      setInstalling(false);
      if (success && onInstalled) {
        onInstalled();
      }
    } else {
      // Show guided instructions for Chrome or iOS
      setShowGuideModal(true);
    }
  };

  // Render modal guide for manual installation if automatic prompt is not yet triggered
  const renderGuideModal = () => {
    if (!showGuideModal) return null;

    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
        onClick={() => setShowGuideModal(false)}
      >
        <div 
          className="relative w-full max-w-md bg-gradient-to-b from-[#181b24] to-[#0c0e14] border border-red-500/30 rounded-2xl p-6 shadow-2xl text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowGuideModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center p-2.5 shadow-lg shadow-red-600/30">
              <img src="/icon.svg" alt="GeminiStream Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Install GeminiStream
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-zinc-400">Standalone App with zero buffering</p>
            </div>
          </div>

          <div className="space-y-4 my-5 text-sm text-zinc-300">
            {isIOS ? (
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2.5">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-red-400" />
                  Install on iPhone / iPad (Safari):
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-300">
                  <li>Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari.</li>
                  <li>Scroll down and tap <strong className="text-amber-400 font-semibold">Add to Home Screen</strong>.</li>
                  <li>Tap <strong className="text-red-400 font-semibold">Add</strong> in top-right.</li>
                </ol>
              </div>
            ) : (
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-red-500" />
                  Install on Google Chrome:
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Look for the <strong>Install GeminiStream</strong> icon <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px]">⊕</span> on the right side of Chrome's address bar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Or click the <strong>three dots (⋮)</strong> menu in Chrome &gt; select <strong>Save and share</strong> &gt; <strong>Install GeminiStream...</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Confirm <strong>Install</strong> to launch GeminiStream in its own window with zero distractions.</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Full screen playback, offline cache & instant desktop/mobile launcher.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            {isInstallable && (
              <button
                onClick={() => handleInstallClick()}
                disabled={installing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-medium text-xs tracking-wide shadow-lg shadow-red-600/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {installing ? 'Opening Install Dialog...' : 'Install Now'}
              </button>
            )}
            <button
              onClick={() => setShowGuideModal(false)}
              className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Header Button Variant
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          title="Install GeminiStream Web App"
          className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/20 via-red-500/10 to-amber-500/20 hover:from-red-600/30 hover:to-amber-500/30 border border-red-500/30 hover:border-red-400/60 text-xs font-semibold text-zinc-100 hover:text-white transition shadow-sm hover:shadow-red-500/20 active:scale-95 ${className}`}
        >
          <div className="w-4 h-4 rounded-full bg-red-600/40 text-red-400 flex items-center justify-center group-hover:scale-110 transition">
            <Download className="w-2.5 h-2.5" />
          </div>
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
          {isInstallable && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
        </button>
        {renderGuideModal()}
      </>
    );
  }

  // Banner Variant (optional bottom/floating prompt)
  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-[#181a22] via-[#1b1720] to-[#14161f] border border-red-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shrink-0 shadow-md">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Install GeminiStream Web App
                <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold rounded bg-red-600/30 text-red-400 border border-red-600/40">
                  PWA
                </span>
              </h4>
              <p className="text-xs text-zinc-400">Launch directly from home screen or desktop with faster loading and zero browser chrome.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs transition shadow-md shadow-red-600/20 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Install Now
            </button>
          </div>
        </div>
        {renderGuideModal()}
      </>
    );
  }

  // Dropdown Item Variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/80 rounded-lg transition text-left ${className}`}
      >
        <Download className="w-4 h-4 text-red-400 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold">Install GeminiStream App</div>
          <div className="text-[10px] text-zinc-400">Standalone cinema experience</div>
        </div>
      </button>
      {renderGuideModal()}
    </>
  );
};

export default PWAInstallButton;
