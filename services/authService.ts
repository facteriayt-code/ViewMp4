
import { User } from '../types.ts';
import { supabase } from './supabaseClient.ts';

/**
 * Real Supabase Authentication Service
 */

export const signUpEmail = async (name: string, email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`
      }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error("Registration failed.");

  return {
    id: data.user.id,
    name: data.user.user_metadata.full_name || 'New User',
    email: data.user.email || email,
    avatar: data.user.user_metadata.avatar_url
  };
};

export const loginEmail = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("Login failed.");

  return {
    id: data.user.id,
    name: data.user.user_metadata.full_name || 'Streamer',
    email: data.user.email || email,
    avatar: data.user.user_metadata.avatar_url
  };
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
