import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://task-manager-9glc.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        {error && <div style={{ backgroundColor: '#7f1d1d', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Name</label>
            <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Email</label>
            <input type="email" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#94a3b8' }}>Password</label>
            <input type="password" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', color: '#94a3b8' }}>Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none' }}>Login</Link></p>
      </div>
    </div>
  );
};

export default Register;