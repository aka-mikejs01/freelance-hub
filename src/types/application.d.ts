import { Document } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  freelancer: Types.ObjectId;
  coverLetter?: string;
  status: "pending" | "accepted" | "rejected";
}
