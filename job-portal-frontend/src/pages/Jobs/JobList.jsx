
import "./jobSearch.css";

import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { useToast } from "../../components/Toast/ToastProvider";



const DUMMY_JOBS = [
  {
    title: "Java Backend Developer",
    company: "TCS",
    location: "Mumbai",
    salary: "4-6 LPA",
    experience: "1-3",
    type: "Full-time",
    posted: "2 days ago",
    skills: ["Java", "Spring Boot", "MySQL"],
    description: "Work on backend services, microservices architecture, and relational DB design."
  },
  {
    title: "React JS Developer",
    company: "Infosys",
    location: "Pune",
    salary: "3-5 LPA",
    experience: "0-1",
    type: "Full-time",
    posted: "5 days ago",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    description: "Build modern web frontends and reusable components."
  },
  {
    title: "Python Developer Intern",
    company: "StartupX",
    location: "Remote",
    salary: "10k-15k / month",
    experience: "0-1",
    type: "Internship",
    posted: "1 day ago",
    skills: ["Python", "Django", "REST API"],
    description: "Internship: build REST APIs and help automate workflows."
  },
  {
    title: "Frontend Developer (Part-time)",
    company: "ABC Solutions",
    location: "Bangalore",
    salary: "2-3 LPA",
    experience: "1-3",
    type: "Part-time",
    posted: "1 week ago",
    skills: ["HTML", "CSS", "JavaScript"],
    description: "Part-time role for building landing pages and small features."
  },
  {
    title: "Senior Java Developer",
    company: "Wipro",
    location: "Pune",
    salary: "8-12 LPA",
    experience: "3+",
    type: "Full-time",
    posted: "3 days ago",
    skills: ["Java", "Spring Boot", "Microservices", "SQL"],
    description: "Lead backend teams, design microservices and ensure scalability."
  }
];

