import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("must be a valid email address"),
  password: z.string().min(8, "password must be of atleat 8 characters").max(72, "must be less than 72 characters")
})

export const signupSchema = signinSchema.extend({
  username: z.string().min(3).max(20),
});