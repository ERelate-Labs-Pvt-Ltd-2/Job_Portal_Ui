import React, { useEffect, useMemo, useState } from 'react';
import { getUser, logout } from '../../services/tokenService';
import { getSeekerApplications } from '../../services/applicationService';
import Header from '../../components/Header';
import '../../pages/Seeker/seeker.css';
import './applications.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/ToastProvider';

/**
 * MyApplications — UI preserved exactly.
 * Logic switched from dummyApi/localStorage to backend API.
 */
export default function MyApplications() {
  const navigate = useNavigate();
  const user = getUser();
  const toast = useToast();

  const [allApps, setAllApps] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalApp, setModalApp] = useState(null);

  // 🔹 Fetch applications from backend
  useEffect(() => {
    async function loadApps() {
      try {
        const res = await getSeekerApplications();
        setAllApps(res.applications || []);
      } catch (err) {
        toast.error('Failed to load applications');
      }
    }
    loadApps();
  }, [toast]);

  // Filter logic (UNCHANGED)
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return allApps.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (dateFilter && d.createdAt && d.createdAt.slice(0, 10) < dateFilter) return false;
      if (qLower) {
        const s = `${d.jobId?.title || ''} ${d.jobId?.company || ''} ${d._id || ''}`.toLowerCase();
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
    const app = allApps.find(a => a._id === appId);
    setModalApp(app);
    setModalOpen(true);
  }

  // ❌ Withdraw not supported in backend yet
  function confirmWithdraw() {
    toast.info('Withdraw feature will be available soon.');
    setModalOpen(false);
    setModalApp(null);
  }

  function closeModal() {
    setModalOpen(false);
    setModalApp(null);
    toast.info('Cancelled withdrawal');
  }

  function handleView(row) {
    toast.info(`View details for ${row.jobId?.title} (feature coming soon)`);
  }

  function handleLogout() {
    logout();
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
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>

              <label style={{ fontSize: 13, color: '#6b7280' }}>Applied after:</label>
              <input id="dateFilter" type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} />

              <div style={{ flex: 1 }} />

              <div className="small muted">
                Showing <strong>{filtered.length}</strong> of <strong>{allApps.length}</strong>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="table-wrapper">
            <table className="table">
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
              <tbody>
                {paged.length === 0 ? (
                  <tr className="empty">
                    <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  paged.map(row => (
                    <tr key={row._id}>
                      <td>{row._id}</td>
                      <td>{row.jobId?.title}</td>
                      <td>{row.jobId?.company}</td>
                      <td>{row.createdAt?.slice(0, 10)}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        <span className={`badge ${row.status}`}>{row.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn small" onClick={() => handleView(row)}>View</button>
                        <button
                          className="btn small secondary"
                          onClick={() => handleWithdraw(row._id)}
                          style={{ marginLeft: 8 }}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pager" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12 }}>
              <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
              <div style={{ padding: '6px 10px', borderRadius: 8, background: '#f3f4f6' }}>{page} / {pages}</div>
              <button className="btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex' }}>
          <div className="modal">
            <h3>Withdraw application</h3>
            <p>
              Are you sure you want to withdraw your application for{' '}
              <strong>{modalApp?.jobId?.title}</strong>?
            </p>
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
