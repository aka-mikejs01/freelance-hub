import { Router } from "express";
import { resetPassword } from "../controllers/resetPassword";
import { validate } from "../middleware/validate";
import { resetPasswordSchema } from "../schemas/authSchema";

const router = Router();

router.post(
  "/reset-password/:token",
  validate({ body: resetPasswordSchema }),
  resetPassword
);

export default router;
