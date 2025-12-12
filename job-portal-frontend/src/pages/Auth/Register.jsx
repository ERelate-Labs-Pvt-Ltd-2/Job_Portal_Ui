import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCredential, findByEmail } from '../../services/credentials';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    const existing = findByEmail(email);
    if (existing) {
      setError('Email already registered. Please login.');
      return;
    }
    const res = registerCredential({ email, password, role });
    if (res.success) {
      // after register send to login
      navigate('/login');
    } else {
      setError(res.message || 'Registration failed');
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:700, margin:'40px auto', padding:24}}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:12}}>
            <label>Email</label><br />
            <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8}} />
          </div>
          <div style={{marginBottom:12}}>
            <label>Password</label><br />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8}} />
          </div>
          <div style={{marginBottom:12}}>
            <label>Role</label><br />
            <select value={role} onChange={e=>setRole(e.target.value)} style={{width:200,padding:8}}>
              <option value="seeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}

          <div style={{display:'flex', gap:8}}>
            <button className="btn" type="submit">Register</button>
            <Link to="/login"><button type="button" className="btn" style={{background:'#888'}}>Go to Login</button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
