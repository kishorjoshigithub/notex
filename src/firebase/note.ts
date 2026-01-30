import { db } from "@/config/firebase-config";
import { Note } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const createNote = async (note: Note) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), note);
    return docRef;
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
};

const getNotesByUserId = async (userId: string) => {
  try {
    const userQuery = query(
      collection(db, "notes"),
      where("userId", "==", userId),
    );

    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error("No notes found");
      return;
    }

    const notes = userSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      topicId: doc.data().topicId,
      userId: doc.data().userId,
      title: doc.data().title,
      content: doc.data().content,
      importance: doc.data().importance,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    }));

    return notes;
  } catch (error: any) {
    console.error(error.code, error.message);
  }
};

const getNotesByTopicId = async (topicId: string) => {
  try {
    const topicQuery = query(
      collection(db, "notes"),
      where("topicId", "==", topicId),
    );

    const topicSnapshot = await getDocs(topicQuery);

    if (topicSnapshot.empty) {
      throw new Error("No notes found");
      return;
    }

    const notes = topicSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      topicId: doc.data().topicId,
      userId: doc.data().userId,
      title: doc.data().title,
      content: doc.data().content,
      importance: doc.data().importance,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    }));

    return notes;
  } catch (error: any) {
    console.error(error.code, error.message);
  }
};

const deleteNote = async (noteId: string) => {
  try {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
};

const updateNote = async (noteId: string, note: Note) => {
  try {
    const noteRef = doc(db, "notes", noteId);

    const updatedNote = await updateDoc(noteRef, {
      title: note.title,
      content: note.content,
      importance: note.importance,
      updatedAt: Timestamp.now(),
    });
    return updatedNote;
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
};

export {
  createNote,
  getNotesByUserId,
  deleteNote,
  updateNote,
  getNotesByTopicId,
};
