import { Response } from "express";
import User from "../models/User";
import logger from "../middleware/logger";
import { AuthRequest } from "../types/authRequest";

export const uploadProfileImage = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const userId = req.user!.id;

    const profileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profileUrl },
      { new: true }
    );

    logger.info(`User ${userId} set profile`);

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: updatedUser?.profilePic,
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res
        .status(500)
        .json({ message: "Error Occured", error: err.message });
    }
  }
};
