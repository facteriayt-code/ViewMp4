
import React, { useState } from 'react';
import { User as UserType } from '../types.ts';
import { User, ChevronRight, Phone, Lock, UserPlus, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { signUpMobile, loginMobile } from '../services/authService.ts';

interface LoginModalProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
}

type AuthMode = 'google' | 'mobile-signin' | 'mobile-signup';

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (mode === 'mobile-signup') {
        user = await signUpMobile(name, mobile, password);
      } else {
        user = await loginMobile(mobile, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = (user: UserType) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(user);
      setLoading(false);
    }, 1000);
  };

  const mockGoogleAccounts = [
    { name: 'Google User', email: 'user@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
    { name: 'Creative Mind', email: 'creator@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#181818] text-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/10">
        
        <div className="flex border-b border-white/5">
          <button 
            disabled={loading}
            onClick={() => { setMode('google'); setError(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${mode === 'google' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-white'}`}
          >
            Google
          </button>
          <button 
            disabled={loading}
            onClick={() => { setMode('mobile-signin'); setError(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${mode !== 'google' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-white'}`}
          >
            Mobile
          </button>
        </div>

        <div className="p-8">
          {mode === 'google' ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Sign in with Google</h2>
                <p className="text-sm text-gray-400">Sync with your device account</p>
              </div>

              <div className="space-y-2">
                {mockGoogleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    disabled={loading}
                    onClick={() => handleGoogleMock({ id: acc.email, ...acc })}
                    className="w-full flex items-center p-3 bg-white/5 hover:bg-white/10 transition rounded-xl border border-white/5 disabled:opacity-50"
                  >
                    <img src={acc.avatar} className="w-10 h-10 rounded-full mr-4 border border-white/10" alt="" />
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-bold truncate">{acc.name}</p>
                      <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                    </div>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleMobileSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{mode === 'mobile-signin' ? 'Welcome Back' : 'Join GeminiStream'}</h2>
                <p className="text-sm text-gray-400">{mode === 'mobile-signin' ? 'Signing into Cloud Database' : 'Connecting to Global Server'}</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs text-center font-medium animate-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {mode === 'mobile-signup' && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      disabled={loading}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-red-600 outline-none transition disabled:opacity-50"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    required
                    disabled={loading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-red-600 outline-none transition disabled:opacity-50"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    disabled={loading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-red-600 outline-none transition disabled:opacity-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center space-x-2 active:scale-[0.98] shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'mobile-signin' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                <span>{loading ? 'Processing...' : (mode === 'mobile-signin' ? 'Sign In' : 'Sign Up Now')}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => { setMode(mode === 'mobile-signin' ? 'mobile-signup' : 'mobile-signin'); setError(null); }}
                  className="text-sm text-gray-400 hover:text-white transition disabled:opacity-50"
                >
                  {mode === 'mobile-signin' ? "New here? Sign up now." : "Already have an account? Sign in."}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 flex justify-center">
            <button 
              onClick={onClose}
              className="flex items-center text-xs text-gray-500 hover:text-white transition group"
            >
              <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
              Cancel and go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
