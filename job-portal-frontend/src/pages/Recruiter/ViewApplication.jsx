
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SidebarRecruiter from '../../components/SidebarRecruiter';
import { getCurrentUser, clearSession } from '../../services/session';
import { getJobById, listApplicationsForJob, getApplicationById, listApplications } from '../../services/dummyApi';
import '../../pages/Recruiter/recruiter.css';
import './view-application.css';
import { useToast } from '../../components/Toast/ToastProvider';

/**
 * ViewApplication — shows applicants for a job and uses toasts for feedback.
 * Route: /recruiter/job/:id/applicants
 */
export default function ViewApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const j = getJobById(id);
    setJob(j);
    const list = listApplicationsForJob(id);
    setApps(list);
  }, [id]);

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  function handleViewApplication(appId) {
    const app = getApplicationById(appId);
    if (!app) {
      toast.error('Application details not found.');
      return;
    }
    // Show a toast with brief info and keep details in console for dev
    toast.info(`Applicant: ${app.applicantEmail} • Applied: ${app.appliedOn} • Status: ${app.status}`);
    // optional: log details for developer
    // console.log('Application details', app);
  }

  function handleToggleShortlist(a) {
    // quick status toggle demo: shortlisted <-> rejected
    const key = 'jobportal_apps';
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : listApplications();
      const idx = arr.findIndex(x => String(x.id) === String(a.id));
      if (idx >= 0) {
        arr[idx].status = arr[idx].status === 'shortlisted' ? 'rejected' : 'shortlisted';
        localStorage.setItem(key, JSON.stringify(arr));
        const updated = arr.filter(x => String(x.jobId) === String(id));
        setApps(updated);
        toast.success(`Status for ${a.applicantEmail} changed to "${arr[idx].status}"`);
        return;
      }
    } catch (e) {
      // fallback: update in-memory state for UI
      const newList = apps.map(x => x.id === a.id ? { ...x, status: x.status === 'shortlisted' ? 'rejected' : 'shortlisted' } : x);
      setApps(newList);
      localStorage.setItem('jobportal_apps', JSON.stringify(newList));
      toast.success('Status updated (best-effort).');
      return;
    }
    toast.error('Could not update status.');
  }

  return (
    <div className="recruiter-root">
      <Header onLogout={handleLogout} />

      <div className="container recruiter-container">
        <div className="recruiter-grid">
          <aside className="aside-col">
            <SidebarRecruiter />
          </aside>

          <main className="main-col">
            <div className="top-row" style={{ marginBottom: 12 }}>
              <div>
                <h1 className="page-title">Applicants for: {job ? job.title : ' — '}</h1>
                <div className="subtitle">{job ? `${job.company} • ${job.location}` : ''}</div>
              </div>

              <div className="actions">
                <button className="btn" onClick={() => navigate('/recruiter/dashboard')}>Back to Dashboard</button>
                <button className="btn secondary" onClick={() => toast.info('Export CSV — not implemented')}>Export</button>
              </div>
            </div>

            <section className="card">
              <h3>Applicants</h3>

              {apps.length === 0 ? (
                <div className="empty" style={{ padding: 20 }}>No applicants yet for this job.</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {apps.map(a => (
                    <div key={a.id} className="app-row" style={{ display: 'flex', justifyContent:'space-between', gap:12, alignItems:'center', border:'1px solid #eef2ff', padding:12, borderRadius:8 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{a.applicantEmail}</div>
                        <div style={{ color:'#6b7280', fontSize:13 }}>{a.coverLetter ? a.coverLetter.slice(0,120) + (a.coverLetter.length>120? '...':'') : '—'}</div>
                      </div>

                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <div style={{ textAlign:'right', marginRight:6 }}>
                          <div style={{ fontSize:13, color:'#6b7280' }}>{a.appliedOn}</div>
                          <div><span className={`badge ${(a.status||'').toLowerCase()}`}>{a.status || 'applied'}</span></div>
                        </div>

                        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                          <button className="btn small" onClick={() => handleViewApplication(a.id)}>View</button>
                          <button className="btn small secondary" onClick={() => handleToggleShortlist(a)}>Toggle Shortlist</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </section>
          </main>
        </div>
      </div>

      <footer className="footer" style={{ marginTop: 18 }}>&copy; {new Date().getFullYear()} Job Portal</footer>
    </div>
  );
}
