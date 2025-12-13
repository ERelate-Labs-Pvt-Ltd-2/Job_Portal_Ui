import express from "express";
import {
  getAllCandidates,
  searchCandidates,
  getCandidateById
} from "../controllers/candidate.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * Recruiter only
 */
router.use(authMiddleware, roleMiddleware(["recruiter"]));

/**
 * GET /api/candidates
 */
router.get("/", getAllCandidates);

/**
 * GET /api/candidates/search?q=
 */
router.get("/search", searchCandidates);

/**
 * GET /api/candidates/:id
 */
router.get("/:id", getCandidateById);

export default router;
