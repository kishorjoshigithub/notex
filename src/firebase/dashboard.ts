import { db } from "@/config/firebase-config";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const getDashboardData = async ({ userId }: { userId: string }) => {
  const topicRef = collection(db, "topics");
  const noteRef = collection(db, "notes");

  const topicQuery = query(topicRef, where("userId", "==", userId));
  const noteQuery = query(noteRef, where("userId", "==", userId));

  const [topicSnapshot, noteSnapshot] = await Promise.all([
    getCountFromServer(topicQuery),
    getCountFromServer(noteQuery),
  ]);

  const topicCount = topicSnapshot.data().count;
  const noteCount = noteSnapshot.data().count;

  const topics: any[] = [];
  const lastFiveTopicsQuery = query(
    topicRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const topicsSnapshot = await getDocs(lastFiveTopicsQuery);
  topicsSnapshot.forEach((doc) => {
    topics.push({ id: doc.id, ...doc.data() });
  });

  const notes: any[] = [];
  const lastFiveNotesQuery = query(
    noteRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const notesSnapshot = await getDocs(lastFiveNotesQuery);
  notesSnapshot.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() });
  });

  return {
    topicCount,
    noteCount,
    recentTopics: topics,
    recentNotes: notes,
  };
};
