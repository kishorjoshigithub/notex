import { z } from "zod";

const TopicSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name must be at most 20 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(80, { message: "Description must be at most 80 characters" }),
});

export { TopicSchema };
