import api from "./api";

// Public – get all jobs
export const getAllJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

// Recruiter – post job
export const postJob = async (jobData) => {
  const res = await api.post("/jobs", jobData);
  return res.data;
};

// Recruiter – get own jobs
export const getMyJobs = async () => {
  const res = await api.get("/jobs/my");
  return res.data;
};
