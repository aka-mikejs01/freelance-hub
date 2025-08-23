import { Router } from "express";
import { searchJob, getJobs, getJobById } from "../controllers/jobController";
import { querySchema, queryForGetJob } from "../schemas/querySchema";
import { validate } from "../middleware/validate";
import { jobParamsSchema } from "../schemas/paramsSchema";

const router = Router();

router.get("/search", validate({ query: querySchema }), searchJob);
router.get("/", validate({ query: queryForGetJob }), getJobs);
router.get("/:id", validate({ params: jobParamsSchema }), getJobById);

export default router;
