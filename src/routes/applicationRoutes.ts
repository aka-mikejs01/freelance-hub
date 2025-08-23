import { Router } from "express";
import { isAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { validate } from "../middleware/validate";
import { jobParamsSchema } from "../schemas/paramsSchema";
import { viewApplications } from "../controllers/applicationController";

const router = Router();

router.get(
  "/by-job/:id",
  isAuth,
  requireRole("client"),
  validate({ params: jobParamsSchema }),
  viewApplications
);

export default router;