export default function JobSearch() {
  const toast = useToast();

  // form state
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  // jobs (in a real app you'd fetch; here we use dummy data)
  const jobs = useMemo(() => DUMMY_JOBS, []);

  // filtered list based on form
  const filteredJobs = useMemo(() => {
    const k = (keyword || "").trim().toLowerCase();
    return jobs.filter(job => {
      const inTitle = job.title.toLowerCase().includes(k);
      const inCompany = job.company.toLowerCase().includes(k);
      const inSkills = job.skills.some(s => s.toLowerCase().includes(k));
      const matchKeyword = k === "" || inTitle || inCompany || inSkills;

      const matchLocation = location === "" || job.location === location;
      const matchType = jobType === "" || job.type === jobType;

      let matchExperience = true;
      if (experience === "0-1") matchExperience = job.experience === "0-1";
      if (experience === "1-3") matchExperience = job.experience === "1-3";
      if (experience === "3+") matchExperience = job.experience === "3+";

      return matchKeyword && matchLocation && matchType && matchExperience;
    });
  }, [jobs, keyword, location, jobType, experience]);

  useEffect(() => {
    // handle ESC to close modal
    function onKey(e) {
      if (e.key === "Escape" && modalOpen) {
        closeModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  function handleSubmit(e) {
    e?.preventDefault();
    // filtering is reactive via state; no further action needed
  }

  function openModal(job) {
    setActiveJob(job);
    setModalOpen(true);
    // focus will be set via aria attributes - keep it simple
  }

  function closeModal() {
    setModalOpen(false);
    setActiveJob(null);
  }

  async function handleCopy() {
    if (!activeJob) return;
    const textToCopy = `
Job Title: ${activeJob.title}
Company: ${activeJob.company}
Location: ${activeJob.location}
Salary: ${activeJob.salary}
Experience: ${activeJob.experience} yrs
Type: ${activeJob.type}
Posted: ${activeJob.posted}
Description: ${activeJob.description || "No description provided."}
Skills: ${activeJob.skills.join(", ")}
    `.trim();
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast?.success?.("Job details copied to clipboard!");
    } catch {
      toast?.error?.("Failed to copy job details.");
    }
  }

  function handleApplyMail() {
    if (!activeJob) return;
    const subject = encodeURIComponent(`${activeJob.title} - Application`);
    const bodyText = encodeURIComponent(`Hello,\n\nI am interested in the ${activeJob.title} role at ${activeJob.company}.\n\nRegards,\n[Your Name]`);
    const mailto = `mailto:hr@${activeJob.company.toLowerCase().replace(/\s+/g, "")}.com?subject=${subject}&body=${bodyText}`;
    window.location.href = mailto;
  }

  return (
    <div>
      <Header />

      <div className="container" style={{ paddingTop: 12 }}>
        <section className="search-section" aria-labelledby="search-heading">
          <h2 id="search-heading" style={{ fontSize: 16, marginBottom: 10 }}>Search Jobs</h2>

          <form id="searchForm" onSubmit={handleSubmit}>
            <div className="search-row" style={{ marginBottom: 10 }}>
              <input
                type="text"
                id="keyword"
                placeholder="Job title, skill, company (e.g. Java Developer)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search keyword"
              />

              <select id="location" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location">
                <option value="">All Locations</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Remote">Remote</option>
              </select>

              <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>Search</button>
            </div>

            <div className="filters" style={{ marginBottom: 18 }}>
              <div className="filter-group" role="group" aria-label="Job Type">
                <strong>Job Type:</strong>
                <label style={{ marginLeft: 8 }}><input type="radio" name="jobType" value="" checked={jobType === ""} onChange={() => setJobType("")} /> All</label>
                <label style={{ marginLeft: 8 }}><input type="radio" name="jobType" value="Full-time" checked={jobType === "Full-time"} onChange={() => setJobType("Full-time")} /> Full-time</label>
                <label style={{ marginLeft: 8 }}><input type="radio" name="jobType" value="Part-time" checked={jobType === "Part-time"} onChange={() => setJobType("Part-time")} /> Part-time</label>
                <label style={{ marginLeft: 8 }}><input type="radio" name="jobType" value="Internship" checked={jobType === "Internship"} onChange={() => setJobType("Internship")} /> Internship</label>
              </div>

              <div className="filter-group" role="group" aria-label="Experience">
                <strong>Experience:</strong>
                <label style={{ marginLeft: 8 }}><input type="radio" name="experience" value="" checked={experience === ""} onChange={() => setExperience("")} /> Any</label>
                <label style={{ marginLeft: 8 }}><input type="radio" name="experience" value="0-1" checked={experience === "0-1"} onChange={() => setExperience("0-1")} /> 0-1 yrs</label>
                <label style={{ marginLeft: 8 }}><input type="radio" name="experience" value="1-3" checked={experience === "1-3"} onChange={() => setExperience("1-3")} /> 1-3 yrs</label>
                <label style={{ marginLeft: 8 }}><input type="radio" name="experience" value="3+" checked={experience === "3+"} onChange={() => setExperience("3+")} /> 3+ yrs</label>
              </div>
            </div>
          </form>
        </section>

        <div id="resultsInfo" style={{ marginBottom: 10, fontSize: 14, color: "#555", textAlign: "center" }}>
          Showing {filteredJobs.length} job(s)
        </div>

        <section className="job-list" id="jobList" aria-live="polite">
          {filteredJobs.length === 0 ? (
            <div className="no-results">No jobs found. Try changing filters.</div>
          ) : (
            filteredJobs.map((job, index) => (
              <article className="job-card" key={`${job.company}-${index}`} style={{ marginBottom: 12 }}>
                <div className="job-header">
                  <div className="job-title">{job.title}</div>
                  <div className="job-salary">{job.salary || ""}</div>
                </div>

                <div className="job-meta" style={{ marginBottom: 6 }}>
                  <span><strong>{job.company}</strong></span>
                  <span style={{ marginLeft: 12 }}>{job.location}</span>
                  <span style={{ marginLeft: 12 }}>Exp: {job.experience} yrs</span>
                  <span style={{ marginLeft: 12 }}>Posted: {job.posted}</span>
                </div>

                <div className="skills" style={{ marginBottom: 8 }}>
                  {job.skills.map((s) => (
                    <span className="skill-tag" key={s} style={{ marginRight: 6 }}>{s}</span>
                  ))}
                </div>

                <div className="job-footer">
                  <span className="job-type">{job.type}</span>
                  <button
                    className="view-btn"
                    onClick={() => openModal(job)}
                    aria-haspopup="dialog"
                    aria-controls="modalOverlay"
                    style={{ cursor: "pointer" }}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      {/* Modal */}
      <div
        className={`modal-overlay ${modalOpen ? "active" : ""}`}
        id="modalOverlay"
        aria-hidden={!modalOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal" tabIndex={-1} aria-live="polite">
          <header className="modal-header">
            <h2 className="modal-title" id="modalTitle">
              {activeJob ? `${activeJob.title} — ${activeJob.company}` : "Job"}
            </h2>
            <button
              className="close-btn"
              id="modalClose"
              aria-label="Close modal"
              onClick={closeModal}
            >
              &times;
            </button>
          </header>

          <section className="modal-body" id="modalBody">
            {activeJob ? (
              <>
                <p><strong>Location:</strong> {activeJob.location}</p>
                <p><strong>Salary:</strong> {activeJob.salary}</p>
                <p><strong>Experience:</strong> {activeJob.experience} yrs</p>
                <p><strong>Type:</strong> {activeJob.type}</p>
                <p><strong>Posted:</strong> {activeJob.posted}</p>
                <p><strong>Description:</strong> {activeJob.description || "No description provided."}</p>
                <div className="modal-skills" style={{ marginTop: 8 }}>
                  <strong>Skills:</strong>{" "}
                  {activeJob.skills.map(s => <span key={s} className="skill-tag" style={{ marginLeft: 8 }}>{s}</span>)}
                </div>
              </>
            ) : null}
          </section>

          <footer className="modal-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" id="copyBtn" type="button" onClick={handleCopy}>Copy Details</button>
            <button className="btn btn-primary" id="applyBtn" type="button" onClick={handleApplyMail}>Apply (mailto)</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
