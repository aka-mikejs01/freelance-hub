import mongoose, { Schema } from "mongoose";
import { IApplication } from "../types/application";

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coverLetter: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ freelancer: 1, job: 1 }, { unique: true });

const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);

export default Application;
