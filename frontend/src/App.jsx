import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks'; // Ya fir jo bhi aapki file ka naam tasks ke liye hai
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Ek common Layout component jo pages ke sath navigation show karega
const NavigationLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tasks', label: 'My Tasks', icon: '✅' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar Navigation Matrix */}
      <div style={{ width: '240px', backgroundColor: '#1e293b', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366f1', marginBottom: '30px' }}>
          📝 TaskManager
        </div>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 15px',
                  color: isActive ? '#fff' : '#94a3b8',
                  backgroundColor: isActive ? '#6366f1' : 'transparent',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  marginBottom: '10px',
                  fontWeight: isActive ? '600' : 'normal'
                }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, backgroundColor: '#0f172a' }}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes without Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core Protected Routes wrapped with Navigation Layout */}
        <Route path="/dashboard" element={<NavigationLayout><Dashboard /></NavigationLayout>} />
        <Route path="/tasks" element={<NavigationLayout><MyTasks /></NavigationLayout>} />
        <Route path="/profile" element={<NavigationLayout><Profile /></NavigationLayout>} />

        {/* Default Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;