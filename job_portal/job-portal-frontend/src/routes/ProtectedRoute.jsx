import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../services/tokenService';

/**
 * ProtectedRoute
 *
 * - If not logged in -> /login
 * - If role mismatch -> redirect to correct dashboard
 */
export default function ProtectedRoute({ children, role }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === 'seeker') {
      return <Navigate to="/seeker/dashboard" replace />;
    }
    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
