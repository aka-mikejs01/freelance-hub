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
        req.query = schema.query.parse(req.query) as any;
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as any;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          errors: err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      next(err);
    }
  };
