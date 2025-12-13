// src/services/tokenService.js

import { ROLE_SEEKER, ROLE_RECRUITER } from "../utils/roles";

/**
 * Normalize backend role to frontend role
 */
const normalizeRole = (role) => {
  if (!role) return null;

  // backend → frontend mapping
  if (role === "jobseeker") return ROLE_SEEKER;
  if (role === "employer") return ROLE_RECRUITER;

  // already correct
  if (role === ROLE_SEEKER || role === ROLE_RECRUITER) return role;

  return null;
};

export const saveAuth = (token, user) => {
  const normalizedUser = {
    ...user,
    role: normalizeRole(user.role),
  };

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(normalizedUser));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
