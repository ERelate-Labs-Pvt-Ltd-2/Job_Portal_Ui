import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

import { registerUser, loginUser } from '../../services/authService';
import { saveAuth } from '../../services/tokenService';

/**
 * Converted from login_register.html
 * UI & markup preserved exactly.
 * ONLY logic changed to use backend APIs.
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
    setError('');
    setMessage('');
  }, [role, mode]);

  // 🔐 LOGIN (Backend)
  async function handleLogin(e) {
    e?.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      const res = await loginUser({ email, password });

      // role mismatch protection (same as old logic)
      if (res.user.role !== role) {
        setError(
          `This account is registered as "${res.user.role}". Please switch to the ${res.user.role} tab to login.`
        );
        return;
      }

      // save token + user
      saveAuth(res.token, res.user);

      // redirect
      if (res.user.role === 'seeker') navigate('/seeker/dashboard');
      else if (res.user.role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  // 📝 REGISTER (Backend)
  async function handleRegister(e) {
    e?.preventDefault();
    setError('');
    setMessage('');

    if (!regName || !regEmail || !regPassword) {
      setError('Please fill name, email and password to register.');
      return;
    }

    try {
      await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role
      });

      setMessage('Registration successful. Please login.');
      setMode('login');
      setEmail(regEmail);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  // keyboard-friendly submit
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
              <form id="loginForm" onSubmit={handleLogin} onKeyDown={handleKeyDown}>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <div className="msg error">{error}</div>}
                {message && <div className="msg success">{message}</div>}

                <button type="submit" className="login-btn">Login</button>

                <p style={{ textAlign: 'center', marginTop: 10 }}>
                  <a href="/forgot" onClick={(e) => { e.preventDefault(); navigate('/forgot'); }}>
                    Forgot Password?
                  </a>
                </p>
              </form>
            ) : (
              <form id="registerForm" onSubmit={handleRegister} onKeyDown={handleKeyDown}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Create password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />

                {error && <div className="msg error">{error}</div>}
                {message && <div className="msg success">{message}</div>}

                <button type="submit" className="login-btn">Register</button>

                <p style={{ textAlign: 'center', marginTop: 10 }}>
                  <a href="#login" onClick={(e) => { e.preventDefault(); setMode('login'); }}>
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
