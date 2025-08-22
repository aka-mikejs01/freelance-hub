import { Router } from "express";
import { searchJob, getJobs } from "../controllers/jobController";
import { querySchema } from "../schemas/querySchema";
import { validate } from "../middleware/validate";

const router = Router();

router.get("/search", validate({ query: querySchema }), searchJob);
router.get("/", getJobs);

export default router;
