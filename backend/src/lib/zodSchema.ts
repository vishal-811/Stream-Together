import { z } from "zod";

export const signupSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(6, "Min 6 characters are required"),
});

export const signinSchema = z.object({
    email : z.string(),
    password : z.string()
})

export const videoUploadSchema = z.object({
  title : z.string(),
  description :z.string(),
  videoUrl: z.string(),
  thumbnailUrl: z.string()
})