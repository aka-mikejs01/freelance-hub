import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import logger from "../middleware/logger";
import { ResetPasswordInput } from "../schemas/authSchema";

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { newPassword }: ResetPasswordInput = req.body;
    const resetToken = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken as string)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    logger.info(`User ${user.email} reset their password`);

    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res
      .status(500)
      .json({ message: "Error occurred", error: error.message });
  }
};
