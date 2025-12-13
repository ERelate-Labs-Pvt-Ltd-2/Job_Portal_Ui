import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SidebarRecruiter from '../../components/SidebarRecruiter';
import '../../pages/Recruiter/recruiter.css';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../components/Toast/ToastProvider';
import api from '../../services/api';
import { getUser, logout } from '../../services/tokenService';

/**
 * RecruiterDashboard — provides navigation to recruiter services:
 * - Post Job (/recruiter/post-job)
 * - View Applicants for each job (/recruiter/job/:id/applicants)
 * - Candidate Search (/recruiter/candidates)
 */
export default function RecruiterDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const toast = useToast();

  const [jobs, setJobs] = useState([]);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCompany, setQuickCompany] = useState('');
  const [quickLocation, setQuickLocation] = useState('');
  const [quickType, setQuickType] = useState('Full-time');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'recruiter') {
      navigate(
        user.role === 'seeker' ? '/seeker/dashboard' : '/',
        { replace: true }
      );
      return;
    }

    async function loadJobs() {
      try {
        const res = await api.get('/jobs/my');
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load your jobs');
      }
    }

    loadJobs();
  }, [user, navigate, toast]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // ✅ FIXED QUICK POST
  async function handleQuickPost(e) {
    e?.preventDefault();

    if (!quickTitle || !quickCompany) {
      toast.error('Please enter job title and company.');
      return;
    }

    try {
      const res = await api.post('/jobs', {
        title: quickTitle,
        company: quickCompany,
        location: quickLocation || 'Remote',
        jobType: quickType,          // ✅ correct key
        experience: 'Fresher',       // ✅ default
        salary: 'Not specified',
        description: 'Quick posted job from recruiter dashboard'
      });

      // prepend new job
      setJobs(prev => [res.data.job, ...prev]);

      setQuickTitle('');
      setQuickCompany('');
      setQuickLocation('');
      setQuickType('Full-time');

      toast.success(`Job "${res.data.job.title}" posted successfully.`);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Failed to post job'
      );
    }
  }

  return (
    <div className="recruiter-root">
      <Header onLogout={handleLogout} />

      <div className="container recruiter-container">
        <div className="recruiter-grid">
          <aside className="aside-col">
            <SidebarRecruiter />
            <div className="card stats-card">
              <h4>Quick Stats</h4>
              <ul className="stats-list">
                <li>
                  <span className="stat-label">Total Jobs</span>
                  <span className="stat-value">{jobs.length}</span>
                </li>
              
                <li>
                  <span className="stat-label">Active Listings</span>
                  <span className="stat-value">
                    {jobs.filter(j => !j.closed).length}
                  </span>
                </li>
              </ul>
            </div>
          </aside>

          <main className="main-col">
            <div className="top-row">
              <div>
                <h1 className="page-title">Recruiter Dashboard</h1>
                <div className="subtitle">
                  Welcome back, <strong>{user?.email}</strong>
                </div>
              </div>

              <div className="actions">
                <Link to="/recruiter/post-job" className="btn">
                  Post a Job
                </Link>
                <Link
                  to="/recruiter/candidates"
                  className="btn secondary"
                >
                  Search Candidates
                </Link>
              </div>
            </div>

            <section className="card quick-post">
              <h3>Quick Post Job</h3>
              <p className="muted">
                Post a simple job quickly — fill title and company and it
                will appear in your posted jobs list.
              </p>

              <form onSubmit={handleQuickPost} className="quick-post-form">
                <div className="form-row">
                  <input
                    placeholder="Job title"
                    value={quickTitle}
                    onChange={e => setQuickTitle(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <input
                    placeholder="Company"
                    value={quickCompany}
                    onChange={e => setQuickCompany(e.target.value)}
                  />
                  <input
                    placeholder="Location (optional)"
                    value={quickLocation}
                    onChange={e => setQuickLocation(e.target.value)}
                    style={{ marginLeft: 12 }}
                  />
                </div>

                <div className="form-row" style={{ alignItems: 'center' }}>
                  <select
                    value={quickType}
                    onChange={e => setQuickType(e.target.value)}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>

                  <div style={{ flex: 1 }} />

                  <button className="btn" type="submit">
                    Post Job
                  </button>
                </div>
              </form>
            </section>

            <section className="card posted-section">
              <h3>Your Posted Jobs</h3>

              {jobs.length === 0 ? (
                <div className="empty">
                  No jobs posted yet.
                </div>
              ) : (
                <div className="job-list">
                  {jobs.map(job => (
                    <article key={job._id} className="job-row">
                      <div className="job-left">
                        <div className="job-title">{job.title}</div>
                        <div className="job-meta">
                          {job.company} • {job.location} • {job.jobType}
                        </div>
                        <div className="job-desc">
                          {job.description}
                        </div>
                      </div>

                      <div className="job-right">
                        <div className="job-actions">
                          <Link
                            to={`/recruiter/job/${job._id}/applicants`}
                            className="btn small"
                          >
                            View Applicants
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <footer
        className="footer small muted"
        style={{ textAlign: 'center', padding: 18 }}
      >
        &copy; {new Date().getFullYear()} Job Portal — Recruiter Dashboard
      </footer>
    </div>
  );
}
