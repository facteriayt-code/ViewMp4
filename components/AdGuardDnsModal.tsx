import React, { useState } from 'react';
import { 
  X, ShieldCheck, Copy, Check, Smartphone, Apple, Monitor, Globe, 
  ExternalLink, Sparkles, CheckCircle2, ChevronRight, Info
} from 'lucide-react';

interface AdGuardDnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlatformTab = 'android' | 'ios' | 'windows' | 'mac' | 'browser';

export const AdGuardDnsModal: React.FC<AdGuardDnsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('android');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-zinc-900/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Block All Ads with AdGuard DNS</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase border border-emerald-500/30 font-bold">
                  Step-by-Step
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                100% Free • No App Required • Blocks all pop-ups without breaking video playback
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="px-4 py-2.5 border-b border-white/10 bg-zinc-900/40 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'android'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800/80 text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android (Instant)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'ios'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800/80 text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('windows')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'windows'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800/80 text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows PC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mac')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'mac'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800/80 text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Mac (macOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('browser')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'browser'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800/80 text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Chrome / Browser</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick Copy DNS Hostname Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                AdGuard Private DNS Hostname:
              </div>
              <div className="font-mono text-sm sm:text-base font-black text-white mt-0.5 select-all">
                dns.adguard-dns.com
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('dns.adguard-dns.com', 'hostname')}
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shrink-0"
            >
              {copiedKey === 'hostname' ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Hostname</span>
                </>
              )}
            </button>
          </div>

          {/* TAB 1: ANDROID */}
          {activeTab === 'android' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android Setup (Takes 30 seconds):</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <div className="text-gray-300">
                    Open your phone's <strong className="text-white">Settings</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <div className="text-gray-300">
                    Tap <strong className="text-white">Network & internet</strong> (or <strong className="text-white">Connections</strong> / <strong className="text-white">More connection settings</strong>).
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <div className="text-gray-300">
                    Scroll down and tap <strong className="text-white">Private DNS</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
                  <div className="text-gray-300">
                    Select <strong className="text-white">Private DNS provider hostname</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-emerald-500/30">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">5</span>
                  <div className="text-gray-300 space-y-1">
                    <div>Type or paste: <code className="text-emerald-400 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded">dns.adguard-dns.com</code></div>
                    <div>Tap <strong className="text-white">Save</strong>. All video player pop-ups and ads are now blocked system-wide!</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: iOS (iPhone / iPad) */}
          {activeTab === 'ios' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Apple className="w-4 h-4 text-emerald-400" />
                <span>iPhone / iPad Setup:</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <div className="text-gray-300">
                    Open <strong className="text-white">Settings</strong> on your iOS device and tap <strong className="text-white">Wi-Fi</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <div className="text-gray-300">
                    Tap the blue <strong className="text-white">ⓘ (Info)</strong> icon next to your connected Wi-Fi network.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <div className="text-gray-300">
                    Scroll down, tap <strong className="text-white">Configure DNS</strong>, and choose <strong className="text-white">Manual</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-emerald-500/30">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
                  <div className="text-gray-300 space-y-1.5">
                    <div>Tap <strong className="text-white">Add Server</strong> and enter AdGuard DNS IPs:</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-emerald-300 bg-black/60 px-2 py-1 rounded">94.140.14.14</span>
                      <span className="font-mono text-emerald-300 bg-black/60 px-2 py-1 rounded">94.140.15.15</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('94.140.14.14', 'dns_ip')}
                        className="text-[10px] text-gray-400 hover:text-white underline font-mono"
                      >
                        {copiedKey === 'dns_ip' ? 'Copied IP!' : 'Copy IP'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">5</span>
                  <div className="text-gray-300">
                    Tap <strong className="text-white">Save</strong> in the top-right corner.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WINDOWS */}
          {activeTab === 'windows' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Windows 10 / 11 Setup:</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <div className="text-gray-300">
                    Press <strong className="text-white">Win + I</strong> to open <strong className="text-white">Settings</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <div className="text-gray-300">
                    Click <strong className="text-white">Network & internet</strong>, then click on your connection (<strong className="text-white">Wi-Fi</strong> or <strong className="text-white">Ethernet</strong>).
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <div className="text-gray-300">
                    Next to <strong className="text-white">DNS server assignment</strong>, click <strong className="text-white">Edit</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-emerald-500/30">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
                  <div className="text-gray-300 space-y-1">
                    <div>Select <strong className="text-white">Manual</strong>, turn on <strong className="text-white">IPv4</strong>, and enter:</div>
                    <div className="font-mono text-emerald-300 bg-black/60 p-2 rounded space-y-1">
                      <div>Preferred DNS: <strong>94.140.14.14</strong></div>
                      <div>Alternate DNS: <strong>94.140.15.15</strong></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">5</span>
                  <div className="text-gray-300">
                    Click <strong className="text-white">Save</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MAC */}
          {activeTab === 'mac' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Apple className="w-4 h-4 text-emerald-400" />
                <span>macOS Setup:</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <div className="text-gray-300">
                    Click the Apple menu  → <strong className="text-white">System Settings</strong> → <strong className="text-white">Network</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <div className="text-gray-300">
                    Select your active connection (<strong className="text-white">Wi-Fi</strong> or <strong className="text-white">Ethernet</strong>), then click <strong className="text-white">Details...</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <div className="text-gray-300">
                    In the sidebar, click <strong className="text-white">DNS</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-emerald-500/30">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
                  <div className="text-gray-300 space-y-1">
                    <div>Click the <strong className="text-white">+</strong> button and add:</div>
                    <div className="font-mono text-emerald-300 bg-black/60 p-2 rounded">
                      <div>94.140.14.14</div>
                      <div>94.140.15.15</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">5</span>
                  <div className="text-gray-300">
                    Click <strong className="text-white">OK</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BROWSER */}
          {activeTab === 'browser' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Chrome / Brave / Edge Setup:</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <div className="text-gray-300">
                    Open your browser <strong className="text-white">Settings</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <div className="text-gray-300">
                    Go to <strong className="text-white">Privacy and security</strong> → <strong className="text-white">Security</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <div className="text-gray-300">
                    Find <strong className="text-white">Use secure DNS</strong> and select <strong className="text-white">With: Custom</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 bg-zinc-900/80 p-3 rounded-2xl border border-emerald-500/30">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
                  <div className="text-gray-300 space-y-1.5">
                    <div>Paste this AdGuard DNS URL:</div>
                    <div className="flex items-center space-x-2">
                      <code className="text-emerald-400 font-mono text-[11px] bg-black/60 px-2 py-1 rounded break-all">
                        https://dns.adguard-dns.com/dns-query
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy('https://dns.adguard-dns.com/dns-query', 'doh')}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold"
                      >
                        {copiedKey === 'doh' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Note */}
          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-start space-x-2.5 text-xs">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-300 leading-relaxed">
              <strong className="text-white font-bold">Why AdGuard DNS?</strong> It blocks advertisements and malicious pop-ups directly at the domain level before they can even load, completely eliminating video player ads without breaking video playback or requiring any extensions.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-zinc-900 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition active:scale-95 shadow-lg"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
