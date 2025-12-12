
import React, { useEffect, useState } from 'react';
import { getCurrentUser, clearSession } from '../../services/session';
import { listJobs, addApplication, listApplications } from '../../services/dummyApi';
import Header from '../../components/Header';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/Seeker/seeker.css';
import { useToast } from '../../components/Toast/ToastProvider';
import { ensureRole } from '../../utils/authGuard';

/**
 * SeekerDashboard — fixed to avoid "Maximum update depth exceeded"
 *
 * Key fixes:
 * - Single guarded useEffect that early-returns on redirect (so it never sets state after navigate)
 * - No unconditional setState in effects that run every render
 * - Keeps Apply -> Applied UX, toasts, and navigation guards
 */
export default function SeekerDashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(() => getCurrentUser());
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // one safe initialization effect:
  useEffect(() => {
    const cur = getCurrentUser();

    // If not logged in -> redirect and STOP (do not set state)
    if (!cur) {
      navigate('/login', { replace: true });
      return;
    }

    // If wrong role -> redirect and STOP
    if (cur.role !== 'seeker') {
      if (cur.role === 'recruiter') navigate('/recruiter/dashboard', { replace: true });
      else navigate('/', { replace: true });
      return;
    }

    // At this point user is a seeker and we can safely initialize state once
    setUser(cur);

    // load jobs and applied IDs (these are localStorage based and stable)
    try {
      const allJobs = listJobs();
      setJobs(allJobs);

      const apps = listApplications().filter(a => a.applicantEmail === cur.email);
      setAppliedJobIds(new Set(apps.map(a => String(a.jobId))));
    } catch (err) {
      // defensive: if dummyApi throws, just leave lists empty and show a toast
      console.error('Failed to initialize seeker dashboard', err);
      toast.error('Failed to load data (demo).');
    }
    // NOTE: navigate is stable so including it in deps is fine — effect still runs once for this component mount.
  }, [navigate, toast]);

  function handleLogout() {
    clearSession();
    setUser(null);
    navigate('/login');
  }

  async function handleApply(job) {
    // Use the shared helper to check login + role and show toast + redirect appropriately.
    if (!ensureRole('seeker', navigate, toast)) return;

    const cur = getCurrentUser();
    if (!cur) return; // defensive

    // Prevent double apply
    const already = listApplications().some(a => String(a.jobId) === String(job.id) && a.applicantEmail === cur.email);
    if (already) {
      setAppliedJobIds(prev => {
        const next = new Set(prev);
        next.add(String(job.id));
        return next;
      });
      toast.info('You already applied to this job.');
      return;
    }

    const app = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantEmail: cur.email,
      appliedOn: new Date().toISOString().slice(0, 10),
      status: 'applied',
      coverLetter: ''
    };

    try {
      addApplication(app);
      setAppliedJobIds(prev => {
        const s = new Set(prev);
        s.add(String(job.id));
        return s;
      });
      toast.success(`Applied to "${job.title}"`);
      setTimeout(() => navigate('/seeker/applications'), 650);
    } catch (e) {
      console.error(e);
      toast.error('Could not apply — please try again.');
    }
  }

  // quick counts for the header card
  const savedCount = 3;
  const interviewCount = 1;

  const appliedCount = (() => {
    if (!user) return 0;
    return listApplications().filter(a => a.applicantEmail === user.email).length;
  })();

  const latestAppId = (() => {
    if (!user) return null;
    const all = listApplications().filter(a => a.applicantEmail === user.email);
    if (!all || all.length === 0) return null;
    return String(all[0].id);
  })();

  return (
    <div className="seeker-page-root">
      <Header onLogout={handleLogout} />

      <main className="main-container">
        {/* Hero / Welcome section */}
        <section className="hero">
          <div>
            <p className="hero-subtitle">Welcome,</p>
            <h1 className="hero-title">
              <span id="user-name">{user?.email ?? 'Job Seeker'}</span>
            </h1>
            <p className="hero-desc">
              Manage your job search from one place — search jobs, track applications, and stay updated on your application status.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn primary">Search Jobs</Link>
              <Link to="/seeker/applications" className="btn outline">My Applications</Link>
              <Link to={latestAppId ? `/seeker/application/${latestAppId}` : '/seeker/applications'} className="btn outline">
                {latestAppId ? 'Check Latest Application Status' : 'Application Status'}
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <h3>Quick Overview</h3>
            <ul>
              <li><span>Jobs Saved:</span> <strong id="saved-count">{savedCount}</strong></li>
              <li><span>Applications Submitted:</span> <strong id="applied-count">{appliedCount}</strong></li>
              <li><span>Interviews Scheduled:</span> <strong id="interview-count">{interviewCount}</strong></li>
            </ul>
          </div>
        </section>

        {/* Main actions */}
        <section className="cards-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="card-grid">
            <article className="card">
              <h3>Search Jobs</h3>
              <p>Browse and search jobs by title, company or location.</p>
              <Link to="/jobs" className="btn small">Go to Search</Link>
            </article>

            <article className="card">
              <h3>My Applications</h3>
              <p>View and manage all your submitted applications.</p>
              <Link to="/seeker/applications" className="btn small">View Applications</Link>
            </article>

            <article className="card">
              <h3>Application Status</h3>
              <p>Check the timeline for an application.</p>
              <Link to={latestAppId ? `/seeker/application/${latestAppId}` : '/seeker/applications'} className="btn small">Check Status</Link>
            </article>

            <article className="card">
              <h3>Profile / Resume</h3>
              <p>Update your profile and resume (coming soon).</p>
              <button className="btn small secondary" onClick={() => toast.info('Edit Profile — coming soon')}>Edit Profile</button>
            </article>
          </div>
        </section>

        {/* Featured Jobs list */}
        <section className="recent-section">
          <h2 className="section-title">Featured Jobs</h2>
          <div className="card" style={{ padding: 12 }}>
            {jobs.length === 0 ? (
              <div className="empty" style={{ padding: 18 }}>No jobs available.</div>
            ) : (
              jobs.slice(0, 6).map(job => {
                const applied = appliedJobIds.has(String(job.id));
                return (
                  <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid #eef2f8' }}>
                    <div>
                      <strong>{job.title}</strong>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{job.company} • {job.location}</div>
                      <div style={{ marginTop: 6 }}>{job.description}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <Link to="/jobs" className="btn small">View</Link>
                      {applied ? (
                        <button className="btn small secondary" disabled style={{ opacity: 0.75, cursor: 'default' }}>Applied</button>
                      ) : (
                        <button className="btn small" onClick={() => handleApply(job)}>Apply</button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; <span id="year">{new Date().getFullYear()}</span> Job Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
