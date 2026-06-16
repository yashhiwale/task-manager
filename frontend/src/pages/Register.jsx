import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://task-manager-9glc.onrender.com'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, { name, email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Something went wrong. Try again!')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px', color: '#f1f5f9' }}>Create Account 🚀</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>Start managing your tasks today</p>

        {error && (
          <div style={{ background: '#450a0a', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <input
          type="text" placeholder="Full Name" value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
        />
        <input
          type="email" placeholder="Email address" value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          style={{ width: '100%', marginBottom: '20px', display: 'block', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
        />

        <button onClick={handleRegister} style={{ width: '100%', background: '#6366f1', color: 'white', fontSize: '16px', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          Create Account →
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register