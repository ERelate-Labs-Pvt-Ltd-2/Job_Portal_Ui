
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/session';

/**
 * ProtectedRoute
 *
 * Props:
 *  - children: React node
 *  - role (optional): 'seeker' | 'recruiter' — if provided, only allow users with that role
 *
 * Behavior:
 *  - If not logged in -> redirect to /login
 *  - If logged in and role prop is provided and user.role !== role:
 *      -> redirect to the user's correct dashboard (/seeker/dashboard or /recruiter/dashboard)
 *  - Otherwise render children
 */
export default function ProtectedRoute({ children, role }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // If the logged-in user has a different role, send them to their dashboard
    if (user.role === 'seeker') return <Navigate to="/seeker/dashboard" replace />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    // fallback
    return <Navigate to="/login" replace />;
  }

  return children;
}
