import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export const initializeAuthListener = () => {
  firebase.auth().onAuthStateChanged((user: firebase.User) => {
    authStore.setUser(user);
  });
};

export const loginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    return await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    const email = err.email;
    const credential = err.credential;
    console.log(err);
  }
};

export const logout = async () => await firebase.auth().signOut();

export const getUserStories = async (ownerId: string) => {
  const querySnapshot = await db
    .collection('stories')
    .where('owner', '==', ownerId)
    .get();
  return querySnapshot.docs.map((doc) => doc.data());
};

export const getStory = async (storyId) => {
  const querySnapshot = await db.collection('stories').doc(storyId).get();
  return querySnapshot.data();
};
