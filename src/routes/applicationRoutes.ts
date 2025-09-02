import { Router } from "express";
import { isAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { validate } from "../middleware/validate";
import { jobParamsSchema } from "../schemas/paramsSchema";
import {
  viewApplications,
  updateStatusForApp,
} from "../controllers/applicationController";
import { updateStatusSchema } from "../schemas/applicationSchema";

const router = Router();

router.get(
  "/by-job/:id",
  isAuth,
  requireRole("client"),
  validate({ params: jobParamsSchema }),
  viewApplications
);

router.post(
  "/:id",
  isAuth,
  requireRole("client"),
  validate({ body: updateStatusSchema, params: jobParamsSchema }),
  updateStatusForApp
);

export default router;
