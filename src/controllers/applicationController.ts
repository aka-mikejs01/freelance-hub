import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Application from "../models/Application";
import Job from "../models/Job";
import logger from "../middleware/logger";
import mongoose from "mongoose";
import Contract from "../models/Contract";
import { UpdateStatusInput } from "../schemas/applicationSchema";

export const viewApplications = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      client: req.user!.id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const items = await Application.find({ job: job._id }).populate(
      "freelancer",
      "name email"
    );

    res.json(items);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const updateStatusForApp = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status }: UpdateStatusInput = req.body;

    const app = await Application.findById(req.params.id)
      .populate("job")
      .session(session);
    if (!app || app.status !== "pending")
      throw new Error("Application not found or already processed");

    const job = await Job.findById(app.job._id).session(session);
    if (!job || job.status === "closed")
      throw new Error("Job not found or already closed");

    app.status = status;
    await app.save({ session });

    let contract = null;

    if (status === "accepted") {
      job.acceptedFreelancers.push(app.freelancer);

      if (job.acceptedFreelancers.length >= job.maxFreelancers) {
        job.status = "closed";
      }

      await job.save({ session });

      contract = new Contract({
        job: job._id,
        client: job.client,
        freelancer: app.freelancer,
        terms: "Default terms",
      });

      await contract.save({ session });
    }

    await session.commitTransaction();

    return res.json({
      message: `Application ${status}`,
      application: app,
      job,
      contract,
    });
  } catch (err) {
    const error = err as Error;
    await session.abortTransaction();
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
