import { Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "client" | "freelancer";
  bio?: string;
  skills?: [string];
  portfolio?: [string];
  profilePic?: string;
  rating: number;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  comparePassword(plainPassword: string): Promise<Boolean>;
  createPasswordResetToken(): string;
}
