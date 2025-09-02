import { Document } from "mongoose";

export interface IContract extends Document {
  job: Types.ObjectId;
  client: Types.ObjectId;
  freelancer: Types.ObjectId;
  terms: string;
  status: "active" | "completed" | "cancelled";
}
