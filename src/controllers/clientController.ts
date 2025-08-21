import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Job from "../models/Job";
import { JobInput } from "../schemas/jobSchema";
import { UpdateJobBodyInput } from "../schemas/paramsSchema";
import logger from "../middleware/logger";

export const createJobPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const job = await Job.create({
      ...(req.body as JobInput),
      client: req.user!.id,
    });

    logger.info(`Client ${req.user!.id} created a job post.`);

    res.status(201).json({ message: "Job post successfully created", job });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const updateJobPost = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, client: req.user!.id },
      req.body as UpdateJobBodyInput,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });

    logger.info(
      `Client ${req.user!.id} updated their job post ${req.params.id}`
    );

    res.json(job);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const deleteJobPost = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      client: req.user!.id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    logger.info(
      `Client ${req.user!.id} Deleted their job post ${req.params.id}`
    );

    res.json({ message: "Deleted" });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const getMyJobPosts = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const job = await Job.find({ client: req.user!.id }).populate(
      "client",
      "name"
    );
    if (!job)
      return res.status(404).json({ message: "You don't have any post" });

    res.json(job);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};
