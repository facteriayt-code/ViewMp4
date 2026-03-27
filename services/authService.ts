
import { User } from '../types.ts';
import { auth } from '../firebase.ts';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';

/**
 * Firebase Authentication Service
 */

export const signUpEmail = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: name,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`
    });

    return {
      id: firebaseUser.uid,
      name: name,
      email: firebaseUser.email || email,
      avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`
    };
  } catch (error: any) {
    console.error("Firebase Sign Up Error:", error);
    throw error;
  }
};

export const loginEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Streamer',
      email: firebaseUser.email || email,
      avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=User&background=E50914&color=fff`
    };
  } catch (error: any) {
    console.error("Firebase Login Error:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("Firebase Google Sign-In Error:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Firebase Sign Out Error:", error);
    throw error;
  }
};
