import { z } from "zod";

export const appSchema = z.object({
  job: z
    .string()
    .min(1, "Job is required")
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Job Id" }),
  coverLetter: z
    .string()
    .min(1, "Cover letter is required")
    .max(1000, "Cover letter should not exceed 1000 characters"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export type AppInput = z.infer<typeof appSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
