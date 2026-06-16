import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error states

    try {
      const response = await fetch('https://task-manager-9glc.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Direct safe rerouting to login
        navigate('/login');
      } else {
        setError(data.message || 'Registration structural failed. User might exist.');
      }
    } catch (err) {
      console.error("Register Error:", err);
      setError('Something went wrong. Network/Server error!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '15px' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account 🚀</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Start managing your tasks today</p>
        
        {error && (
          <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #f87171', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Name</label>
            <input 
              type="text" 
              required 
              value={name}
              placeholder="Your Name"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              placeholder="name@email.com"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Create Account →
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;