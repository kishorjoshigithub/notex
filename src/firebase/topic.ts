import { db } from "@/config/firebase-config";
import { Topic } from "@/types";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
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
      createdAt: topic.createdAt || serverTimestamp(),
      updatedAt: topic.updatedAt || serverTimestamp(),
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
      throw new Error("User does not exist");
      return;
    }

    const topics = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    }));

    return topics;
  } catch (error: any) {
    console.error(error.code, error.message);
  }
};

export { createTopic, getTopicsByUserId };
