import { Router } from "express";
import { uploadProfileImage } from "../controllers/uploadsController";
import { upload } from "../middleware/upload";
import { isAuth } from "../middleware/auth";

const router = Router();

router.post("/upload", isAuth, upload.single("profile"), uploadProfileImage);

export default router;
