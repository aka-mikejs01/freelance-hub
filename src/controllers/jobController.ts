import { Request, Response } from "express";
import Job from "../models/Job";
import logger from "../middleware/logger";

export const searchJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, skills, status, page, limit } = req.query as any;

    const filter: any = {};
    if (status) filter.status = status;
    if (q) filter.$text = { $search: q };
    if (skills)
      filter.skills = {
        $in: skills.split(",").map((s: any) => s.trim().toLowerCase()),
      };

    const [items, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Job.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query as any;

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(jobs);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const getJobById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};
