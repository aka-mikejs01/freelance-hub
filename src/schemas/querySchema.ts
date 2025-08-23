import { z } from "zod";

export const querySchema = z.object({
  q: z.string().min(1).optional(),
  skills: z.string().optional(),
  status: z.enum(["open", "closed"]).default("open"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export const queryForGetJob = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
