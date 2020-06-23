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

export type Story = {
  id: string;
  title: string;
  description: string;
  modified: Date;
};

export type Chapter = {
  id: string;
  title: string;
  contents: string;
  modified: Date;
};

const storyConverter = {
  toFirestore({ title, description }: Story) {
    return { title, description };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): Story {
    const { title, description, modified } = snapshot.data(options)!;

    return {
      id: snapshot.id,
      title,
      description,
      modified,
    };
  },
};

const chapterConverter = {
  toFirestore({ title, contents }: Chapter) {
    return { title, contents };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): Chapter {
    const { title, contents, modified } = snapshot.data(options)!;

    return {
      id: snapshot.id,
      title,
      contents,
      modified,
    };
  },
};

export const getUserStories = async (ownerId: string) => {
  const querySnapshot = await db
    .collection('stories')
    .where('owner', '==', ownerId)
    .withConverter(storyConverter)
    .get();
  return querySnapshot.docs.map((doc) => doc.data());
};

export const getStoryChapters = async (storyId: string) => {
  const querySnapshot = await db
    .collection('stories')
    .doc(storyId)
    .collection('chapters')
    .withConverter(chapterConverter)
    .get();
  return querySnapshot.docs.map((doc) => doc.data());
};

export const addStory = async (title: string) => {
  const newStoryRef = await db.collection('stories').add({
    title,
    owner: authStore.user.uid,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    modified: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return newStoryRef.id;
};

export const updateStory = async (
  storyId: string,
  title: string,
  description: string,
) => {
  return await db.collection('stories').doc(storyId).update({
    title,
    description,
    modified: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const addChapter = async (
  storyId: string,
  title: string,
  contents: string,
) => {
  const newChapterRef = await db
    .collection('stories')
    .doc(storyId)
    .collection('chapters')
    .add({
      title,
      contents,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      modified: firebase.firestore.FieldValue.serverTimestamp(),
    });
  return newChapterRef.id;
};

export const updateChapter = async (
  storyId: string,
  chapterId: string,
  title: string,
  contents: string,
) => {
  return await db
    .collection('stories')
    .doc(storyId)
    .collection('chapters')
    .doc(chapterId)
    .update({
      title,
      contents,
      modified: firebase.firestore.FieldValue.serverTimestamp(),
    });
};
