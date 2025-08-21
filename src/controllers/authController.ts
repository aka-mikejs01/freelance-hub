import User from "../models/User";
import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import jwt from "jsonwebtoken";
import {
  SignupInput,
  SigninInput,
  ForgotPasswordInput,
} from "../schemas/authSchema";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import logger from "../middleware/logger";

export const signup = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { name, email, password, role }: SignupInput = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      logger.warn("Someone tried to register with an existing email");
      return res.status(401).json({ message: "Email already in use" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    logger.info(`New user registerd: ${user.email}`);

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup Successfull", accessToken });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const signin = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { email, password }: SigninInput = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    logger.info(`User logged in: ${user.email}`);

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Signin Successfull", accessToken });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const signout = (_req: Request, res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  logger.info("User signed out");
  res.json({ message: "Signout Successfull" });
};

export const refresh = (req: Request, res: Response): Response | void => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: unknown, decoded: any): Response | void => {
      if (err) return res.status(403).json({ message: "Invalid Token" });

      const accessToken = generateAccessToken(decoded.id, decoded.role);

      res.json({ accessToken });
    }
  );
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { email }: ForgotPasswordInput = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User may not exist" });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/reset-password/${resetToken}`;
    logger.info(`Password reset link sent to: ${user.email} - ${resetUrl}`);

    res.json({ message: "Reset url have been sent to your email", resetUrl });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};
