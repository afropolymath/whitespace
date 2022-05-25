import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  GoogleAuthProvider,
} from 'firebase/auth';

import { authStore } from '../store';

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const db = getFirestore(app);

export const initializeAuthListener = () => {
  onAuthStateChanged(auth, (user: User) => {
    authStore.setUser(user);
  });
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    const email = err.email;
    const credential = err.credential;
    console.log(err);
  }
};

export const logout = async () => await signOut(auth);
