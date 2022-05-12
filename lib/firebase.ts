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
  apiKey: 'AIzaSyAIvZ3ewyH-TpZEYaonGsjtEUO55kAE3Ms',
  authDomain: 'whitespace-fada8.firebaseapp.com',
  databaseURL: 'https://whitespace-fada8.firebaseio.com',
  projectId: 'whitespace-fada8',
  storageBucket: 'whitespace-fada8.appspot.com',
  messagingSenderId: '498916763158',
  appId: '1:498916763158:web:7790d6786445f0ebd03737',
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
