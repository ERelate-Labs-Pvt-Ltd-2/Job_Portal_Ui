
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { registerCredential, findCredential, findByEmail } from '../../services/credentials';
import { setCurrentUser } from '../../services/session';

/**
 * Converted from login_register.html (keeps original markup & styles).
 * See original source for reference. :contentReference[oaicite:1]{index=1}
 */
export default function Login() {
  const navigate = useNavigate();

  // UI tabs
  const [role, setRole] = useState('seeker'); // 'seeker' or 'recruiter'
  const [mode, setMode] = useState('login');  // 'login' or 'register'

  // login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // reset messages when tabs change
    setError('');
    setMessage('');
  }, [role, mode]);

  function handleLogin(e) {
    e?.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const user = findCredential(email, password);
    if (!user) {
      setError('Invalid credentials. Please register or check your password.');
      return;
    }

    // If user exists but role mismatch (registered as other role), block
    if (user.role !== role) {
      setError(`This account is registered as "${user.role}". Please switch to the ${user.role} tab to login.`);
      return;
    }

    // set session and redirect by role
    setCurrentUser({ email: user.email, role: user.role });
    if (user.role === 'seeker') navigate('/seeker/dashboard');
    else if (user.role === 'recruiter') navigate('/recruiter/dashboard');
    else navigate('/jobs');
  }

  function handleRegister(e) {
    e?.preventDefault();
    setError('');
    setMessage('');

    if (!regEmail || !regPassword || !regName) {
      setError('Please fill name, email and password to register.');
      return;
    }

    // prevent duplicate email
    const existing = findByEmail(regEmail);
    if (existing) {
      setError('Email already registered. Please login.');
      return;
    }

    const res = registerCredential({ email: regEmail, password: regPassword, role });
    if (!res.success) {
      setError(res.message || 'Registration failed');
      return;
    }

    setMessage('Registration successful. Please login.');
    // switch to login mode and prefill email
    setMode('login');
    setEmail(regEmail);
    setPassword('');
  }

  // keyboard-friendly quick submit for current mode
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (mode === 'login') handleLogin();
      else handleRegister();
    }
  }

  return (
    <div className="page-root">
      <header className="login-header">Job Portal</header>

      <div className="wrapper">
        <div className="left-side" aria-hidden="true"></div>

        <div className="right-side">
          <div className="login-box" role="region" aria-labelledby="formTitle">
            <h4 style={{ textAlign: 'center', fontSize: 24, fontWeight: 600 }}>
              Connecting Ambitious Talent with Opportunities
            </h4>

            {/* Role tabs */}
            <div className="tabs role-tabs" role="tablist" aria-label="Select role">
              <button
                className={role === 'seeker' ? 'active' : ''}
                onClick={() => setRole('seeker')}
                aria-pressed={role === 'seeker'}
              >
                Seeker
              </button>
              <button
                className={role === 'recruiter' ? 'active' : ''}
                onClick={() => setRole('recruiter')}
                aria-pressed={role === 'recruiter'}
              >
                Recruiter
              </button>
            </div>

            {/* Mode tabs */}
            <div className="tabs mode-tabs" role="tablist" aria-label="Login or register">
              <button
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
                aria-pressed={mode === 'login'}
              >
                Login
              </button>

              <button
                className={mode === 'register' ? 'active' : ''}
                onClick={() => setMode('register')}
                aria-pressed={mode === 'register'}
              >
                Register
              </button>
            </div>

            <h3 id="formTitle" style={{ textAlign: 'center', marginTop: 20 }}>
              {role === 'seeker' ? 'Seeker' : 'Recruiter'} {mode === 'login' ? 'Login' : 'Register'}
            </h3>

            {mode === 'login' ? (
              <form id="loginForm" onSubmit={handleLogin} onKeyDown={handleKeyDown} aria-label="Login form">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email"
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                />

                {error && <div className="msg error" role="alert">{error}</div>}
                {message && <div className="msg success" role="status">{message}</div>}

                <button type="submit" className="login-btn" aria-label="Login button">Login</button>

                <p style={{ textAlign: 'center', marginTop: 10 }}>
                  <a href="/forgot" onClick={(e) => { e.preventDefault(); navigate('/forgot'); }} style={{ fontSize: 14 }}>
                    Forgot Password?
                  </a>
                </p>
              </form>
            ) : (
              <form id="registerForm" onSubmit={handleRegister} onKeyDown={handleKeyDown} aria-label="Register form">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  aria-label="Full name"
                />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  aria-label="Email"
                />
                <input
                  type="password"
                  placeholder="Create password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  aria-label="Password"
                />

                {error && <div className="msg error" role="alert">{error}</div>}
                {message && <div className="msg success" role="status">{message}</div>}

                <button type="submit" className="login-btn">Register</button>

                <p style={{ textAlign: 'center', marginTop: 10 }}>
                  <a href="#login" onClick={(e) => { e.preventDefault(); setMode('login'); }} style={{ fontSize: 14 }}>
                    Already have an account? Login
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer className="login-footer">© 2025 Job Portal | All Rights Reserved</footer>
    </div>
  );
}
