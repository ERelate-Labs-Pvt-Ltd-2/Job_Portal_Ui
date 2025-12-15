import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      required: true
    },

    experience: {
      type: String,
      required: true
    },

    salary: {
      type: String,
      required: false
    },

    description: {
      type: String,
      required: true
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
