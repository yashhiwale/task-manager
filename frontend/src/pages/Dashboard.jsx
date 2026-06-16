import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [user, setUser] = useState({ name: '' });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || { name: 'User' };
    setUser(savedUser);

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://task-manager-9glc.onrender.com/api/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          const completed = data.filter(t => t.completed).length;
          const pending = data.filter(t => !t.completed).length;
          const highPriority = data.filter(t => t.priority === 'High' || t.priority === 'high').length;
          setStats({ total: data.length, completed, pending, highPriority });
        }
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const sidebarLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    color: window.location.pathname === path ? '#fff' : '#94a3b8',
    backgroundColor: window.location.pathname === path ? '#6366f1' : 'transparent',
    borderRadius: '6px',
    textDecoration: 'none',
    marginBottom: '10px',
    fontWeight: window.location.pathname === path ? '600' : 'normal'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      {/* Sidebar - No Logout Button Here */}
      <div style={{ width: '240px', backgroundColor: '#1e293b', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366f1', marginBottom: '30px' }}>
          📝 TaskManager
        </div>
        <nav style={{ flex: 1 }}>
          <Link to="/dashboard" style={sidebarLinkStyle('/dashboard')}><span>📊 Dashboard</span></Link>
          <Link to="/dashboard" style={sidebarLinkStyle('/tasks')}><span>✅ My Tasks</span></Link>
          <Link to="/profile" style={sidebarLinkStyle('/profile')}><span>👤 Profile</span></Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        <h2>Welcome back, {user.name}! 👋</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Real-time overview of your tasks metrics</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '14px' }}>Total Tasks</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0' }}>{stats.total}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#34d399', fontSize: '14px' }}>Completed</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0', color: '#34d399' }}>{stats.completed}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '14px' }}>Pending</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0', color: '#f59e0b' }}>{stats.pending}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#f87171', fontSize: '14px' }}>High Priority</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0', color: '#f87171' }}>{stats.highPriority}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;