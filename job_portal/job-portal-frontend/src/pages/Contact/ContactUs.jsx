
import React, { useState } from "react";
import Header from "../../components/Header";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true); // Success message (no backend)
  }

  return (
    <div>
      <Header />

      <div className="container">
        <div className="card">
          <h2>Contact Us</h2>

          <p style={{ lineHeight: "1.6", marginTop: 10 }}>
            Have a question or need support?  
            We're here to help! Please fill out the form below to reach us.
          </p>

          {submitted ? (
            <div style={{ marginTop: 20, fontSize: 16, color: "green" }}>
              Thank you for contacting us! We will get back to you soon.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
              />

              <button type="submit" className="btn">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
