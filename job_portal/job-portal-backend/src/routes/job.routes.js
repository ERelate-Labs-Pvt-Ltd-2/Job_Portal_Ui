import express from "express";
import {
  createJob,
  getAllJobs,
  getRecruiterJobs
} from "../controllers/job.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * 📝 Recruiter → Post a job
 * POST /api/jobs
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  createJob
);

/**
 * 📃 Public → Get all jobs (Job Search)
 * GET /api/jobs
 */
router.get("/", getAllJobs);

/**
 * 👤 Recruiter → Get own jobs
 * GET /api/jobs/my
 */
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  getRecruiterJobs
);

export default router;
