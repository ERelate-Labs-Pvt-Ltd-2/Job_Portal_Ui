import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/candidates", candidateRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running 🚀" });
});

export default app;
