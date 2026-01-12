
import { User } from '../types.ts';
import { api } from './apiService.ts';

/**
 * Communicates with /api/auth endpoints on Vercel
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
  try {
    const user = await api.post('/auth/login', { mobile, password });
    return user;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw new Error(error.message || "Invalid credentials.");
  }
};
