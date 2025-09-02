import mongoose, { Schema } from "mongoose";
import { IContract } from "../types/contract";

const ContractSchema = new Schema<IContract>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    terms: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

ContractSchema.index({ job: 1, client: 1, freelancer: 1 }, { unique: true });

const Contract = mongoose.model<IContract>("Contract", ContractSchema);

export default Contract;
