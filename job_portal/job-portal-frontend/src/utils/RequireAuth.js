import { Navigate } from "react-router-dom";
import { getUser } from "../services/tokenService";

/**
 * RequireAuth
 * @param children - protected component
 * @param role - optional: "seeker" | "recruiter"
 */
export default function RequireAuth({ children, role }) {
  const user = getUser();

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
