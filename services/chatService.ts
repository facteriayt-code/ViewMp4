import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { User } from '../types.ts';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: number;
  expiresAt: number;
}

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const MESSAGES_COLLECTION = 'messages';

/**
 * Real-time listener for connected community live chat.
 * Automatically filters out and purges any message older than 12 hours.
 */
export const subscribeToLiveChat = (
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const twelveHoursAgo = Date.now() - TWELVE_HOURS_MS;

  // Query recent messages ordered by createdAt
  const q = query(
    messagesRef,
    where('createdAt', '>=', twelveHoursAgo),
    orderBy('createdAt', 'asc'),
    limit(150)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const now = Date.now();
      const validMessages: ChatMessage[] = [];
      const expiredDocIds: string[] = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
        const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : (createdAt + TWELVE_HOURS_MS);

        // Check if message is older than 12 hours
        if (now - createdAt >= TWELVE_HOURS_MS || now >= expiresAt) {
          expiredDocIds.push(docSnap.id);
        } else {
          validMessages.push({
            id: docSnap.id,
            senderId: data.senderId || 'unknown',
            senderName: data.senderName || 'Anonymous',
            senderAvatar: data.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
            text: data.text || '',
            createdAt,
            expiresAt
          });
        }
      });

      // Background cleanup of expired messages (>12 hours old)
      if (expiredDocIds.length > 0) {
        expiredDocIds.forEach((id) => {
          deleteDoc(doc(db, MESSAGES_COLLECTION, id)).catch((err) => {
            console.warn('Failed to delete expired message:', err);
          });
        });
      }

      callback(validMessages);
    },
    (error) => {
      console.warn('Live chat Firestore listener warning (falling back to local cache):', error);
      // Fallback query without complex order if indexing is pending
      const fallbackQuery = query(messagesRef, limit(100));
      onSnapshot(fallbackQuery, (fallbackSnapshot) => {
        const now = Date.now();
        const fallbackMessages: ChatMessage[] = [];
        fallbackSnapshot.docs.forEach((d) => {
          const data = d.data();
          const createdAt = typeof data.createdAt === 'number' ? data.createdAt : now;
          if (now - createdAt < TWELVE_HOURS_MS) {
            fallbackMessages.push({
              id: d.id,
              senderId: data.senderId || 'unknown',
              senderName: data.senderName || 'Anonymous',
              senderAvatar: data.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
              text: data.text || '',
              createdAt,
              expiresAt: createdAt + TWELVE_HOURS_MS
            });
          }
        });
        fallbackMessages.sort((a, b) => a.createdAt - b.createdAt);
        callback(fallbackMessages);
      });
    }
  );

  return unsubscribe;
};

/**
 * Sends a message to the connected live chat room.
 * Only registered users can send messages.
 */
export const sendChatMessage = async (
  user: User,
  text: string
): Promise<ChatMessage> => {
  if (!user || !user.id) {
    throw new Error('You must be a registered user to send messages.');
  }

  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error('Message cannot be empty.');
  }

  if (cleanText.length > 1000) {
    throw new Error('Message is too long (maximum 1,000 characters).');
  }

  const now = Date.now();
  const expiresAt = now + TWELVE_HOURS_MS;

  const messageData = {
    senderId: user.id,
    senderName: user.name || 'Streamer',
    senderAvatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
    text: cleanText,
    createdAt: now,
    expiresAt: expiresAt
  };

  const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);

  return {
    id: docRef.id,
    ...messageData
  };
};

/**
 * Routine to purge any chat messages older than 12 hours from the database.
 */
export const purgeExpiredMessages = async (): Promise<number> => {
  try {
    const cutoff = Date.now() - TWELVE_HOURS_MS;
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('createdAt', '<', cutoff),
      limit(50)
    );
    const snap = await getDocs(q);
    let deletedCount = 0;
    const deletePromises = snap.docs.map(async (docSnap) => {
      await deleteDoc(doc(db, MESSAGES_COLLECTION, docSnap.id));
      deletedCount++;
    });
    await Promise.all(deletePromises);
    return deletedCount;
  } catch (err) {
    console.warn('Purge error:', err);
    return 0;
  }
};
