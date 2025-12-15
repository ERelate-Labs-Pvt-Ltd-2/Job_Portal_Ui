import "./jobSearch.css";

import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { useToast } from "../../components/Toast/ToastProvider";
import { getAllJobs } from "../../services/jobService";
import { applyToJob } from "../../services/applicationService";

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

  // jobs
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await getAllJobs();
        setJobs(res.jobs || []);
      } catch {
        setError("Failed to load jobs");
      }
    }
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const k = (keyword || "").trim().toLowerCase();
    return jobs.filter(job => {
      const inTitle = job.title.toLowerCase().includes(k);
      const inCompany = job.company.toLowerCase().includes(k);
      const inSkills =
        Array.isArray(job.skills) &&
        job.skills.some(s => s.toLowerCase().includes(k));

      const matchKeyword = k === "" || inTitle || inCompany || inSkills;
      const matchLocation = location === "" || job.location === location;
      const matchType = jobType === "" || job.jobType === jobType;

      let matchExperience = true;
      if (experience === "0-1") matchExperience = job.experience === "0-1";
      if (experience === "1-3") matchExperience = job.experience === "1-3";
      if (experience === "3+") matchExperience = job.experience === "3+";

      return matchKeyword && matchLocation && matchType && matchExperience;
    });
  }, [jobs, keyword, location, jobType, experience]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && modalOpen) closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  function handleSubmit(e) {
    e?.preventDefault();
  }

  function openModal(job) {
    setActiveJob(job);
    setModalOpen(true);
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
Salary: ${activeJob.salary || ""}
Experience: ${activeJob.experience} yrs
Type: ${activeJob.jobType}
Description: ${activeJob.description || "No description provided."}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast?.success?.("Job details copied to clipboard!");
    } catch {
      toast?.error?.("Failed to copy job details.");
    }
  }

  // ✅ REAL APPLY LOGIC (backend)
  async function handleApplyJob() {
    if (!activeJob) return;

    try {
      await applyToJob(activeJob._id);
      toast?.success?.("Job applied successfully!");
      closeModal();
    } catch (err) {
      toast?.error?.(
        err.response?.data?.message || "Failed to apply for job"
      );
    }
  }

  return (
    <div>
      <Header />

      <div className="container" style={{ paddingTop: 12 }}>
        <section className="search-section">
          <h2 style={{ fontSize: 16, marginBottom: 10 }}>Search Jobs</h2>

          <form id="searchForm" onSubmit={handleSubmit}>
            <div className="search-row" style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Job title, skill, company (e.g. Java Developer)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />

              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">All Locations</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Remote">Remote</option>
              </select>

              <button type="submit">Search</button>
            </div>
          </form>
        </section>

        <div style={{ marginBottom: 10, textAlign: "center" }}>
          Showing {filteredJobs.length} job(s)
        </div>

        <section className="job-list">
          {filteredJobs.length === 0 ? (
            <div className="no-results">No jobs found. Try changing filters.</div>
          ) : (
            filteredJobs.map((job) => (
              <article className="job-card" key={job._id}>
                <div className="job-header">
                  <div className="job-title">{job.title}</div>
                  <div className="job-salary">{job.salary || ""}</div>
                </div>

                <div className="job-footer">
                  <span className="job-type">{job.jobType}</span>
                  <button className="view-btn" onClick={() => openModal(job)}>
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
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal">
          <header className="modal-header">
            <h2>{activeJob ? `${activeJob.title} — ${activeJob.company}` : ""}</h2>
            <button className="close-btn" onClick={closeModal}>&times;</button>
          </header>

          <section className="modal-body">
            {activeJob && (
              <>
                <p><strong>Location:</strong> {activeJob.location}</p>
                <p><strong>Salary:</strong> {activeJob.salary}</p>
                <p><strong>Experience:</strong> {activeJob.experience} yrs</p>
                <p><strong>Type:</strong> {activeJob.jobType}</p>
                <p><strong>Description:</strong> {activeJob.description}</p>
              </>
            )}
          </section>

          <footer className="modal-actions">
            <button onClick={handleCopy}>Copy Details</button>
            <button onClick={handleApplyJob}>Apply</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
