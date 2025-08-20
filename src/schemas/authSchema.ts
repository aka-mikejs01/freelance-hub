import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name must not exceed 10 characters"),
  email: z.email("Email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please enter your role"),
});

export const signinSchema = z.object({
  email: z.email("Email must be valid"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email must be valid"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
