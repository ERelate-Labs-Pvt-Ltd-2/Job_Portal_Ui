import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/Seeker/seeker.css';
import { useToast } from '../../components/Toast/ToastProvider';
import api from '../../services/api';
import { getUser, logout } from '../../services/tokenService';

export default function SeekerDashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(() => getUser());
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  useEffect(() => {
    const cur = getUser();
    if (!cur) {
      navigate('/login', { replace: true });
      return;
    }

    if (cur.role !== 'seeker') {
      navigate(
        cur.role === 'recruiter'
          ? '/recruiter/dashboard'
          : '/',
        { replace: true }
      );
      return;
    }

    setUser(cur);
    loadData();
  }, []);

  async function loadData() {
    try {
      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.data.jobs || []);

      const appsRes = await api.get('/applications/seeker');
      const apps = appsRes.data.applications || [];
      setApplications(apps);

      setAppliedJobIds(
        new Set(
          apps
            .map(a => a.jobId?._id)
            .filter(Boolean)
            .map(String)
        )
      );
    } catch {
      toast.error('Failed to load dashboard data');
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  async function handleApply(job) {
    const jobId = String(job._id);
    if (appliedJobIds.has(jobId)) return;

    setLoadingId(jobId);

    try {
      await api.post(`/applications/apply/${jobId}`);
      toast.success(`Applied to "${job.title}"`);
      await loadData(); // refresh from DB
    } catch (err) {
      toast.error(err.response?.data?.message || 'Apply failed');
    } finally {
      setLoadingId(null);
    }
  }

  function getApplicationStatus(jobId) {
    const app = applications.find(
      a => String(a.jobId?._id) === String(jobId)
    );
    return app?.status || 'applied';
  }

  return (
    <div className="seeker-page-root">
      <Header onLogout={handleLogout} />

      <main className="main-container">
        {/* HERO */}
        <section className="hero">
          <div>
            <p className="hero-subtitle">Welcome,</p>
            <h1 className="hero-title">
              {user?.name || user?.email}
            </h1>

            <div className="hero-actions">
              <Link to="/jobs" className="btn primary">Search Jobs</Link>
              <Link to="/seeker/applications" className="btn outline">My Applications</Link>
            </div>
          </div>

          <div className="hero-card">
            <h3>Quick Overview</h3>
            <ul>
              <li>
                <span>Applications Submitted:</span>
                <strong>{applications.length}</strong>
              </li>
              <li>
                <span>Interviews Scheduled:</span>
                <strong>
                  {applications.filter(a => a.status === 'shortlisted').length}
                </strong>
              </li>
            </ul>
          </div>
        </section>

        {/* JOBS */}
        <section className="recent-section">
          <h2 className="section-title">Featured Jobs</h2>

          <div className="card" style={{ padding: 12 }}>
            {jobs.slice(0, 6).map(job => {
              const id = String(job._id);
              const applied = appliedJobIds.has(id);
              const status = applied ? getApplicationStatus(id) : null;

              return (
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 12,
                    borderBottom: '1px solid #eef2f8'
                  }}
                >
                  <div>
                    <strong>{job.title}</strong>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      {job.company} • {job.location} • {job.jobType}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      Experience: {job.experience}
                    </div>

                    {applied && (
                      <div style={{ marginTop: 6 }}>
                        <span className={`badge ${status}`}>
                          {status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      className="btn small secondary"
                      onClick={() => setViewJob(job)}
                    >
                      View
                    </button>

                    {applied ? (
                      <button className="btn small secondary" disabled>
                        Applied
                      </button>
                    ) : (
                      <button
                        className="btn small"
                        disabled={loadingId === id}
                        onClick={() => handleApply(job)}
                      >
                        {loadingId === id ? 'Applying…' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* VIEW JOB MODAL */}
      {viewJob && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 700 }}>
            <h2>{viewJob.title}</h2>
            <p className="muted">
              {viewJob.company} • {viewJob.location}
            </p>

            <div style={{ marginTop: 12 }}>
              <strong>Description</strong>
              <p>{viewJob.description}</p>
            </div>

            <div style={{ marginTop: 8 }}>
              <strong>Experience</strong>
              <p>{viewJob.experience}</p>
            </div>

            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button
                className="btn secondary"
                onClick={() => setViewJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        &copy; {new Date().getFullYear()} Job Portal
      </footer>
    </div>
  );
}
