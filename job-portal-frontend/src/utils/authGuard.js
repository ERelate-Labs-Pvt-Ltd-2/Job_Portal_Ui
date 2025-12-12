

import { getCurrentUser } from '../services/session';

/**
 * ensureRole
 * @param {'seeker'|'recruiter'} requiredRole - required role for the action
 * @param {Function} navigate - react-router navigate function
 * @param {Object} toast - toast object from useToast()
 * @returns {boolean} true if ok to proceed, false if navigation happened
 */
export function ensureRole(requiredRole, navigate, toast) {
  const user = getCurrentUser();

  if (!user) {
    // Not logged in — ask to login, then redirect to login page
    if (toast && toast.info) toast.info('Please log in to continue');
    navigate('/login');
    return false;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but wrong role
    if (toast && toast.error) toast.error('You are not authorized for this action');
    // Send user to their own dashboard
    if (user.role === 'seeker') navigate('/seeker/dashboard');
    else if (user.role === 'recruiter') navigate('/recruiter/dashboard');
    else navigate('/login');
    return false;
  }

  return true;
}
