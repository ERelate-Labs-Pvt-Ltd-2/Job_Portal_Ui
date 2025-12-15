import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <button className="btn" onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
}
