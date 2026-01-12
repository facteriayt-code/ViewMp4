
import { User } from '../types.ts';
import { supabase } from './supabaseClient.ts';

export const signUpMobile = async (name: string, mobile: string, password: string): Promise<User> => {
  // Supabase Auth typically requires an email. We'll derive one from the mobile number.
  const email = `${mobile}@geministream.com`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        mobile_number: mobile,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`
      }
    }
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Registration failed.");

  return {
    id: data.user.id,
    name: data.user.user_metadata.full_name,
    email: data.user.email || email,
    avatar: data.user.user_metadata.avatar_url
  };
};

export const loginMobile = async (mobile: string, password: string): Promise<User> => {
  const email = `${mobile}@geministream.com`;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Login failed.");

  return {
    id: data.user.id,
    name: data.user.user_metadata.full_name,
    email: data.user.email || email,
    avatar: data.user.user_metadata.avatar_url
  };
};
