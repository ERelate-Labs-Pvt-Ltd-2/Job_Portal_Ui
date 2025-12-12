
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarRecruiter() {
  return (
    <div className="card">
      <h4>Recruiter Menu</h4>
      <nav style={{ marginTop: 10 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/recruiter/dashboard" style={({isActive}) => ({ color: isActive ? '#2563eb' : '#111827', textDecoration: 'none' })}>Dashboard</NavLink>
          </li>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/recruiter/post-job" style={({isActive}) => ({ color: isActive ? '#2563eb' : '#111827', textDecoration: 'none' })}>Post Job</NavLink>
          </li>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/recruiter/candidates" style={({isActive}) => ({ color: isActive ? '#2563eb' : '#111827', textDecoration: 'none' })}>Search Candidates</NavLink>
          </li>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/recruiter/job/0/applicants" style={({isActive}) => ({ color: isActive ? '#2563eb' : '#111827', textDecoration: 'none' })}>Applications</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
