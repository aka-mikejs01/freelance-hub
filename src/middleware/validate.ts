import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

interface ValidateSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validate =
  (schema: ValidateSchemas) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        const parsed = schema.query.parse(req.query) as any;
        Object.assign(req.query, parsed);
      }

      if (schema.params) {
        const parsed = schema.params.parse(req.params) as any;
        Object.assign(req.params, parsed);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          errors: err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      next(err);
    }
  };
