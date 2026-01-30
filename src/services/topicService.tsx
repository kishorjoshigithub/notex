// services/topicService.ts
import api from "@/lib/axios";

export const getUserTopics = async (userId: string) => {
  const response = await api.get(`/users/${userId}/topics`);
  return response.data;
};
