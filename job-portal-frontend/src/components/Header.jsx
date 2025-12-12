
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/session';


export default function Header({ onLogout }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Decide where "home/dashboard" should go based on role
  const homeTarget = () => {
    if (!user) return '/jobs';
    if (user.role === 'seeker') return '/seeker/dashboard';
    if (user.role === 'recruiter') return '/recruiter/dashboard';
    return '/';
  };

  const go = (path) => (e) => {
    e?.preventDefault();
    navigate(path);
  };

  const handleHome = (e) => {
    e?.preventDefault();
    navigate(homeTarget());
  };

  const handleDashboard = (e) => {
    e?.preventDefault();
    navigate(homeTarget());
  };

  return (
    <header
      className="header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Brand / Home */}
        <a href="/" onClick={handleHome} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          JobPortal
        </a>

        {/* Navigation links */}
        <a href="/home" onClick={handleHome} style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </a>

        <a href="/about" onClick={go('/about')} style={{ textDecoration: 'none', color: 'inherit' }}>
          About Us
        </a>

        <a href="/contact" onClick={go('/contact')} style={{ textDecoration: 'none', color: 'inherit' }}>
          Contact Us
        </a>

        {/* Dashboard (role-aware) */}
        <a href="/dashboard" onClick={handleDashboard} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </a>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#666' }}>{user.email}</span>
            <button
              className="btn"
              onClick={() => {
                if (typeof onLogout === 'function') onLogout();
                else navigate('/login');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button className="btn" onClick={go('/login')}>Login</button>
        )}
      </div>
    </header>
  );
}
