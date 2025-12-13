import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../services/tokenService';

/**
 * PublicRoute
 *
 * - If logged in -> redirect to dashboard
 * - Else -> allow access
 */
export default function PublicRoute({ children }) {
  const user = getUser();

  if (user) {
    if (user.role === 'seeker') {
      return <Navigate to="/seeker/dashboard" replace />;
    }
    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
  }

  return children;
}
