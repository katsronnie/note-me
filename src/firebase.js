import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDJM_oDHVnfgreccVw8dM-Q1P_v_huJ0WU",
  authDomain: "note-me-e0865.firebaseapp.com",
  projectId: "note-me-e0865",
  storageBucket: "note-me-e0865.firebasestorage.app",
  messagingSenderId: "841460460327",
  appId: "1:841460460327:web:2931ab06a1cb330680d702",
  measurementId: "G-S153BZW050"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Set persistence to LOCAL (survives browser refresh and closing)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });
