import api from './api';

/**
 * Seeker: get all applications of logged-in seeker
 * Used by: MyApplications.jsx
 */
export async function getSeekerApplications() {
  const res = await api.get('/applications/seeker');
  return res.data;
}

/**
 * Recruiter: get all applications for recruiter jobs
 * Used by: ViewApplication.jsx
 *
 * Backend does NOT filter by jobId in route.
 * Filtering (if needed) should be done on frontend.
 */
export async function getRecruiterApplications() {
  const res = await api.get('/applications/recruiter');
  return res.data;
}

/**
 * Seeker: apply to a job
 */
export async function applyToJob(jobId, payload = {}) {
  const res = await api.post(`/applications/apply/${jobId}`, payload);
  return res.data;
}

/**
 * Recruiter: update application status
 */
export async function updateApplicationStatus(applicationId, status) {
  const res = await api.patch(
    `/applications/${applicationId}/status`,
    { status }
  );
  return res.data;
}
