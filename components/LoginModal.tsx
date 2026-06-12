import React, { useState } from 'react';
import { User as UserType } from '../types.ts';
import { Mail, Loader2, Globe, Trophy } from 'lucide-react';
import { signUpEmail, loginEmail, signInWithGoogle } from '../services/authService.ts';

interface LoginModalProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
}

type AuthMode = 'google' | 'email-signin' | 'email-signup';

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (mode === 'email-signup') {
        user = await signUpEmail(name, email, password);
      } else {
        user = await loginEmail(email, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || "Google Sign-In failed. Please check if popups are blocked.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0E1726] text-white w-full max-w-[450px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#D4AF37]/30">
        
        <div className="flex border-b border-[#D4AF37]/10">
          <button 
            disabled={loading}
            onClick={() => { setMode('google'); setError(null); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${mode === 'google' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
          >
            Google Cloud Sync
          </button>
          <button 
            disabled={loading}
            onClick={() => { setMode('email-signin'); setError(null); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${mode !== 'google' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
          >
            Traditional Email
          </button>
        </div>

        <div className="p-8">
          {mode === 'google' ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-2xl shadow-lg">
                  <Trophy className="w-6 h-6 text-[#0B132B]" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-sans mt-2">
                  Ledger Sync
                </h2>
                <p className="text-xs text-gray-400">Securely backup matches, players, and teams in real-time.</p>
              </div>

              <div className="space-y-4">
                 <button
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center p-4 bg-[#D4AF37] text-[#0B132B] hover:scale-[1.01] transition-all rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="G" />
                    )}
                    {loading ? 'Authenticating...' : 'Sign in with Google'}
                  </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === 'email-signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Arthur Pendragon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="legend@ledger.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : mode === 'email-signup' ? 'Regal Sign Up' : 'Secure Sign In'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'email-signin' ? 'email-signup' : 'email-signin')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  {mode === 'email-signin' ? "Don't have a ledger account? Sign Up" : 'Already partitioned? Sign In'}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
              {error}
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <button 
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-white uppercase font-bold tracking-wider"
            >
              Close and remain as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
