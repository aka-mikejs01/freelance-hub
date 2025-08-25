import { Router } from "express";
import { getUserProfile } from "../controllers/userController";
import { isAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";

const router = Router();

router.get(
  "/client/profile",
  isAuth,
  requireRole("client"),
  getUserProfile("client")!
);
router.get(
  "/freelancer/profile",
  isAuth,
  requireRole("freelancer"),
  getUserProfile("freelancer")!
);

export default router;
