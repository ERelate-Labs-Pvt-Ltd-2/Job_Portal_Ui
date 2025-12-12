
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/session';


export default function PublicRoute({ children }) {
  const user = getCurrentUser();
  if (user) {
    if (user.role === 'seeker') return <Navigate to="/seeker/dashboard" replace />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}
