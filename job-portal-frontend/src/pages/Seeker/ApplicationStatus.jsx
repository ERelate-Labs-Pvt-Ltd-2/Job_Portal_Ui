
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { getCurrentUser, clearSession } from '../../services/session';
import { listApplications } from '../../services/dummyApi';
import '../../pages/Seeker/seeker.css';
import './application-status.css';

/**
 * Converted from my_application_status.html — identical visuals and timeline UI.
 * Shows application details and a timeline of status updates.
 */
export default function ApplicationStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [application, setApplication] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const apps = listApplications();
    // id could be string; convert to number when needed
    const app = apps.find(a => String(a.id) === String(id));
    if (app) {
      setApplication(app);
      // Build a timeline from status. If original app has timeline, use it.
      // Here we infer a simple timeline from status history stored (if present).
      // If no history, build a default timeline based on status field.
      if (app.history && Array.isArray(app.history) && app.history.length) {
        setHistory(app.history);
      } else {
        // create sample timeline events for UI parity
        const baseDate = app.appliedOn || new Date().toISOString().slice(0, 10);
        const defaultHistory = [
          { date: baseDate, title: 'Applied', desc: `Application submitted by ${app.applicantEmail || user?.email || 'you'}` }
        ];
        if (app.status === 'under-review' || app.status === 'submitted') {
          defaultHistory.push({ date: addDays(baseDate, 3), title: 'Under review', desc: 'Recruiter is reviewing your application' });
        }
        if (app.status === 'shortlisted') {
          defaultHistory.push({ date: addDays(baseDate, 6), title: 'Shortlisted', desc: 'You have been shortlisted for interview' });
        }
        if (app.status === 'offered') {
          defaultHistory.push({ date: addDays(baseDate, 9), title: 'Offer', desc: 'Offer extended by recruiter' });
        }
        if (app.status === 'rejected') {
          defaultHistory.push({ date: addDays(baseDate, 5), title: 'Rejected', desc: 'Application was not moved forward' });
        }
        if (app.status === 'withdrawn') {
          defaultHistory.push({ date: addDays(baseDate, 2), title: 'Withdrawn', desc: 'You withdrew this application' });
        }
        setHistory(defaultHistory);
      }
    } else {
      // not found -> redirect to applications list
      navigate('/seeker/applications');
    }
  }, [id, navigate, user]);

  function addDays(dateStr, days) {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    } catch {
      // fallback: just return dateStr
      return dateStr;
    }
  }

  function handleBack() {
    navigate('/seeker/applications');
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  if (!application) {
    return null;
  }

  return (
    <div className="seeker-page-root">
      <Header onLogout={handleLogout} />

      <main className="main-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ marginBottom: 6 }}>{application.jobTitle || application.title || 'Application Details'}</h2>
            <div style={{ color: '#6b7280' }}>{application.company || application.companyName || 'Company'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={handleBack}>Back to Applications</button>
            <button className="btn secondary" onClick={() => alert('Download PDF - not implemented')}>Download</button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="app-meta" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Application ID</div>
              <div style={{ fontWeight: 700 }}>{application.id}</div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Applied On</div>
              <div>{application.appliedOn || application.applied || '—'}</div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Candidate</div>
              <div>{application.applicantEmail || user?.email || '—'}</div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Current Status</div>
              <div><span className={`badge ${(application.status || '').toLowerCase()}`}>{application.status || 'applied'}</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Application Timeline</h3>

          <div className="timeline">
            {history.map((h, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="timeline-marker" aria-hidden="true"></div>
                <div className="timeline-content">
                  <div className="timeline-date">{h.date}</div>
                  <div className="timeline-title">{h.title}</div>
                  <div className="timeline-desc">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="footer" style={{ marginTop: 20 }}>
        <p>&copy; {new Date().getFullYear()} Job Portal</p>
      </footer>
    </div>
  );
}
