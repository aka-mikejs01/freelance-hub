import { Router } from "express";
import {
  createJobPost,
  updateJobPost,
  deleteJobPost,
  getMyJobPosts,
} from "../controllers/clientController";
import { validate } from "../middleware/validate";
import { requireRole } from "../middleware/role";
import { isAuth } from "../middleware/auth";
import { jobSchema } from "../schemas/jobSchema";
import { jobParamsSchema } from "../schemas/paramsSchema";
import { updateBodySchema } from "../schemas/paramsSchema";

const router = Router();

router.post(
  "/jobs",
  isAuth,
  requireRole("client"),
  validate({ body: jobSchema }),
  createJobPost
);

router.patch(
  "/jobs/:id",
  isAuth,
  requireRole("client"),
  validate({ params: jobParamsSchema, body: updateBodySchema }),
  updateJobPost
);

router.delete(
  "/jobs/:id",
  isAuth,
  requireRole("client"),
  validate({ params: jobParamsSchema }),
  deleteJobPost
);

router.get("/jobs", isAuth, requireRole("client"), getMyJobPosts);

export default router;
