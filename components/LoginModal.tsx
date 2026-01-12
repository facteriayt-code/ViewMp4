
import React, { useState } from 'react';
import { Film, User, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types.ts';

interface LoginModalProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [step, setStep] = useState<'picker' | 'input'>('picker');
  const [loading, setLoading] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleLogin = (user: UserType) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(user);
      setLoading(false);
    }, 1200);
  };

  const mockAccounts = [
    { name: 'Google User', email: 'user@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
    { name: 'Creative Mind', email: 'creator@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-medium">Authenticating with Google...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-zinc-900 w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <h2 className="text-2xl font-normal text-[#202124] mb-2">Choose an account</h2>
          <p className="text-sm text-[#5f6368] mb-6">to continue to <span className="text-blue-600 font-medium">GeminiStream</span></p>

          <div className="space-y-1 text-left border-t border-gray-200 pt-2">
            {step === 'picker' ? (
              <>
                {mockAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleLogin({ id: acc.email, ...acc })}
                    className="w-full flex items-center p-3 hover:bg-gray-50 transition rounded-md border-b border-gray-100 last:border-0"
                  >
                    <img src={acc.avatar} className="w-8 h-8 rounded-full mr-3" alt="" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-[#3c4043] truncate">{acc.name}</p>
                      <p className="text-xs text-[#5f6368] truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setStep('input')}
                  className="w-full flex items-center p-3 hover:bg-gray-50 transition rounded-md"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-[#3c4043]">Use another account</p>
                </button>
              </>
            ) : (
              <div className="space-y-4 pt-2">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email or phone"
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                />
                <div className="flex justify-between items-center pt-4">
                  <button onClick={() => setStep('picker')} className="text-blue-600 text-sm font-medium hover:text-blue-700">Back</button>
                  <button
                    onClick={() => handleLogin({
                      id: customEmail || 'guest',
                      name: customName || 'New User',
                      email: customEmail || 'new@gmail.com',
                      avatar: `https://ui-avatars.com/api/?name=${customName || 'New User'}&background=random`
                    })}
                    className="bg-[#1a73e8] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#1b66c9] transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-left">
            <p className="text-xs text-[#5f6368] leading-relaxed">
              To continue, Google will share your name, email address, language preference, and profile picture with GeminiStream. Before using this app, you can review its <span className="text-blue-600 cursor-pointer">privacy policy</span> and <span className="text-blue-600 cursor-pointer">terms of service</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
