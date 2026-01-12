
import { User } from '../types.ts';
import { api } from './apiService.ts';

/**
 * Communicates with /api/auth endpoints on Vercel
 * Includes special bypass for site admin credentials
 */

export const signUpMobile = async (name: string, mobile: string, password: string): Promise<User> => {
  try {
    const user = await api.post('/auth/signup', { name, mobile, password });
    return user;
  } catch (error: any) {
    console.error("Signup Error:", error);
    throw new Error(error.message || "Failed to register. Please try again.");
  }
};

export const loginMobile = async (mobile: string, password: string): Promise<User> => {
  // Special Admin Bypass for provided credentials
  if (mobile === 'admin' && password === 'Anish123') {
    return {
      id: 'admin-account-anish',
      name: 'Admin User',
      email: 'admin@geministream.live',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      role: 'admin'
    };
  }

  try {
    const user = await api.post('/auth/login', { mobile, password });
    return user;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw new Error(error.message || "Invalid credentials.");
  }
};
