// assets/js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    jobs: JobData.getAllJobs(), // from data.js
    selectedJob: null,
  };

  const views = {
    home: document.getElementById("home-view"),
    jobs: document.getElementById("jobs-view"),
    jobDetail: document.getElementById("job-detail-view"),
    admin: document.getElementById("admin-view"),
  };

  const navLinks = document.querySelectorAll(".nav-link");
  const browseJobsBtn = document.getElementById("browse-jobs-btn");
  const jobsListEl = document.getElementById("jobs-list");
  const jobDetailEl = document.getElementById("job-detail");
  const backToJobsBtn = document.getElementById("back-to-jobs");
  const yearEl = document.getElementById("year");
  const adminJobsListEl = document.getElementById("admin-jobs-list");

  // Form fields
  const jobForm = document.getElementById("job-form");
  const jobTitleInput = document.getElementById("job-title");
  const jobLocationInput = document.getElementById("job-location");
  const jobTypeSelect = document.getElementById("job-type");
  const jobExperienceInput = document.getElementById("job-experience");
  const jobDescriptionInput = document.getElementById("job-description");
  const jobRequirementsInput = document.getElementById("job-requirements");

  // Footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // View switching
  function setActiveView(viewName) {
    // Update active class for views
    Object.values(views).forEach((el) => el.classList.remove("active"));

    switch (viewName) {
      case "home":
        views.home.classList.add("active");
        break;
      case "jobs":
        views.jobs.classList.add("active");
        break;
      case "jobDetail":
        views.jobDetail.classList.add("active");
        break;
      case "admin":
        views.admin.classList.add("active");
        break;
      default:
        views.home.classList.add("active");
    }

    // Update nav active state
    navLinks.forEach((link) => {
      const target = link.getAttribute("data-view");
      const shouldBeActive =
        (viewName === "home" && target === "home-view") ||
        (viewName === "jobs" && target === "jobs-view") ||
        (viewName === "admin" && target === "admin-view");

      if (shouldBeActive) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Render job list
  function renderJobs() {
    jobsListEl.innerHTML = "";

    if (!state.jobs || state.jobs.length === 0) {
      jobsListEl.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    state.jobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "job-card";
      card.dataset.id = job.id;

      card.innerHTML = `
        <h3 class="job-card-title">${job.title}</h3>
        <p class="job-card-meta">
          ${job.location || "Location N/A"} • ${job.type || "Type N/A"} • ${
        job.experience || "Experience N/A"
      }
        </p>
        <div class="job-card-tags">
          <span class="tag">${job.type}</span>
          <span class="tag">${job.location}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        openJobDetail(job.id);
      });

      jobsListEl.appendChild(card);
    });
  }

  // Render job detail
  function openJobDetail(jobId) {
    const job = state.jobs.find((j) => j.id === jobId);
    if (!job) return;

    state.selectedJob = job;
    setActiveView("jobDetail");

    // Build requirements list
    const requirementsHtml = (job.requirements || [])
      .map((req) => `<li>${req}</li>`)
      .join("");

    jobDetailEl.innerHTML = `
      <h2>${job.title}</h2>
      <p class="meta">${job.location} • ${job.type} • ${
      job.experience || "Experience N/A"
    }</p>
      <h3>Job Description</h3>
      <p>${job.description || "No description provided."}</p>
      <h3>Requirements</h3>
      <ul>
        ${requirementsHtml || "<li>No specific requirements listed.</li>"}
      </ul>
      <button class="btn btn-primary" id="apply-btn">Apply Now</button>
    `;

    // Skeleton "apply" handler – you can replace with real logic / form / modal
    const applyBtn = document.getElementById("apply-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        alert("Apply logic goes here! (e.g., open form / send application)");
      });
    }
  }

  // Render jobs in Admin list
  function renderAdminJobs() {
    adminJobsListEl.innerHTML = "";

    state.jobs.forEach((job) => {
      const li = document.createElement("li");
      li.textContent = `${job.title} — ${job.location} (${job.type})`;
      adminJobsListEl.appendChild(li);
    });
  }

  // Handle nav clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const viewId = link.getAttribute("data-view");

      if (viewId === "home-view") {
        setActiveView("home");
      } else if (viewId === "jobs-view") {
        setActiveView("jobs");
      } else if (viewId === "admin-view") {
        setActiveView("admin");
      }
    });
  });

  // "Browse Jobs" button on hero
  if (browseJobsBtn) {
    browseJobsBtn.addEventListener("click", () => {
      setActiveView("jobs");
    });
  }

  // Back button in job detail view
  if (backToJobsBtn) {
    backToJobsBtn.addEventListener("click", () => {
      setActiveView("jobs");
    });
  }

  // Admin form submission (in-memory only)
  if (jobForm) {
    jobForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newJob = {
        id: String(state.jobs.length + 1),
        title: jobTitleInput.value.trim(),
        location: jobLocationInput.value.trim() || "Not specified",
        type: jobTypeSelect.value,
        experience: jobExperienceInput.value.trim(),
        description: jobDescriptionInput.value.trim(),
        requirements: jobRequirementsInput.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (!newJob.title) {
        alert("Job title is required.");
        return;
      }

      state.jobs.push(newJob);
      renderJobs();
      renderAdminJobs();
      jobForm.reset();

      alert("Job added (in-memory only). Connect to a backend to persist.");
    });
  }

  // TODO: add search + filter logic later
  // Example idea:
  // - read values from #search-input, #location-filter, #type-filter
  // - filter state.jobs and then call renderJobs(filteredJobs)

  // Initial render
  renderJobs();
  renderAdminJobs();
  setActiveView("home");
});
