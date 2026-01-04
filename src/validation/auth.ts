import z from "zod";

const SignupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name must be at most 20 characters" }),
  email: z
    .string()
    .email({ message: "Email is not valid" })
    .max(50, { message: "Email must be at most 50 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email is not valid" })
    .max(50, { message: "Email must be at most 50 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

export { SignupSchema, LoginSchema };
