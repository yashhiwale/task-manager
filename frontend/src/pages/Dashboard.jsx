import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });

  useEffect(() => {
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

  const cardStyle = {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ padding: '30px', color: '#fff' }}>
      <h2>Dashboard 📊</h2>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Real-time overview of your tasks metrics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h3 style={{ color: '#94a3b8', fontSize: '14px' }}>Total Tasks</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0' }}>{stats.total}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#34d399', fontSize: '14px' }}>Completed</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0', color: '#34d399' }}>{stats.completed}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#f59e0b', fontSize: '14px' }}>Pending</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0', color: '#f59e0b' }}>{stats.pending}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#f87171', fontSize: '14px' }}>High Priority</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0', color: '#f87171' }}>{stats.highPriority}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;