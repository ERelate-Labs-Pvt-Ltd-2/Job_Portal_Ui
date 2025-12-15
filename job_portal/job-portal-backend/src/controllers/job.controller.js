import Job from "../models/Job.model.js";

//
// 📝 Recruiter → Post a Job
//
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      experience,
      salary,
      description
    } = req.body;

    // Basic validation
    if (
      !title ||
      !company ||
      !location ||
      !jobType ||
      !experience ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      experience,
      salary,
      description,
      recruiterId: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to post job",
      error: error.message
    });
  }
};

//
// 📃 Public → Get All Jobs (Job Search)
//
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};

//
// 👤 Recruiter → Get Own Jobs
//
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter jobs",
      error: error.message
    });
  }
};
