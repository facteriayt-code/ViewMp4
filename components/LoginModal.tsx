
import React, { useState } from 'react';
import { User as UserType } from '../types.ts';
import { Mail, ChevronRight, Phone, Lock, UserPlus, LogIn, ArrowLeft, Loader2, Globe } from 'lucide-react';
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
      // Supabase OAuth redirects away, so loading state handles the wait
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
      setLoading(false);
    }
  };

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
            onClick={() => { setMode('email-signin'); setError(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${mode !== 'google' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-white'}`}
          >
            Email
          </button>
        </div>

        <div className="p-8">
          {mode === 'google' ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center">
                  <Globe className="w-6 h-6 mr-2 text-blue-500" />
                  Real-time Sync
                </h2>
                <p className="text-sm text-gray-400">Continue with your Google Account</p>
              </div>

              <div className="space-y-4">
                 <button
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center p-4 bg-white text-black hover:bg-gray-200 transition rounded-xl font-bold shadow-lg shadow-white/5 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-3" alt="G" />
                    )}
                    {loading ? 'Redirecting to Google...' : 'Sign in with Google'}
                  </button>
                  
                  <p className="text-[10px] text-gray-500 text-center leading-relaxed px-4">
                    By choosing Google, you'll be redirected to Supabase's secure login portal to complete your authentication.
                  </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{mode === 'email-signin' ? 'Welcome Back' : 'Join GeminiStream'}</h2>
                <p className="text-sm text-gray-400">Powered by Supabase Secure Auth</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs text-center font-medium animate-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {mode === 'email-signup' && (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={loading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-red-600 outline-none transition disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'email-signin' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                <span>{loading ? 'Authenticating...' : (mode === 'email-signin' ? 'Sign In' : 'Sign Up Now')}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => { setMode(mode === 'email-signin' ? 'email-signup' : 'email-signin'); setError(null); }}
                  className="text-sm text-gray-400 hover:text-white transition disabled:opacity-50"
                >
                  {mode === 'email-signin' ? "New here? Sign up now." : "Already have an account? Sign in."}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 flex justify-center">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex items-center text-xs text-gray-500 hover:text-white transition group disabled:opacity-50"
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
