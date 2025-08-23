import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Application from "../models/Application";
import Job from "../models/Job";
import logger from "../middleware/logger";

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
