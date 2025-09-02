import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must not exceed 1000 characters" }),

  budget: z
    .number()
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Budget must be a number",
    })
    .positive({ message: "Budget must be greater than 0" }),

  skills: z
    .array(z.string().min(1, { message: "Skill must not be empty" }))
    .min(1, { message: "At least one skill is required" }),
  maxFreelancers: z
    .number()
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Max freelancers required must be a number",
    })
    .positive({ message: "Max freelancers required must be greater than 0" }),
});

export type JobInput = z.infer<typeof jobSchema>;
