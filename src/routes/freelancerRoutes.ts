import { Router } from "express";
import { applyToJob } from "../controllers/freelancerController";
import { isAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { appSchema } from "../schemas/applicationSchema";
import { validate } from "../middleware/validate";

const router = Router();

router.post(
  "/",
  isAuth,
  requireRole("freelancer"),
  validate({ body: appSchema }),
  applyToJob
);

export default router;
