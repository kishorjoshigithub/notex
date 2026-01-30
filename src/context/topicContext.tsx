"use client";
import { Topic, TopicContextType } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { getUserTopics } from "@/services/topicService";

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);

  const initTopics = async () => {
    if (!user?.uid) return;
    try {
      const topics = await getUserTopics(user.uid);
      setTopics(topics);
      const storedTopicId = localStorage.getItem("selectedTopicId");
      const storedTopic =
        topics.find((t: Topic) => t.id === storedTopicId) || topics[0] || null;

      setSelectedTopic(storedTopic);
    } catch (err) {
      console.error("Failed to load topics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initTopics();
  }, [user?.uid]);

  const handleSetSelectedTopic = (topic: Topic | null) => {
    initTopics();
    setSelectedTopic(topic);
    if (topic) {
      localStorage.setItem("selectedTopicId", topic.id);
    } else {
      localStorage.removeItem("selectedTopicId");
    }
  };

  return (
    <TopicContext.Provider
      value={{
        topics,
        selectedTopic,
        setSelectedTopic: handleSetSelectedTopic,
        loading,
      }}
    >
      {children}
    </TopicContext.Provider>
  );
};

export const useTopic = () => {
  const context = useContext(TopicContext);
  if (!context) {
    throw new Error("useTopic must be used within a TopicProvider");
  }
  return context;
};
