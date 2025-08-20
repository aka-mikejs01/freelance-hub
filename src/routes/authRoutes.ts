import { Router } from "express";
import {
  signup,
  signin,
  signout,
  refresh,
  forgotPassword,
} from "../controllers/authController";
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
} from "../schemas/authSchema";
import { validate } from "../middleware/validate";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/signin", validate(signinSchema), signin);
router.post("/signout", signout);
router.post("/refresh", refresh);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

export default router;
