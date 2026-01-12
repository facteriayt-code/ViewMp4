
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

/**
 * FIREBASE CONNECTION GUIDE:
 * 1. Go to https://console.firebase.google.com/
 * 2. Click "Add Project" -> Follow steps.
 * 3. Click the Web icon (</>) to register a new app.
 * 4. Copy the values from the 'firebaseConfig' shown there into this object.
 * 5. In Firebase sidebar, click "Build" -> "Storage" -> "Get Started".
 */
const firebaseConfig = {
  apiKey: "AIzaSy...", // Found in Project Settings -> Your Apps
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app", // Found in Storage tab
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
