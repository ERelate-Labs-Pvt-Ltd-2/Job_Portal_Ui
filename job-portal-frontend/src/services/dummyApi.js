
import jobsSeed from '../data/jobs';
import applicationsSeed from '../data/applications';
import candidatesSeed from '../data/candidates';

const JOBS_KEY = 'jobportal_jobs';
const APPS_KEY = 'jobportal_apps';
const CAND_KEY = 'jobportal_candidates';

function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed.slice();
  } catch {
    return seed.slice();
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* Jobs */
export function listJobs() {
  return load(JOBS_KEY, jobsSeed);
}

export function addJob(job) {
  const all = load(JOBS_KEY, jobsSeed);
  const id = Math.max(0, ...all.map(j => j.id)) + 1;
  const newJob = { ...job, id, applications: [], views: 0, closed: false };
  all.unshift(newJob);
  save(JOBS_KEY, all);
  return newJob;
}

export function getJobById(id) {
  const all = load(JOBS_KEY, jobsSeed);
  return all.find(j => String(j.id) === String(id)) || null;
}

/* Applications */
export function listApplications() {
  return load(APPS_KEY, applicationsSeed);
}

export function addApplication(app) {
  const all = load(APPS_KEY, applicationsSeed);
  const id = Math.max(0, ...all.map(a => a.id)) + 1;
  const newApp = { ...app, id, status: app.status || 'applied', appliedOn: app.appliedOn || new Date().toISOString().slice(0,10) };
  all.unshift(newApp);
  save(APPS_KEY, all);

  // also attach to job if job exists
  try {
    const jobs = load(JOBS_KEY, jobsSeed);
    const idx = jobs.findIndex(j => String(j.id) === String(app.jobId));
    if (idx >= 0) {
      jobs[idx].applications = jobs[idx].applications || [];
      jobs[idx].applications.push({ id: newApp.id, applicantEmail: newApp.applicantEmail });
      save(JOBS_KEY, jobs);
    }
  } catch { /* best-effort */ }

  return newApp;
}

export function getApplicationById(id) {
  const all = load(APPS_KEY, applicationsSeed);
  return all.find(a => String(a.id) === String(id)) || null;
}

export function listApplicationsForJob(jobId) {
  const all = load(APPS_KEY, applicationsSeed);
  return all.filter(a => String(a.jobId) === String(jobId));
}

/* Candidates */
export function listCandidates() {
  return load(CAND_KEY, candidatesSeed);
}

export function findCandidateById(id) {
  const all = load(CAND_KEY, candidatesSeed);
  return all.find(c => String(c.id) === String(id)) || null;
}

export function searchCandidates(q) {
  if (!q) return listCandidates();
  const ql = q.trim().toLowerCase();
  return listCandidates().filter(c => {
    return (c.name || '').toLowerCase().includes(ql)
      || (c.email || '').toLowerCase().includes(ql)
      || (c.skills || '').toLowerCase().includes(ql)
      || (c.summary || '').toLowerCase().includes(ql);
  });
}
