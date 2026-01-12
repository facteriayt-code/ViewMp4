
import { User } from '../types.ts';

const USERS_KEY = 'gemini_stream_mobile_users';

interface RegisteredUser extends User {
  password?: string;
  mobile?: string;
}

export const signUpMobile = (name: string, mobile: string, password: string): User | string => {
  const users: RegisteredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  if (users.some(u => u.mobile === mobile)) {
    return "This mobile number is already registered.";
  }

  const newUser: RegisteredUser = {
    id: 'mob_' + Math.random().toString(36).substr(2, 9),
    name,
    email: `${mobile}@geministream.com`,
    mobile,
    password, // In a real app, this would be hashed
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginMobile = (mobile: string, password: string): User | string => {
  const users: RegisteredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.mobile === mobile && u.password === password);
  
  if (!user) {
    return "Invalid mobile number or password.";
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
