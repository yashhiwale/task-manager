import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || { name: 'No name set', email: 'p@gmail.com', avatar: '' };
    setUser(savedUser);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ text: 'Please select a photo first', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const token = localStorage.getItem('token');
      // NOTE: Do NOT add 'Content-Type' header when sending FormData
      const response = await fetch('https://task-manager-9glc.onrender.com/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Upload successful!', type: 'success' });
        const updatedUser = { ...user, avatar: data.user.avatar };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSelectedFile(null);
      } else {
        setMessage({ text: data.error || data.message || 'Upload failed. Try again!', type: 'error' });
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      setMessage({ text: 'Upload failed. network error!', type: 'error' });
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <h2>Profile 👤</h2>
      <p style={{ color: '#94a3b8' }}>Manage your account</p>

      {message.text && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: message.type === 'error' ? '#7f1d1d' : '#064e3b',
          border: `1px solid ${message.type === 'error' ? '#f87171' : '#34d399'}`,
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '8px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px' }}>
          <img
            src={previewUrl || user.avatar || 'https://via.placeholder.com/100?text=?'}
            alt="Avatar"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
          />
        </div>
        
        <h3>{user.name}</h3>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{user.email}</p>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            id="avatar-input"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="avatar-input"
            style={{ display: 'block', padding: '8px', backgroundColor: '#334155', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}
          >
            Choose New Photo
          </label>
          {selectedFile && (
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Upload Photo
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;