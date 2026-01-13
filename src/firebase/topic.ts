import { db } from "@/config/firebase-config";
import { Topic } from "@/types";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const createTopic = async (topic: Topic) => {
  try {
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", topic.id)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error("User does not exist");
      return;
    }

    const docRef = await addDoc(collection(db, "topics"), {
      userId: topic.id,
      name: topic.name,
      description: topic.description,
      createdAt: topic.createdAt || Timestamp.now(),
      updatedAt: topic.updatedAt || Timestamp.now(),
    });

    return docRef;
  } catch (error: any) {
    console.error(error.code, error.message);
  }
};

const getTopicsByUserId = async (userId: string) => {
  try {
    const userQuery = query(
      collection(db, "topics"),
      where("userId", "==", userId)
    );

    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error("No topics found");
      return;
    }

    const topics = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    }));

    return topics;
  } catch (error: any) {
    console.error(error.code, error.message);
  }
};

const deleteTopicById = async (topicId: string) => {
  try {
    const topicRef = doc(db, "topics", topicId);

    const notesQuery = query(
      collection(db, "notes"),
      where("topicId", "==", topicId)
    );

    const notesSnapshot = await getDocs(notesQuery);

    await Promise.all(notesSnapshot.docs.map((note) => deleteDoc(note.ref)));

    await deleteDoc(topicRef);
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
};

const updateTopicById = async (topicId: string, topic: Topic) => {
  try {
    const topicRef = doc(db, "topics", topicId);

    const updatedTopic = await updateDoc(topicRef, {
      name: topic.name,
      description: topic.description,
      updatedAt: serverTimestamp(),
    });
    return updatedTopic;
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
};

export { createTopic, getTopicsByUserId, deleteTopicById, updateTopicById };
