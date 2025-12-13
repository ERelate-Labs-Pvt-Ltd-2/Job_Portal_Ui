import Application from "../models/Application.model.js";
import Job from "../models/Job.model.js";

//
// 📝 Seeker → Apply for a Job
//
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const seekerId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      jobId,
      seekerId
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job"
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      seekerId,
      recruiterId: job.recruiterId
    });

    res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
      error: error.message
    });
  }
};

//
// 📃 Seeker → View My Applications
//
export const getSeekerApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      seekerId: req.user._id
    })
      .populate("jobId", "title company location jobType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message
    });
  }
};

//
// 📃 Recruiter → View Applications for My Jobs
//
export const getRecruiterApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      recruiterId: req.user._id
    })
      .populate("jobId", "title company location")
      .populate("seekerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter applications",
      error: error.message
    });
  }
};

//
// 🔄 Recruiter → Update Application Status
//
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!["shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        recruiterId: req.user._id
      },
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message
    });
  }
};
