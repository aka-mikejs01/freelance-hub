import { z } from "zod";

export const jobParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Job Id" }),
});

export const updateBodySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must not exceed 100 characters" })
    .optional(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must not exceed 1000 characters" })
    .optional(),

  budget: z
    .number()
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Budget must be a number",
    })
    .positive({ message: "Budget must be greater than 0" })
    .optional(),

  skills: z
    .array(z.string().min(1, { message: "Skill must not be empty" }))
    .min(1, { message: "At least one skill is required" })
    .optional(),
});

export type UpdateJobBodyInput = z.infer<typeof updateBodySchema>;
