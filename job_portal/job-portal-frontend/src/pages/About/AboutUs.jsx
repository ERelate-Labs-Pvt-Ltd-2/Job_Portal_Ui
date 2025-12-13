
import React from "react";
import Header from "../../components/Header";

export default function AboutUs() {
  return (
    <div>
      <Header />

      <div className="container">
        <div className="card">
          <h2>About Us</h2>

          <p style={{ lineHeight: "1.6", marginTop: 10 }}>
            Welcome to <strong>JobPortal</strong>, a modern hiring and recruitment platform
            built to connect talented job seekers with trusted employers.
          </p>

          <p style={{ lineHeight: "1.6", marginTop: 10 }}>
            Our mission is simple — make job searching and hiring smooth, fast, and effective.
            Whether you're a job seeker trying to find the right career path or a recruiter
            searching for skilled candidates, JobPortal is here to serve everyone.
          </p>

          <h3 style={{ marginTop: 24 }}>Our Vision</h3>
          <p style={{ lineHeight: "1.6" }}>
            To become the most reliable and user-friendly digital platform that connects
            millions of people with life-changing opportunities.
          </p>

          <h3 style={{ marginTop: 24 }}>Our Core Values</h3>
          <ul style={{ lineHeight: "1.8", marginTop: 10 }}>
            <li>✨ Transparency in the hiring process</li>
            <li>✨ Equal opportunities for all job seekers</li>
            <li>✨ Smart, fast, and intuitive job matching</li>
            <li>✨ Support for both recruiters and applicants</li>
          </ul>

          <p style={{ marginTop: 20, lineHeight: "1.6" }}>
            Thank you for choosing JobPortal. We’re here to help build your future!
          </p>
        </div>
      </div>
    </div>
  );
}
