import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://task-manager-9glc.onrender.com'

function Profile() {
  const [user, setUser] = useState({ name: '', email: '' })
  const [newName, setNewName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data)
        setNewName(res.data.name)
      } catch {
        navigate('/login')
      }
    }
    fetchProfile()
  }, [])

  const updateName = async () => {
    try {
      await axios.put(`${API}/api/auth/profile`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser({ ...user, name: newName })
      setMessage('Name updated successfully!')
      setError('')
    } catch {
      setError('Failed to update name')
    }
  }

  const updatePassword = async () => {
    try {
      await axios.put(`${API}/api/auth/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Password updated successfully!')
      setError('')
      setCurrentPassword('')
      setNewPassword('')
    } catch {
      setError('Current password is incorrect')
    }
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
        Profile 👤
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Manage your account</p>

      {message && (
        <div style={{ background: '#052e16', color: '#86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ✅ {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#450a0a', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ❌ {error}
        </div>
      )}

      {/* Avatar */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', margin: '0 auto 16px'
        }}>
          {user.name ? user.name[0].toUpperCase() : '?'}
        </div>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600' }}>{user.name}</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>{user.email}</p>
      </div>

      {/* Update Name */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>✏️ Update Name</h3>
        <input
          type="text" value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block' }}
        />
        <button onClick={updateName} style={{
          background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px'
        }}>
          Update Name
        </button>
      </div>

      {/* Update Password */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>🔐 Change Password</h3>
        <input
          type="password" placeholder="Current Password"
          value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block' }}
        />
        <input
          type="password" placeholder="New Password"
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block' }}
        />
        <button onClick={updatePassword} style={{
          background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px'
        }}>
          Update Password
        </button>
      </div>
    </div>
  )
}

export default Profile