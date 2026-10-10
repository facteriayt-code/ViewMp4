import { auth } from '../firebase.ts';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { GoogleChatSpace, GoogleChatMessage } from '../types.ts';

export const GOOGLE_CHAT_SCOPES = [
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.spaces.create',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.memberships',
  'https://www.googleapis.com/auth/chat.memberships.readonly',
];

export const GOOGLE_CLOUD_PROJECT_ID = 'gen-lang-client-0090031280';
export const CHAT_API_CONFIG_URL = `https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat?project=${GOOGLE_CLOUD_PROJECT_ID}`;

// In-memory token storage (NEVER store access token in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let currentChatUser: FirebaseUser | null = null;

// Keep token synced with Firebase auth state
onAuthStateChanged(auth, (user) => {
  currentChatUser = user;
  if (!user) {
    cachedAccessToken = null;
  }
});

export const getGoogleChatAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGoogleChatAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const isGoogleChatConnected = (): boolean => {
  return !!cachedAccessToken;
};

/**
 * Connect Google Chat via Google OAuth with Chat scopes
 */
export const connectGoogleChat = async (): Promise<{ token: string; user: FirebaseUser }> => {
  const provider = new GoogleAuthProvider();
  GOOGLE_CHAT_SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({ prompt: 'consent select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('No access token received from Google sign in');
    }

    cachedAccessToken = credential.accessToken;
    currentChatUser = result.user;
    return { token: cachedAccessToken, user: result.user };
  } catch (err: any) {
    console.error('Google Chat connection error:', err);
    throw err;
  }
};

export const disconnectGoogleChat = () => {
  cachedAccessToken = null;
};

/**
 * Fetch spaces (rooms & direct messages) for the authenticated Google user
 */
export const listGoogleChatSpaces = async (): Promise<GoogleChatSpace[]> => {
  if (!cachedAccessToken) {
    throw new Error('Google Chat is not connected. Please connect your Google account first.');
  }

  const res = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=100', {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}`;
    const code = errorData?.error?.code || res.status;
    const error = new Error(message);
    (error as any).status = code;
    (error as any).details = errorData?.error;
    throw error;
  }

  const data = await res.json();
  return data.spaces || [];
};

/**
 * Create a new space in Google Chat
 */
export const createGoogleChatSpace = async (displayName: string): Promise<GoogleChatSpace> => {
  if (!cachedAccessToken) {
    throw new Error('Google Chat is not connected.');
  }

  const res = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spaceType: 'SPACE',
      displayName: displayName.trim(),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}`;
    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).details = errorData?.error;
    throw error;
  }

  return await res.json();
};

/**
 * List messages from a specific Google Chat space
 */
export const listGoogleChatMessages = async (spaceName: string): Promise<GoogleChatMessage[]> => {
  if (!cachedAccessToken) {
    throw new Error('Google Chat is not connected.');
  }

  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=50`, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}`;
    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).details = errorData?.error;
    throw error;
  }

  const data = await res.json();
  const messages: GoogleChatMessage[] = data.messages || [];
  // Chat API returns newest messages first or sorted by createTime
  return messages.sort((a, b) => {
    const tA = a.createTime ? new Date(a.createTime).getTime() : 0;
    const tB = b.createTime ? new Date(b.createTime).getTime() : 0;
    return tA - tB;
  });
};

/**
 * Send a message to a Google Chat space
 */
export const sendGoogleChatMessage = async (spaceName: string, text: string): Promise<GoogleChatMessage> => {
  if (!cachedAccessToken) {
    throw new Error('Google Chat is not connected.');
  }

  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text.trim(),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}`;
    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).details = errorData?.error;
    throw error;
  }

  return await res.json();
};
