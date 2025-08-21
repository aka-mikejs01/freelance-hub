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

router.post("/signup", validate({ body: signupSchema }), signup);
router.post("/signin", validate({ body: signinSchema }), signin);
router.post("/signout", signout);
router.post("/refresh", refresh);
router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  forgotPassword
);

export default router;
