import User from "../models/User.model.js";

/**
 * GET /api/candidates
 * Recruiter: get all seekers as candidates
 */
export async function getAllCandidates(req, res) {
  try {
    const candidates = await User.find({ role: "seeker" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: candidates
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch candidates"
    });
  }
}

/**
 * GET /api/candidates/search?q=
 * Recruiter: search candidates
 */
export async function searchCandidates(req, res) {
  try {
    const q = req.query.q || "";

    const candidates = await User.find({
      role: "seeker",
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } }
      ]
    }).select("-password");

    res.json({
      success: true,
      data: candidates
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Search failed"
    });
  }
}

/**
 * GET /api/candidates/:id
 * Recruiter: get single candidate profile
 */
export async function getCandidateById(req, res) {
  try {
    const candidate = await User.findOne({
      _id: req.params.id,
      role: "seeker"
    }).select("-password");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch candidate"
    });
  }
}
