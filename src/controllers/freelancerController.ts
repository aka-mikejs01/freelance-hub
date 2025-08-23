import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Job from "../models/Job";
import Application from "../models/Application";
import { AppInput } from "../schemas/applicationSchema";
import logger from "../middleware/logger";

export const applyToJob = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { job, coverLetter }: AppInput = req.body;

    const findJob = await Job.findById(job);
    if (!findJob || findJob.status !== "open")
      return res.status(400).json({ message: "Job not open" });

    const app = await Application.create({
      job,
      freelancer: req.user!.id,
      coverLetter,
    });

    logger.info(`Freelancer ${req.user!.id} applied for a job ${job}`);

    res.status(201).json(app);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};
