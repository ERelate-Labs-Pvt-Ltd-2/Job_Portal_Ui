
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SidebarRecruiter from '../../components/SidebarRecruiter';
import { getCurrentUser, clearSession } from '../../services/session';
import { listJobs, addJob } from '../../services/dummyApi';
import '../../pages/Recruiter/recruiter.css';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../components/Toast/ToastProvider';

/**
 * RecruiterDashboard — provides navigation to recruiter services:
 * - Post Job (/recruiter/post-job)
 * - View Applicants for each job (/recruiter/job/:id/applicants)
 * - Candidate Search (/recruiter/candidates)
 * Uses toasts for feedback.
 */
export default function RecruiterDashboard() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const toast = useToast();

  const [jobs, setJobs] = useState([]);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCompany, setQuickCompany] = useState('');
  const [quickLocation, setQuickLocation] = useState('');
  const [quickType, setQuickType] = useState('Full-time');

  useEffect(() => {
    setJobs(listJobs());
  }, []);

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  function handleQuickPost(e) {
    e?.preventDefault();
    if (!quickTitle || !quickCompany) {
      toast.error('Please enter job title and company to post.');
      return;
    }
    const newJob = addJob({
      title: quickTitle,
      company: quickCompany,
      location: quickLocation || 'Remote',
      type: quickType,
      salary: 'Not specified',
      description: 'Quick posted job from recruiter dashboard'
    });
    // refresh jobs
    setJobs(listJobs());
    setQuickTitle('');
    setQuickCompany('');
    setQuickLocation('');
    setQuickType('Full-time');
    toast.success(`Job "${newJob.title}" posted successfully.`);
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
                <li><span className="stat-label">Total Jobs</span><span className="stat-value">{jobs.length}</span></li>
                <li><span className="stat-label">Applications</span><span className="stat-value"> {jobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0)}</span></li>
                <li><span className="stat-label">Active Listings</span><span className="stat-value">{jobs.filter(j => !j.closed).length}</span></li>
              </ul>
            </div>
          </aside>

          <main className="main-col">
            <div className="top-row">
              <div>
                <h1 className="page-title">Recruiter Dashboard</h1>
                <div className="subtitle">Welcome back, <strong>{user?.email ?? 'Recruiter'}</strong></div>
              </div>

              <div className="actions">
                <Link to="/recruiter/post-job" className="btn">Post a Job</Link>
                <Link to="/recruiter/candidates" className="btn secondary">Search Candidates</Link>
                <Link to="/recruiter/job/0/applicants" className="btn" onClick={(e)=>{ e.preventDefault(); navigate('/recruiter/job/0/applicants'); }}>View Applications</Link>
              </div>
            </div>

            <section className="card quick-post">
              <h3>Quick Post Job</h3>
              <p className="muted">Post a simple job quickly — fill title and company and it will appear in your posted jobs list.</p>

              <form onSubmit={handleQuickPost} className="quick-post-form">
                <div className="form-row">
                  <input
                    placeholder="Job title (e.g. Senior Backend Engineer)"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    aria-label="Quick job title"
                  />
                </div>

                <div className="form-row">
                  <input
                    placeholder="Company"
                    value={quickCompany}
                    onChange={(e) => setQuickCompany(e.target.value)}
                    aria-label="Quick company"
                  />
                  <input
                    placeholder="Location (optional)"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    aria-label="Quick location"
                    style={{ marginLeft: 12 }}
                  />
                </div>

                <div className="form-row" style={{ alignItems: 'center' }}>
                  <select value={quickType} onChange={(e) => setQuickType(e.target.value)}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>

                  <div style={{ flex: 1 }} />

                  <button className="btn" type="submit">Post Job</button>
                </div>
              </form>
            </section>

            <section className="card posted-section">
              <h3>Your Posted Jobs</h3>
              {jobs.length === 0 ? (
                <div className="empty">No jobs posted yet. Use Quick Post or the full Post Job form.</div>
              ) : (
                <div className="job-list">
                  {jobs.map(job => (
                    <article key={job.id} className="job-row">
                      <div className="job-left">
                        <div className="job-title">{job.title}</div>
                        <div className="job-meta">{job.company} • {job.location} • {job.type}</div>
                        <div className="job-desc">{job.description}</div>
                      </div>

                      <div className="job-right">
                        <div className="job-stats">
                          <div><strong>{(job.applications || []).length}</strong><div className="muted">apps</div></div>
                          <div style={{marginLeft:12}}><strong>{job.views || 0}</strong><div className="muted">views</div></div>
                        </div>

                        <div className="job-actions">
                          {/* Link navigates to the applicants list for this job */}
                          <Link to={`/recruiter/job/${job.id}/applicants`} className="btn small">View Applicants</Link>

                          <button className="btn small secondary" onClick={() => {
                            // toggle closed state (persist)
                            const key = 'jobportal_jobs';
                            try {
                              const raw = localStorage.getItem(key);
                              const arr = raw ? JSON.parse(raw) : listJobs();
                              const idx = arr.findIndex(j => j.id === job.id);
                              if (idx >= 0) {
                                arr[idx].closed = !arr[idx].closed;
                                localStorage.setItem(key, JSON.stringify(arr));
                                setJobs(arr);
                                toast.success(`${job.closed ? 'Reopened' : 'Closed'} "${job.title}"`);
                              }
                            } catch (e) {
                              const newList = jobs.map(j => j.id === job.id ? { ...j, closed: !j.closed } : j);
                              setJobs(newList);
                              localStorage.setItem('jobportal_jobs', JSON.stringify(newList));
                              toast.success('Job status updated (best-effort).');
                            }
                          }}>{job.closed ? 'Reopen' : 'Close'}</button>
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

      <footer className="footer small muted" style={{ textAlign: 'center', padding: 18 }}>
        &copy; {new Date().getFullYear()} Job Portal — Recruiter Dashboard
      </footer>
    </div>
  );
}
