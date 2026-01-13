import { z } from "zod";
import { Note } from "@/types";

const noteSchema = z.object({
  topicId: z.string().min(1, { message: "Topic is required" }),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(50, { message: "Title must be at most 50 characters" }),
  content: z
    .string()
    .min(3, { message: "Content must be at least 3 characters" })
    .max(5000, { message: "Content must be at most 5000 characters" }),
  importance: z.enum(["low", "medium", "high"]),
});

export { noteSchema };
