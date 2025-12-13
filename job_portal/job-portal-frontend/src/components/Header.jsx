import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/tokenService';

export default function Header({ onLogout }) {
  const navigate = useNavigate();
  const user = getUser();

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

  function handleLogout() {
    logout();
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      navigate('/login');
    }
  }

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
        <a href="/" onClick={go(homeTarget())} style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>
          JobPortal
        </a>

        <a href="/about" onClick={go('/about')} style={{ textDecoration: 'none', color: 'inherit' }}>
          About Us
        </a>

        <a href="/contact" onClick={go('/contact')} style={{ textDecoration: 'none', color: 'inherit' }}>
          Contact Us
        </a>

        {user && (
          <a href="/dashboard" onClick={go(homeTarget())} style={{ textDecoration: 'none', color: 'inherit' }}>
            Dashboard
          </a>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#666' }}>{user.email}</span>
            <button className="btn" onClick={handleLogout}>
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
