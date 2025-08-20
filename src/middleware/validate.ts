import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate =
  <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const result = schema.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({ errors: result.error.format() });

    req.body = result.data;
    next();
  };
