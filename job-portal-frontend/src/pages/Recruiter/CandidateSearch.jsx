
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SidebarRecruiter from '../../components/SidebarRecruiter';
import { listCandidates, searchCandidates, findCandidateById } from '../../services/dummyApi';
import { getCurrentUser, clearSession } from '../../services/session';
import '../../pages/Recruiter/recruiter.css';
import './candidate-search.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/ToastProvider';

export default function CandidateSearch() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const toast = useToast();

  const [q, setQ] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setCandidates(listCandidates());
  }, []);

  function handleSearch(e) {
    e?.preventDefault();
    const results = searchCandidates(q);
    setCandidates(results);
    toast.info(`${results.length} candidate(s) found`);
  }

  function handleClear() {
    setQ('');
    setCandidates(listCandidates());
    toast.info('Cleared search');
  }

  function openCandidate(id) {
    const cand = findCandidateById(id);
    if (!cand) {
      toast.error('Candidate not found');
      return;
    }
    setSelected(cand);
  }

  function closeCandidate() {
    setSelected(null);
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="recruiter-root">
      <Header onLogout={handleLogout} />

      <div className="container recruiter-container">
        <div className="recruiter-grid">
          <aside className="aside-col">
            <SidebarRecruiter />
            <div className="card">
              <h4>Search</h4>
              <p className="muted">Find candidates by name, skills or email.</p>
            </div>
          </aside>

          <main className="main-col">
            <div className="top-row" style={{ marginBottom: 12 }}>
              <div>
                <h1 className="page-title">Search Candidates</h1>
                <div className="subtitle">Search and view candidate resumes</div>
              </div>

              <div className="actions">
                <button className="btn" onClick={() => navigate('/recruiter/dashboard')}>Dashboard</button>
              </div>
            </div>

            <section className="card">
              <form onSubmit={handleSearch} style={{ display:'flex', gap:8 }}>
                <input placeholder="Search by name, skills or email" value={q} onChange={(e)=>setQ(e.target.value)} style={{flex:1}} />
                <button className="btn" type="submit">Search</button>
                <button type="button" className="btn secondary" onClick={handleClear}>Clear</button>
              </form>
            </section>

            <section className="card" style={{ marginTop: 12 }}>
              <div className="candidate-grid">
                {candidates.map(c => (
                  <article key={c.id} className="candidate-card">
                    <div>
                      <div className="candidate-name">{c.name}</div>
                      <div className="muted">{c.location} • {c.experience}</div>
                      <div style={{ marginTop: 8, fontSize: 13 }}>{c.skills}</div>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      <button className="btn small" onClick={() => openCandidate(c.id)}>View Resume</button>
                      <button className="btn small secondary" onClick={() => { toast.info(`Contact ${c.email} (demo)`); }}>Contact</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Candidate modal */}
      {selected && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 760 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3>{selected.name}</h3>
              <div style={{ color:'#6b7280' }}>{selected.location}</div>
            </div>

            <div style={{ marginTop: 8, display:'flex', gap:12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8 }}><strong>Summary</strong><div className="muted" style={{ marginTop: 6 }}>{selected.summary}</div></div>
                <div style={{ marginTop: 8 }}>
                  <strong>Skills</strong>
                  <div className="muted" style={{ marginTop: 6 }}>{selected.skills}</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Experience</strong>
                  <div className="muted" style={{ marginTop: 6 }}>{selected.experience}</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong>Contact</strong>
                  <div style={{ marginTop: 6 }}>{selected.email}</div>
                </div>
              </div>

              <div style={{ width: 220 }}>
                <button className="btn" onClick={() => { toast.info('Download resume — demo'); }}>Download Resume</button>
                <button className="btn secondary" style={{ marginTop: 8 }} onClick={() => { toast.success('Shortlisted candidate (demo)'); }}>Shortlist</button>
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', marginTop: 12 }}>
              <button className="btn secondary" onClick={closeCandidate}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: 18 }}>&copy; {new Date().getFullYear()} Job Portal</footer>
    </div>
  );
}
