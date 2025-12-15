import express from "express";
import {
  applyJob,
  getSeekerApplications,
  getRecruiterApplications,
  updateApplicationStatus
} from "../controllers/application.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * 📝 Seeker → Apply for a job
 * POST /api/applications/apply/:id
 */
router.post(
  "/apply/:id",
  authMiddleware,
  roleMiddleware(["seeker"]),
  applyJob
);

/**
 * 📃 Seeker → View my applications
 * GET /api/applications/seeker
 */
router.get(
  "/seeker",
  authMiddleware,
  roleMiddleware(["seeker"]),
  getSeekerApplications
);

/**
 * 📃 Recruiter → View applications for my jobs
 * GET /api/applications/recruiter
 */
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  getRecruiterApplications
);

/**
 * 🔄 Recruiter → Update application status
 * PATCH /api/applications/:id/status
 */
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  updateApplicationStatus
);

export default router;
