
import React, { useState } from 'react';
import { X, Film, Mail } from 'lucide-react';
import { User } from '../types.ts';

interface LoginModalProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleMockGoogleLogin = () => {
    setLoading(true);
    // Simulate OAuth delay
    setTimeout(() => {
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Alex Streamer',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#181818] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center rotate-3 shadow-xl">
             <Film className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-white tracking-tight">Welcome to GeminiStream</h2>
        <p className="text-gray-400">Sign in to sync your watch history and publish content to the world.</p>

        <button 
          onClick={handleMockGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-xl transition flex items-center justify-center space-x-3 hover:bg-gray-200 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
        </div>
        
        <button onClick={onClose} className="text-gray-500 text-sm hover:text-white transition">Cancel</button>
      </div>
    </div>
  );
};

export default LoginModal;
