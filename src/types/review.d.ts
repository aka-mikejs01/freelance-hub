import { Document } from "mongoose";

export interface IReview extends Document {
  contract: Types.ObjectId;
  from: Types.ObjectId; // user who writes review
  to: Types.ObjectId; // user who receives review
  rating: number; // 1-5
  comment?: string;
}
