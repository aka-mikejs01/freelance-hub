import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";
import jwt from "jsonwebtoken";
import logger from "./logger";

export const isAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: string;
    };

    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    if (error.name === "TokenExpiredError")
      return res.status(403).json({ message: "Token Expired" });
    else return res.status(403).json({ message: "Invalid Token" });
  }
};
