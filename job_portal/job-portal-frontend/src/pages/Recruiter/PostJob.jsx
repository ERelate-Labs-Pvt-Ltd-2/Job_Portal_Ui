import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SidebarRecruiter from '../../components/SidebarRecruiter';
import { getUser, logout } from '../../services/tokenService';
import { postJob, getMyJobs } from '../../services/jobService';
import { useNavigate } from 'react-router-dom';
import '../../pages/Recruiter/recruiter.css';
import './postjob.css';

export default function PostJob() {
  const user = getUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user?.email || '');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [experience, setExperience] = useState(''); // optional
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [jobsCount, setJobsCount] = useState(0);

  // 🔹 Load recruiter job count
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await getMyJobs();
        setJobsCount(res.jobs?.length || 0);
      } catch {
        setJobsCount(0);
      }
    }
    loadJobs();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    setMessage('');

    // ❌ experience is NOT mandatory anymore
    if (!title || !company) {
      setMessage('Please provide job title and company.');
      return;
    }

    try {
      await postJob({
        title,
        company,
        location: location || 'Remote',
        jobType: type,
        experience: experience?.trim() || 'Fresher', // ✅ DEFAULT VALUE
        salary: salary || 'Not specified',
        description: description || 'No description provided',
        requirements: requirements || ''
      });

      setMessage('Job posted successfully');

      // reset form
      setTitle('');
      setLocation('');
      setType('Full-time');
      setExperience('');
      setSalary('');
      setDescription('');
      setRequirements('');

      // refresh job count
      const res = await getMyJobs();
      setJobsCount(res.jobs?.length || 0);

      setTimeout(() => setMessage(''), 6000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to post job');
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
              <h4>Posting Summary</h4>
              <ul className="stats-list">
                <li>
                  <span className="stat-label">Total Jobs</span>
                  <span className="stat-value">{jobsCount}</span>
                </li>
                <li>
                  <span className="stat-label">Your Email</span>
                  <span className="stat-value">{user?.email}</span>
                </li>
              </ul>
            </div>
          </aside>

          <main className="main-col">
            <div className="top-row">
              <div>
                <h1 className="page-title">Post a Job</h1>
                <div className="subtitle">
                  Create a detailed job post
                </div>
              </div>
            </div>

            <section className="card">
              <form className="post-job-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>Job Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                <div className="form-row">
                  <label>Company</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                  />
                </div>

                <div className="form-row">
                  <label>Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Remote, etc."
                  />
                </div>

                <div className="form-row">
                  <label>Job Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>

                {/* Experience (optional) */}
                <div className="form-row">
                  <label>Experience Required (optional)</label>
                  <input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. Fresher, 1–2 years, 5+ years"
                  />
                </div>

                <div className="form-row">
                  <label>Salary</label>
                  <input
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Salary (optional)"
                  />
                </div>

                <div className="form-row">
                  <label>Job Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe the role"
                  />
                </div>

                <div className="form-row">
                  <label>Requirements</label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows={4}
                    placeholder="Skills, qualifications"
                  />
                </div>

                {message && <div className="msg success">{message}</div>}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn" type="submit">Publish Job</button>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => navigate('/recruiter/dashboard')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>

      <footer className="footer small muted" style={{ textAlign: 'center', padding: 18 }}>
        &copy; {new Date().getFullYear()} Job Portal — Post Job
      </footer>
    </div>
  );
}
