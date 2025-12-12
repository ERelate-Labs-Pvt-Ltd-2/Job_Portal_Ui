
import React, { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, clearSession } from '../../services/session';
import { listApplications } from '../../services/dummyApi';
import Header from '../../components/Header';
import '../../pages/Seeker/seeker.css';
import './applications.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/ToastProvider';

/**
 * MyApplications — converted from application_list.html — uses toasts for feedback.
 */
export default function MyApplications() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const toast = useToast();

  const [allApps, setAllApps] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalApp, setModalApp] = useState(null);

  useEffect(() => {
    const apps = listApplications();
    setAllApps(apps);
  }, []);

  // Filtered list based on search, status and date
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return allApps.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (dateFilter && d.appliedOn && d.appliedOn < dateFilter) return false;
      if (qLower) {
        const s = `${d.jobTitle || d.job || ''} ${d.company || ''} ${d.id || ''}`.toLowerCase();
        if (!s.includes(qLower)) return false;
      }
      return true;
    });
  }, [allApps, q, statusFilter, dateFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);

  function handleWithdraw(appId) {
    const app = allApps.find(a => a.id === appId);
    setModalApp(app);
    setModalOpen(true);
  }

  function confirmWithdraw() {
    if (!modalApp) return;
    const key = 'jobportal_apps';
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : listApplications();
      const idx = arr.findIndex(x => x.id === modalApp.id);
      if (idx >= 0) {
        arr[idx].status = 'withdrawn';
        localStorage.setItem(key, JSON.stringify(arr));
        setAllApps(arr);
        toast.success('Application withdrawn.');
      } else {
        const newList = allApps.map(a => a.id === modalApp.id ? { ...a, status: 'withdrawn' } : a);
        setAllApps(newList);
        localStorage.setItem(key, JSON.stringify(newList));
        toast.success('Application withdrawn (best-effort).');
      }
    } catch (e) {
      const newList = allApps.map(a => a.id === modalApp.id ? { ...a, status: 'withdrawn' } : a);
      setAllApps(newList);
      localStorage.setItem(key, JSON.stringify(newList));
      toast.success('Application withdrawn (best-effort).');
    }
    setModalOpen(false);
    setModalApp(null);
  }

  function closeModal() {
    setModalOpen(false);
    setModalApp(null);
    toast.info('Cancelled withdrawal');
  }

  function handleView(row) {
    // placeholder action; show toast instead of alert
    toast.info(`View details for ${row.jobTitle || row.job} (feature coming soon)`);
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="seeker-page-root">
      <Header onLogout={handleLogout} />

      <main className="main-container">
        <section className="cards-section" style={{ marginBottom: 12 }}>
          <h2 className="section-title">My Applications</h2>

          <div className="card" style={{ padding: 14 }}>
            <div className="controls" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                id="q"
                placeholder="Search by job title, company or id..."
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                style={{ padding: 10, borderRadius: 8, border: '1px solid #e6eef6', minWidth: 220 }}
              />

              <select id="statusFilter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="all">All statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>

              <label style={{ fontSize: 13, color: '#6b7280' }}>Applied after:</label>
              <input id="dateFilter" type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} />

              <div style={{ flex: 1 }} />

              <div className="small muted">Showing <strong>{filtered.length}</strong> of <strong>{allApps.length}</strong></div>
            </div>
          </div>
        </section>

        <section>
          <div className="table-wrapper">
            <table className="table" aria-label="My applications table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="tbody">
                {paged.length === 0 ? (
                  <tr className="empty">
                    <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>No applications found.</td>
                  </tr>
                ) : (
                  paged.map(row => (
                    <tr key={row.id || row.appid || Math.random()}>
                      <td>{row.id ?? row.appid}</td>
                      <td>{row.jobTitle ?? row.job}</td>
                      <td>{row.company ?? row.companyName ?? '—'}</td>
                      <td>{row.appliedOn ?? row.applied ?? '—'}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        <span className={`badge ${(row.status || '').toLowerCase()}`}>{row.status || 'submitted'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn small" onClick={() => handleView(row)}>View</button>
                        {row.status !== 'withdrawn' && (
                          <button className="btn small secondary" onClick={() => handleWithdraw(row.id ?? row.appid)} style={{ marginLeft: 8 }}>
                            Withdraw
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* pager */}
            <div className="pager" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center', paddingTop: 12 }}>
              <button id="prev" className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
              <div style={{ padding: '6px 10px', borderRadius: 8, background: '#f3f4f6' }}>{page} / {pages}</div>
              <button id="next" className="btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
            </div>
          </div>
        </section>
      </main>

      {/* Modal (withdraw confirm) */}
      {modalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ display: 'flex' }}>
          <div className="modal">
            <h3>Withdraw application</h3>
            <p>Are you sure you want to withdraw your application for <strong>{modalApp?.jobTitle ?? modalApp?.job}</strong>?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn secondary" onClick={closeModal}>Cancel</button>
              <button className="btn" onClick={confirmWithdraw}>Yes, withdraw</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: 20 }}>
        <p>&copy; {new Date().getFullYear()} Job Portal</p>
      </footer>
    </div>
  );
}
