import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from './pages/Auth/Login';

// Public pages
import JobList from './pages/Jobs/JobList';
import AboutUs from './pages/About/AboutUs';
import ContactUs from './pages/Contact/ContactUs';

// Seeker pages
import SeekerDashboard from './pages/Seeker/SeekerDashboard';
import MyApplications from './pages/Seeker/MyApplications';
import ApplicationStatus from './pages/Seeker/ApplicationStatus';

// Recruiter pages
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import PostJob from './pages/Recruiter/PostJob';
import ViewApplication from './pages/Recruiter/ViewApplication';
import CandidateSearch from './pages/Recruiter/CandidateSearch';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

export default function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Seeker */}
      <Route
        path="/seeker/dashboard"
        element={
          <ProtectedRoute role="seeker">
            <SeekerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/applications"
        element={
          <ProtectedRoute role="seeker">
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/application/:id"
        element={
          <ProtectedRoute role="seeker">
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />

      {/* Recruiter */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/post-job"
        element={
          <ProtectedRoute role="recruiter">
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/job/:id/applicants"
        element={
          <ProtectedRoute role="recruiter">
            <ViewApplication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute role="recruiter">
            <CandidateSearch />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<div style={{ padding: 24 }}>404 — Page not found</div>} />
    </Routes>
  );
}
