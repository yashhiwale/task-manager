import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://task-manager-9glc.onrender.com'

function Profile({ setToken }) {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' })
  const [newName, setNewName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setMessage('')
    setError('')
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await axios.post(`${API}/api/auth/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setUser(res.data)
      setMessage('Profile picture updated! ✅')
    } catch (err) {
      setError('Upload failed. Check file size/format.')
    }
    setUploading(false)
  }

  const updateName = async () => {
    try {
      await axios.put(`${API}/api/auth/profile`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser({ ...user, name: newName })
      setMessage('Name updated! ✅')
      setError('')
    } catch {
      setError('Failed to update name')
    }
  }

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) return setError('Fill both password fields')
    try {
      await axios.put(`${API}/api/auth/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Password updated! ✅')
      setError('')
      setCurrentPassword('')
      setNewPassword('')
    } catch {
      setError('Current password is incorrect')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Profile 👤</h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Manage your account</p>

      {message && (
        <div style={{ background: '#052e16', color: '#86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#450a0a', color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ❌ {error}
        </div>
      )}

      {/* Avatar Card */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
          {user.avatar ? (
            <img src={user.avatar} alt="Profile"
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1' }}
            />
          ) : (
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', margin: '0 auto', border: '3px solid #6366f1', color: 'white', fontWeight: '700'
            }}>
              {user.name ? user.name[0].toUpperCase() : '?'}
            </div>
          )}
          <button onClick={() => fileInputRef.current.click()} style={{
            position: 'absolute', bottom: '0', right: '0',
            background: '#6366f1', border: 'none', borderRadius: '50%',
            width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px'
          }}>📷</button>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />

        {uploading && <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Uploading... ⏳</p>}

        <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600' }}>{user.name || 'No name set'}</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{user.email}</p>

        <button onClick={() => fileInputRef.current.click()} style={{
          background: 'transparent', border: '1px solid #6366f1',
          color: '#6366f1', borderRadius: '8px', padding: '8px 16px',
          cursor: 'pointer', fontSize: '13px'
        }}>
          📷 Change Photo
        </button>
      </div>

      {/* Update Name */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>✏️ Update Name</h3>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
        />
        <button onClick={updateName} style={{ background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Update Name
        </button>
      </div>

      {/* Change Password */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>🔐 Change Password</h3>
        <input type="password" placeholder="Current Password" value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
        />
        <input type="password" placeholder="New Password" value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', display: 'block', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
        />
        <button onClick={updatePassword} style={{ background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Update Password
        </button>
      </div>

      {/* Logout */}
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '8px', fontSize: '16px' }}>🚪 Logout</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>Sign out of your account</p>
        <button onClick={logout} style={{ background: '#ef4444', color: 'white', borderRadius: '8px', padding: '10px 20px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile