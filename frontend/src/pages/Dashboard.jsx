import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Profile from './Profile'

const API = 'https://task-manager-9glc.onrender.com'

function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('work')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const [notifiedTasks, setNotifiedTasks] = useState(new Set())
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const requestNotifPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(res.data)
    } catch {
      navigate('/login')
    }
  }

  useEffect(() => { fetchTasks() }, [])

  // ===== DUE DATE NOTIFICATIONS =====
  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const now = new Date()
    tasks.forEach(task => {
      if (task.completed || !task.dueDate) return
      if (notifiedTasks.has(task._id)) return
      const due = new Date(task.dueDate)
      const diffHours = (due - now) / (1000 * 60 * 60)
      if (diffHours <= 24) {
        const isOverdue = diffHours < 0
        try {
          new Notification(isOverdue ? '⚠️ Task Overdue!' : '⏰ Task Due Soon!', {
            body: `"${task.title}" ${isOverdue ? 'was due on' : 'is due on'} ${due.toLocaleDateString()}`
          })
        } catch {}
        setNotifiedTasks(prev => new Set(prev).add(task._id))
      }
    })
  }, [tasks])

  const addTask = async () => {
    if (!title.trim()) return
    await axios.post(`${API}/api/tasks`,
      { title, description, priority, category, dueDate: dueDate || null },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setTitle('')
    setDescription('')
    setDueDate('')
    fetchTasks()
  }

  const toggleTask = async (id, completed) => {
    await axios.put(`${API}/api/tasks/${id}`,
      { completed: !completed },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`${API}/api/tasks/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchTasks()
  }

  // ===== THEME COLORS =====
  const colors = isDark ? {
    bg: '#0f172a', sidebarBg: '#1e293b', cardBg: '#1e293b',
    border: '#334155', text: '#f1f5f9', textMuted: '#94a3b8',
    inputBg: '#0f172a', inputBorder: '#334155', navInactive: '#94a3b8',
    progressTrack: '#334155'
  } : {
    bg: '#f1f5f9', sidebarBg: '#ffffff', cardBg: '#ffffff',
    border: '#e2e8f0', text: '#0f172a', textMuted: '#64748b',
    inputBg: '#f8fafc', inputBorder: '#cbd5e1', navInactive: '#64748b',
    progressTrack: '#e2e8f0'
  }

  const priorityColors = isDark ? {
    high: { bg: '#450a0a', color: '#fca5a5', dot: '#ef4444' },
    medium: { bg: '#431407', color: '#fdba74', dot: '#f97316' },
    low: { bg: '#052e16', color: '#86efac', dot: '#22c55e' }
  } : {
    high: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
    medium: { bg: '#ffedd5', color: '#c2410c', dot: '#f97316' },
    low: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' }
  }

  const categoryConfig = isDark ? {
    work: { icon: '💼', color: '#93c5fd', bg: '#1e3a5f', label: 'Work' },
    personal: { icon: '🏠', color: '#d8b4fe', bg: '#3b1e54', label: 'Personal' },
    study: { icon: '📚', color: '#5eead4', bg: '#134e4a', label: 'Study' },
    other: { icon: '📌', color: '#cbd5e1', bg: '#334155', label: 'Other' }
  } : {
    work: { icon: '💼', color: '#1d4ed8', bg: '#dbeafe', label: 'Work' },
    personal: { icon: '🏠', color: '#7e22ce', bg: '#f3e8ff', label: 'Personal' },
    study: { icon: '📚', color: '#0f766e', bg: '#ccfbf1', label: 'Study' },
    other: { icon: '📌', color: '#475569', bg: '#f1f5f9', label: 'Other' }
  }

  const statCardStyles = isDark ? [
    { bg: '#1e1b4b', accent: '#6366f1' },
    { bg: '#052e16', accent: '#22c55e' },
    { bg: '#431407', accent: '#f97316' },
    { bg: '#450a0a', accent: '#ef4444' }
  ] : [
    { bg: '#eef2ff', accent: '#4f46e5' },
    { bg: '#f0fdf4', accent: '#16a34a' },
    { bg: '#fff7ed', accent: '#ea580c' },
    { bg: '#fef2f2', accent: '#dc2626' }
  ]

  const filteredTasks = tasks
    .filter(t => filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed)
    .filter(t => categoryFilter === 'all' ? true : t.category === categoryFilter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.filter(t => !t.completed).length
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'tasks', icon: '✅', label: 'My Tasks' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]

  // ===== CHART DATA =====
  const priorityChartData = ['high', 'medium', 'low']
    .map(p => ({ name: p.charAt(0).toUpperCase() + p.slice(1), value: tasks.filter(t => t.priority === p).length, color: priorityColors[p].dot }))
    .filter(d => d.value > 0)

  const categoryChartData = Object.keys(categoryConfig)
    .map(c => ({ name: categoryConfig[c].label, value: tasks.filter(t => t.category === c).length, color: categoryConfig[c].color }))
    .filter(d => d.value > 0)

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', flexDirection: isMobile ? 'column' : 'row', transition: 'background 0.2s ease' }}>

      {/* Sidebar / Top Bar */}
      <div style={{
        width: isMobile ? '100%' : '220px',
        background: colors.sidebarBg,
        padding: isMobile ? '14px 10px' : '24px 16px',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: isMobile ? '6px' : '8px',
        borderRight: isMobile ? 'none' : `1px solid ${colors.border}`,
        borderBottom: isMobile ? `1px solid ${colors.border}` : 'none',
        minHeight: isMobile ? 'auto' : '100vh',
        position: isMobile ? 'sticky' : 'static',
        top: 0, zIndex: 10,
        alignItems: isMobile ? 'center' : 'stretch',
        justifyContent: isMobile ? 'space-between' : 'flex-start'
      }}>
        {!isMobile && (
          <h2 style={{ color: '#6366f1', fontSize: '20px', fontWeight: '700', marginBottom: '24px', paddingLeft: '8px' }}>
            📋 TaskManager
          </h2>
        )}

        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '2px' : '10px',
            padding: isMobile ? '8px 6px' : '10px 14px',
            borderRadius: '10px', border: 'none',
            background: activeTab === item.id ? '#6366f1' : 'transparent',
            color: activeTab === item.id ? 'white' : colors.navInactive,
            cursor: 'pointer',
            fontSize: isMobile ? '11px' : '14px',
            fontWeight: '500',
            textAlign: 'center',
            width: isMobile ? 'auto' : '100%',
            flex: isMobile ? 1 : 'none'
          }}>
            <span style={{ fontSize: isMobile ? '18px' : '16px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '2px' : '10px',
          padding: isMobile ? '8px 6px' : '10px 14px',
          borderRadius: '10px', border: `1px solid ${colors.border}`,
          background: 'transparent',
          color: colors.navInactive,
          cursor: 'pointer',
          fontSize: isMobile ? '11px' : '14px',
          fontWeight: '500',
          textAlign: 'center',
          width: isMobile ? 'auto' : '100%',
          flex: isMobile ? 1 : 'none',
          marginTop: isMobile ? '0' : '12px'
        }}>
          <span style={{ fontSize: isMobile ? '18px' : '16px' }}>{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light' : 'Dark'}
        </button>

        {/* Notification Toggle */}
        {notifPermission !== 'unsupported' && (
          <button onClick={requestNotifPermission} disabled={notifPermission === 'granted'} style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '2px' : '10px',
            padding: isMobile ? '8px 6px' : '10px 14px',
            borderRadius: '10px', border: `1px solid ${colors.border}`,
            background: 'transparent',
            color: notifPermission === 'granted' ? '#22c55e' : colors.navInactive,
            cursor: notifPermission === 'granted' ? 'default' : 'pointer',
            fontSize: isMobile ? '11px' : '14px',
            fontWeight: '500',
            textAlign: 'center',
            width: isMobile ? 'auto' : '100%',
            flex: isMobile ? 1 : 'none',
            marginTop: isMobile ? '0' : '8px'
          }}>
            <span style={{ fontSize: isMobile ? '18px' : '16px' }}>{notifPermission === 'granted' ? '🔔' : '🔕'}</span>
            {notifPermission === 'granted' ? 'Alerts On' : 'Enable Alerts'}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: isMobile ? '16px' : '30px', overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>Dashboard 📊</h1>
            <p style={{ color: colors.textMuted, marginBottom: isMobile ? '20px' : '30px', fontSize: '14px' }}>Your task overview</p>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: isMobile ? '10px' : '16px', marginBottom: isMobile ? '20px' : '30px' }}>
              {[
                { label: 'Total Tasks', value: tasks.length, icon: '📋' },
                { label: 'Completed', value: completed, icon: '✅' },
                { label: 'Pending', value: pending, icon: '⏳' },
                { label: 'High Priority', value: highPriority, icon: '🔴' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ background: statCardStyles[i].bg, borderRadius: '16px', padding: isMobile ? '14px' : '20px', border: `1px solid ${statCardStyles[i].accent}33` }}>
                  <p style={{ fontSize: isMobile ? '22px' : '28px', marginBottom: '4px' }}>{stat.icon}</p>
                  <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: statCardStyles[i].accent }}>{stat.value}</p>
                  <p style={{ color: colors.textMuted, fontSize: '12px' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Completion Rate */}
            <div style={{ background: colors.cardBg, borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ color: colors.text, fontWeight: '600', fontSize: isMobile ? '14px' : '16px' }}>Overall Completion</p>
                <p style={{ color: '#6366f1', fontWeight: '700' }}>{completionRate}%</p>
              </div>
              <div style={{ background: colors.progressTrack, borderRadius: '99px', height: '10px' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  height: '10px', borderRadius: '99px',
                  width: `${completionRate}%`, transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1, background: colors.cardBg, borderRadius: '16px', padding: isMobile ? '16px' : '24px', border: `1px solid ${colors.border}` }}>
                <p style={{ color: colors.text, fontWeight: '600', marginBottom: '8px', fontSize: isMobile ? '14px' : '16px' }}>Priority Distribution</p>
                {priorityChartData.length === 0 ? (
                  <p style={{ color: colors.textMuted, fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No tasks yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={priorityChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                        {priorityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.text }} />
                      <Legend formatter={(value) => <span style={{ color: colors.textMuted, fontSize: '12px' }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div style={{ flex: 1, background: colors.cardBg, borderRadius: '16px', padding: isMobile ? '16px' : '24px', border: `1px solid ${colors.border}` }}>
                <p style={{ color: colors.text, fontWeight: '600', marginBottom: '8px', fontSize: isMobile ? '14px' : '16px' }}>Category Distribution</p>
                {categoryChartData.length === 0 ? (
                  <p style={{ color: colors.textMuted, fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No tasks yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.text }} />
                      <Legend formatter={(value) => <span style={{ color: colors.textMuted, fontSize: '12px' }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Priority Breakdown */}
            <div style={{ background: colors.cardBg, borderRadius: '16px', padding: isMobile ? '16px' : '24px', border: `1px solid ${colors.border}` }}>
              <p style={{ color: colors.text, fontWeight: '600', marginBottom: '16px', fontSize: isMobile ? '14px' : '16px' }}>Priority Breakdown</p>
              {['high', 'medium', 'low'].map(p => {
                const count = tasks.filter(t => t.priority === p).length
                const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0
                return (
                  <div key={p} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: priorityColors[p].dot, fontSize: '13px', textTransform: 'capitalize' }}>{p} priority</span>
                      <span style={{ color: colors.textMuted, fontSize: '13px' }}>{count} tasks</span>
                    </div>
                    <div style={{ background: colors.progressTrack, borderRadius: '99px', height: '6px' }}>
                      <div style={{ background: priorityColors[p].dot, height: '6px', borderRadius: '99px', width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div>
            <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>My Tasks ✅</h1>
            <p style={{ color: colors.textMuted, marginBottom: isMobile ? '16px' : '24px', fontSize: '14px' }}>{completed}/{tasks.length} completed</p>

            {/* Progress Bar */}
            <div style={{ background: colors.progressTrack, borderRadius: '99px', height: '8px', marginBottom: isMobile ? '16px' : '24px' }}>
              <div style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                height: '8px', borderRadius: '99px',
                width: tasks.length ? `${(completed / tasks.length) * 100}%` : '0%',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {/* Add Task */}
            <div style={{ background: colors.cardBg, padding: isMobile ? '14px' : '20px', borderRadius: '16px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text" placeholder="Add a new task..."
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  style={{ flex: 1, width: isMobile ? '100%' : 'auto', minWidth: isMobile ? 'auto' : '200px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.text, padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}
                    style={{ flex: isMobile ? 1 : 'none', minWidth: isMobile ? '0' : '110px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.text, padding: '10px', borderRadius: '8px' }}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟠 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{ flex: isMobile ? 1 : 'none', minWidth: isMobile ? '0' : '110px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.text, padding: '10px', borderRadius: '8px' }}>
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="study">📚 Study</option>
                    <option value="other">📌 Other</option>
                  </select>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    style={{ flex: isMobile ? 1 : 'none', padding: '10px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.text, borderRadius: '8px', minWidth: isMobile ? '0' : 'auto' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px' }}>
                <textarea
                  placeholder="Add a description (optional)..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    flex: 1, width: isMobile ? '100%' : 'auto', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`,
                    color: colors.text, padding: '10px 14px', borderRadius: '8px',
                    fontFamily: 'inherit', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box'
                  }}
                />
                <button onClick={addTask} style={{ background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px', border: 'none', cursor: 'pointer', alignSelf: isMobile ? 'stretch' : 'flex-start' }}>
                  + Add
                </button>
              </div>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <input type="text" placeholder="🔍 Search tasks..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: isMobile ? '100%' : '180px', background: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.text, padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box' }}
              />
              {['all', 'pending', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#6366f1' : colors.cardBg,
                  color: filter === f ? 'white' : colors.textMuted,
                  borderRadius: '8px', padding: '10px 16px', border: filter === f ? 'none' : `1px solid ${colors.border}`, cursor: 'pointer', textTransform: 'capitalize',
                  flex: isMobile ? 1 : 'none'
                }}>{f}</button>
              ))}
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', overflowX: isMobile ? 'auto' : 'visible' }}>
              <button onClick={() => setCategoryFilter('all')} style={{
                background: categoryFilter === 'all' ? '#6366f1' : colors.cardBg,
                color: categoryFilter === 'all' ? 'white' : colors.textMuted,
                borderRadius: '8px', padding: '8px 14px', border: categoryFilter === 'all' ? 'none' : `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'
              }}>All Categories</button>
              {Object.keys(categoryConfig).map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} style={{
                  background: categoryFilter === c ? categoryConfig[c].bg : colors.cardBg,
                  color: categoryFilter === c ? categoryConfig[c].color : colors.textMuted,
                  borderRadius: '8px', padding: '8px 14px', border: categoryFilter === c ? `1px solid ${categoryConfig[c].color}` : `1px solid ${colors.border}`,
                  cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'
                }}>{categoryConfig[c].icon} {categoryConfig[c].label}</button>
              ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textMuted, background: colors.cardBg, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '40px' }}>📭</p>
                <p style={{ marginTop: '10px' }}>No tasks found!</p>
              </div>
            )}

            {filteredTasks.map(task => (
              <div key={task._id} style={{
                background: colors.cardBg, borderRadius: '12px', padding: isMobile ? '14px 16px' : '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'flex-start',
                gap: isMobile ? '12px' : '0',
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${priorityColors[task.priority].dot}`,
                opacity: task.completed ? 0.6 : 1
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', color: colors.text, textDecoration: task.completed ? 'line-through' : 'none', marginBottom: '6px', wordBreak: 'break-word' }}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '8px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                      background: priorityColors[task.priority].bg,
                      color: priorityColors[task.priority].color,
                      fontWeight: '600', textTransform: 'uppercase'
                    }}>{task.priority}</span>
                    {task.category && categoryConfig[task.category] && (
                      <span style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                        background: categoryConfig[task.category].bg,
                        color: categoryConfig[task.category].color,
                        fontWeight: '600'
                      }}>{categoryConfig[task.category].icon} {categoryConfig[task.category].label}</span>
                    )}
                    {task.dueDate && (
                      <span style={{ fontSize: '11px', color: new Date(task.dueDate) < new Date() && !task.completed ? '#ef4444' : colors.textMuted }}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                        {new Date(task.dueDate) < new Date() && !task.completed && ' ⚠️ Overdue'}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: isMobile ? '0' : '16px' }}>
                  <button onClick={() => toggleTask(task._id, task.completed)} style={{
                    background: task.completed ? colors.border : '#22c55e',
                    color: 'white', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', border: 'none', cursor: 'pointer',
                    flex: isMobile ? 1 : 'none'
                  }}>{task.completed ? 'Undo' : '✓ Done'}</button>
                  <button onClick={() => deleteTask(task._id)} style={{
                    background: '#ef4444', color: 'white', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', border: 'none', cursor: 'pointer',
                    flex: isMobile ? 1 : 'none'
                  }}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && <Profile setToken={setToken} theme={theme} />}

      </div>
    </div>
  )
}

export default Dashboard