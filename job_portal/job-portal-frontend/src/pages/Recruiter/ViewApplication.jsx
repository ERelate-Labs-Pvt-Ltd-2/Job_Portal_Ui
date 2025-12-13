import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SidebarRecruiter from '../../components/SidebarRecruiter';
import { getUser, logout } from '../../services/tokenService';
import {
  getRecruiterApplications,
  updateApplicationStatus
} from '../../services/applicationService';
import '../../pages/Recruiter/recruiter.css';
import './view-application.css';
import { useToast } from '../../components/Toast/ToastProvider';

/**
 * ViewApplication — UI preserved exactly.
 * Backend integration for recruiter applications.
 */
export default function ViewApplication() {
  const { id } = useParams(); // job id from URL
  const navigate = useNavigate();
  const user = getUser();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);

  // 🔹 Fetch recruiter applications
  useEffect(() => {
    if (!id) {
      toast.error('Invalid job reference.');
      return;
    }

    async function loadApplications() {
      try {
        const res = await getRecruiterApplications();
        const all = res.applications || [];

        // filter applications for this job
        const filtered = all.filter(
          a => String(a.jobId?._id) === String(id)
        );

        setApps(filtered);

        // derive job info from first application (if exists)
        if (filtered.length > 0) {
          setJob(filtered[0].jobId);
        } else {
          setJob(null);
        }
      } catch (err) {
        toast.error('Failed to load applications');
      }
    }

    loadApplications();
  }, [id, toast]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleViewApplication(appId) {
    const app = apps.find(a => a._id === appId);
    if (!app) {
      toast.error('Application details not found.');
      return;
    }

    toast.info(
      `Applicant: ${app.seekerId?.email} • Applied: ${app.createdAt?.slice(0, 10)} • Status: ${app.status}`
    );
  }

  // 🔄 Toggle shortlisted ↔ rejected (REAL BACKEND)
  async function handleToggleShortlist(a) {
    const newStatus =
      a.status === 'shortlisted' ? 'rejected' : 'shortlisted';

    try {
      await updateApplicationStatus(a._id, newStatus);

      // update UI state
      setApps(prev =>
        prev.map(x =>
          x._id === a._id ? { ...x, status: newStatus } : x
        )
      );

      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Could not update status.'
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
          </aside>

          <main className="main-col">
            <div className="top-row" style={{ marginBottom: 12 }}>
              <div>
                <h1 className="page-title">
                  Applicants for: {job ? job.title : ' — '}
                </h1>
                <div className="subtitle">
                  {job ? `${job.company} • ${job.location}` : ''}
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn"
                  onClick={() => navigate('/recruiter/dashboard')}
                >
                  Back to Dashboard
                </button>
                <button
                  className="btn secondary"
                  onClick={() =>
                    toast.info('Export CSV — not implemented')
                  }
                >
                  Export
                </button>
              </div>
            </div>

            <section className="card">
              <h3>Applicants</h3>

              {apps.length === 0 ? (
                <div className="empty" style={{ padding: 20 }}>
                  No applicants yet for this job.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {apps.map(a => (
                    <div
                      key={a._id}
                      className="app-row"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        alignItems: 'center',
                        border: '1px solid #eef2ff',
                        padding: 12,
                        borderRadius: 8
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {a.seekerId?.email}
                        </div>
                        <div
                          style={{
                            color: '#6b7280',
                            fontSize: 13
                          }}
                        >
                          —
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center'
                        }}
                      >
                        <div
                          style={{
                            textAlign: 'right',
                            marginRight: 6
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              color: '#6b7280'
                            }}
                          >
                            {a.createdAt?.slice(0, 10)}
                          </div>
                          <div>
                            <span
                              className={`badge ${(a.status || '').toLowerCase()}`}
                            >
                              {a.status || 'applied'}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                          }}
                        >
                          <button
                            className="btn small"
                            onClick={() =>
                              handleViewApplication(a._id)
                            }
                          >
                            View
                          </button>
                          <button
                            className="btn small secondary"
                            onClick={() =>
                              handleToggleShortlist(a)
                            }
                          >
                            Toggle Shortlist
                          </button>
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

      <footer className="footer" style={{ marginTop: 18 }}>
        &copy; {new Date().getFullYear()} Job Portal
      </footer>
    </div>
  );
}
