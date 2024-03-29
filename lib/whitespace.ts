import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  deleteDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import { authStore } from '../store';

export type ContentBlockTypes = 'code' | 'text' | 'markdown';

export type Story = {
  id: string;
  title: string;
  description: string;
  modified: Date;
};

export type PartialChapter = {
  title: string;
  contents: null | { [key: string]: ChapterContent };
};

export type Chapter = PartialChapter & {
  id: string;
  modified: Date;
};

export type PartialChapterContent = {
  type: ContentBlockTypes;
  content: string;
  index?: number;
};

export type ChapterContent = PartialChapterContent & {
  id: string;
};

const storyConverter = {
  toFirestore({ title, description }: Story) {
    return { title, description };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Story {
    const { title, description, modified } = snapshot.data(options)!;
    return {
      id: snapshot.id,
      title,
      description,
      modified: modified?.toDate(),
    };
  },
};

const chapterConverter = {
  toFirestore({ title, contents }: Chapter) {
    return { title, contents };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Chapter {
    const { title, contents, modified } = snapshot.data(options);
    return {
      id: snapshot.id,
      title,
      contents,
      modified: modified?.toDate(),
    };
  },
};

const chapterContentConverter = {
  toFirestore({ type, content, index }: ChapterContent) {
    return { type, content, index };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): ChapterContent {
    const { type, content, index } = snapshot.data(options);
    return {
      id: snapshot.id,
      type,
      content,
      index,
    };
  },
};

export const getUserStories = async (ownerId: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'stories'),
      where('owner', '==', ownerId),
    ).withConverter(storyConverter),
  );
  return querySnapshot.docs.map((doc) => doc.data());
};

export const getStoryChapters = async (storyId: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, 'stories', storyId, 'chapters')).withConverter(
      chapterConverter,
    ),
  );
  return querySnapshot.docs.map((doc) => doc.data());
};

export const getChapterContents = async (
  storyId: string,
  chapterId: string,
) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'stories', storyId, 'chapters', chapterId, 'contents'),
    ).withConverter(chapterContentConverter),
  );
  return querySnapshot.docs.map((doc) => doc.data());
};

export const addStory = async (title: string) => {
  const newStoryRef = await addDoc(collection(db, 'stories'), {
    title,
    owner: authStore.user.uid,
    created: serverTimestamp(),
    modified: serverTimestamp(),
  });
  return newStoryRef.id;
};

/**
 * Update the title and description of a story
 * @param storyId ID of story to update
 * @param title The updated title of the story
 * @param description Updated description of the story
 * @returns Promise<void>
 */
export const updateStory = async (
  storyId: string,
  title: string,
  description: string,
) => {
  return await updateDoc(doc(db, 'stories', storyId), {
    title,
    description,
    modified: serverTimestamp(),
  });
};

/**
 * Add a chapter to a story
 * @param storyId ID of story to which to add the new chapter
 * @param title Title of the new chapter to add to the story
 * @param contents Contents to be added to the chapter in the story
 * @returns
 */
export const addChapter = async (storyId: string, title: string) => {
  const newChapterRef = await addDoc(
    collection(db, 'stories', storyId, 'chapters'),
    {
      title,
      created: serverTimestamp(),
      modified: serverTimestamp(),
    },
  );
  return newChapterRef.id;
};

/**
 * Update a chapter in a story
 * @param storyId ID of the story in which to update a chapter
 * @param chapterId ID of the chapter being updated
 * @param title Updated title of the chapter
 * @param contents Updated contents of the chapter
 * @returns
 */
export const updateChapter = async (
  storyId: string,
  chapterId: string,
  title: string,
) => {
  return await updateDoc(doc(db, 'stories', storyId, 'chapters', chapterId), {
    title,
    modified: serverTimestamp(),
  });
};

/**
 * Add a new content to a chapter. Content can range plain text, markdown etc.
 * @param storyId ID of the story whose to which to add chapter content
 * @param chapterId ID of the chapter in the story to which to add the new content
 * @param type Type of the content to be added to the chapter
 * @param content Value of the content to be added
 * @returns
 */
export const addChapterContent = async (
  storyId: string,
  chapterId: string,
  chapterContent: PartialChapterContent,
) => {
  return await addDoc(
    collection(db, 'stories', storyId, 'chapters', chapterId, 'contents'),
    {
      ...chapterContent,
      modified: serverTimestamp(),
    },
  );
};

/**
 * Update the content of a content block within the chapter in a story
 * @param storyId ID of the story whose to which to update the chapter content
 * @param chapterId ID of the chapter in the story to which to update the content
 * @param contentId ID of the content being updated
 * @param content New value of the content
 * @returns
 */
export const updateChapterContent = async (
  storyId: string,
  chapterId: string,
  contentId: string,
  chapterContent: PartialChapterContent,
) => {
  return await updateDoc(
    doc(db, 'stories', storyId, 'chapters', chapterId, 'contents', contentId),
    {
      ...chapterContent,
      modified: serverTimestamp(),
    },
  );
};

export const deleteChapterContent = async (storyId, chapterId, contentId) => {
  return await deleteDoc(
    doc(db, 'stories', storyId, 'chapters', chapterId, 'contents', contentId),
  );
};
