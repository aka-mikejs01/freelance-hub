import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "freelancer"],
  },
  bio: { type: String },
  skills: [String],
  portfolio: [String],
  profilePic: { type: String },
  rating: { type: Number },
  passwordResetToken: { type: String, default: undefined },
  passwordResetExpires: { type: Date, default: undefined },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);

    this.password = hashed;
    next();
  } catch (err) {
    const error = err as Error;
    next(error);
  }
});

userSchema.methods.comparePassword = function (
  plainPassword: string
): Promise<Boolean> {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
