import { Response, RequestHandler } from "express";
import User from "../models/User";
import { AuthRequest } from "../types/authRequest";
import logger from "../middleware/logger";

export const getUserProfile = (role: string): RequestHandler | undefined => {
  const excludeFields: Record<string, string> = {
    client:
      "-password -bio -skills -portfolio -passwordResetToken -passwordResetExpires",
    freelancer: "-password -passwordResetToken -passwordResetExpires",
  };

  if (!excludeFields[role]) return undefined;

  return async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.user!.id).select(
        excludeFields[role]!
      );
      res.json(user);
    } catch (err) {
      const error = err as Error;
      logger.error(error.message);
      res.status(500).json({ message: "Error Occured", error: error.message });
    }
  };
};
