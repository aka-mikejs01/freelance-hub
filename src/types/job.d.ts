import { Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  budget: number;
  skills: string[];
  client: Types.ObjectId;
  status: "open" | "closed";
}
