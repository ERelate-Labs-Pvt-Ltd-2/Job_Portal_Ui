// assets/js/data.js

// Simple static job data for now (you can fetch from backend later)
const JOBS = [
  {
    id: "1",
    title: "Frontend Developer (React)",
    location: "Remote",
    type: "Full-time",
    experience: "0-2 years",
    description:
      "Work with modern frontend stack to build responsive user interfaces.",
    requirements: [
      "Strong understanding of HTML, CSS, JavaScript",
      "Familiar with React or similar framework",
      "Basic knowledge of Git",
    ],
  },
  {
    id: "2",
    title: "Backend Developer (Node.js)",
    location: "Ahmedabad",
    type: "Full-time",
    experience: "1-3 years",
    description:
      "Build scalable REST APIs and services using Node.js and Express.",
    requirements: [
      "Experience with Node.js and Express",
      "Working knowledge of databases (MongoDB / SQL)",
      "Understanding of REST APIs",
    ],
  },
  {
    id: "3",
    title: "Software Developer Intern",
    location: "Mumbai",
    type: "Internship",
    experience: "0-1 years",
    description:
      "6-month internship with exposure to full-stack development and DevOps.",
    requirements: [
      "Good problem solving skills",
      "Basic programming knowledge (Java / Python / JS)",
      "Eager to learn new technologies",
    ],
  },
];

// You can later change this into an API layer.
// For now, keep it simple.
function getAllJobs() {
  return JOBS;
}

// Expose to other scripts (since we're using plain <script> tags)
window.JobData = {
  getAllJobs,
};
