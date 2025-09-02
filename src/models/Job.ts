import mongoose, { Schema } from "mongoose";
import { IJob } from "../types/job";

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, index: "text" },
    description: { type: String, required: true, index: "text" },
    budget: { type: Number, required: true },
    skills: { type: [String], index: true },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    acceptedFreelancers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    maxFreelancers: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text" });

const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
