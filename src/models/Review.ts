import mongoose, { Schema } from "mongoose";
import { IReview } from "../types/review";

const ReviewSchema = new Schema<IReview>(
  {
    contract: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
      index: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

ReviewSchema.index({ contract: 1, from: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
