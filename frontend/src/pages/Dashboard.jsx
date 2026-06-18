import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const priorityColors = {
    high: { bg: '#450a0a', color: '#fca5a5', dot: '#ef4444' },
    medium: { bg: '#431407', color: '#fdba74', dot: '#f97316' },
    low: { bg: '#052e16', color: '#86efac', dot: '#22c55e' }
  }

  const categoryConfig = {
    work: { icon: '💼', color: '#93c5fd', bg: '#1e3a5f', label: 'Work' },
    personal: { icon: '🏠', color: '#d8b4fe', bg: '#3b1e54', label: 'Personal' },
    study: { icon: '📚', color: '#5eead4', bg: '#134e4a', label: 'Study' },
    other: { icon: '📌', color: '#cbd5e1', bg: '#334155', label: 'Other' }
  }

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

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

      {/* Sidebar / Top Bar */}
      <div style={{
        width: isMobile ? '100%' : '220px',
        background: '#1e293b',
        padding: isMobile ? '14px 10px' : '24px 16px',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: isMobile ? '6px' : '8px',
        borderRight: isMobile ? 'none' : '1px solid #334155',
        borderBottom: isMobile ? '1px solid #334155' : 'none',
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
            color: activeTab === item.id ? 'white' : '#94a3b8',
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
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: isMobile ? '16px' : '30px', overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Dashboard 📊</h1>
            <p style={{ color: '#94a3b8', marginBottom: isMobile ? '20px' : '30px', fontSize: '14px' }}>Your task overview</p>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: isMobile ? '10px' : '16px', marginBottom: isMobile ? '20px' : '30px' }}>
              {[
                { label: 'Total Tasks', value: tasks.length, icon: '📋', color: '#6366f1', bg: '#1e1b4b' },
                { label: 'Completed', value: completed, icon: '✅', color: '#22c55e', bg: '#052e16' },
                { label: 'Pending', value: pending, icon: '⏳', color: '#f97316', bg: '#431407' },
                { label: 'High Priority', value: highPriority, icon: '🔴', color: '#ef4444', bg: '#450a0a' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: '16px', padding: isMobile ? '14px' : '20px', border: `1px solid ${stat.color}33` }}>
                  <p style={{ fontSize: isMobile ? '22px' : '28px', marginBottom: '4px' }}>{stat.icon}</p>
                  <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Completion Rate */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ color: '#f1f5f9', fontWeight: '600', fontSize: isMobile ? '14px' : '16px' }}>Overall Completion</p>
                <p style={{ color: '#6366f1', fontWeight: '700' }}>{completionRate}%</p>
              </div>
              <div style={{ background: '#334155', borderRadius: '99px', height: '10px' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  height: '10px', borderRadius: '99px',
                  width: `${completionRate}%`, transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Priority Breakdown */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: isMobile ? '16px' : '24px' }}>
              <p style={{ color: '#f1f5f9', fontWeight: '600', marginBottom: '16px', fontSize: isMobile ? '14px' : '16px' }}>Priority Breakdown</p>
              {['high', 'medium', 'low'].map(p => {
                const count = tasks.filter(t => t.priority === p).length
                const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0
                return (
                  <div key={p} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: priorityColors[p].color, fontSize: '13px', textTransform: 'capitalize' }}>{p} priority</span>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{count} tasks</span>
                    </div>
                    <div style={{ background: '#334155', borderRadius: '99px', height: '6px' }}>
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
            <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>My Tasks ✅</h1>
            <p style={{ color: '#94a3b8', marginBottom: isMobile ? '16px' : '24px', fontSize: '14px' }}>{completed}/{tasks.length} completed</p>

            {/* Progress Bar */}
            <div style={{ background: '#1e293b', borderRadius: '99px', height: '8px', marginBottom: isMobile ? '16px' : '24px' }}>
              <div style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                height: '8px', borderRadius: '99px',
                width: tasks.length ? `${(completed / tasks.length) * 100}%` : '0%',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {/* Add Task */}
            <div style={{ background: '#1e293b', padding: isMobile ? '14px' : '20px', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text" placeholder="Add a new task..."
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  style={{ flex: 1, width: isMobile ? '100%' : 'auto', minWidth: isMobile ? 'auto' : '200px', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}
                    style={{ flex: isMobile ? 1 : 'none', minWidth: isMobile ? '0' : '110px', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px', borderRadius: '8px' }}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟠 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{ flex: isMobile ? 1 : 'none', minWidth: isMobile ? '0' : '110px', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '10px', borderRadius: '8px' }}>
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="study">📚 Study</option>
                    <option value="other">📌 Other</option>
                  </select>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    style={{ flex: isMobile ? 1 : 'none', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', borderRadius: '8px', minWidth: isMobile ? '0' : 'auto' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px' }}>
                <textarea
                  placeholder="Add a description (optional)..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    flex: 1, width: isMobile ? '100%' : 'auto', background: '#0f172a', border: '1px solid #334155',
                    color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px',
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
                style={{ flex: 1, minWidth: isMobile ? '100%' : '180px', background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box' }}
              />
              {['all', 'pending', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#6366f1' : '#1e293b',
                  color: filter === f ? 'white' : '#94a3b8',
                  borderRadius: '8px', padding: '10px 16px', border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                  flex: isMobile ? 1 : 'none'
                }}>{f}</button>
              ))}
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', overflowX: isMobile ? 'auto' : 'visible' }}>
              <button onClick={() => setCategoryFilter('all')} style={{
                background: categoryFilter === 'all' ? '#6366f1' : '#1e293b',
                color: categoryFilter === 'all' ? 'white' : '#94a3b8',
                borderRadius: '8px', padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'
              }}>All Categories</button>
              {Object.keys(categoryConfig).map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} style={{
                  background: categoryFilter === c ? categoryConfig[c].bg : '#1e293b',
                  color: categoryFilter === c ? categoryConfig[c].color : '#94a3b8',
                  borderRadius: '8px', padding: '8px 14px', border: categoryFilter === c ? `1px solid ${categoryConfig[c].color}` : 'none',
                  cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'
                }}>{categoryConfig[c].icon} {categoryConfig[c].label}</button>
              ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569', background: '#1e293b', borderRadius: '16px' }}>
                <p style={{ fontSize: '40px' }}>📭</p>
                <p style={{ marginTop: '10px' }}>No tasks found!</p>
              </div>
            )}

            {filteredTasks.map(task => (
              <div key={task._id} style={{
                background: '#1e293b', borderRadius: '12px', padding: isMobile ? '14px 16px' : '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'flex-start',
                gap: isMobile ? '12px' : '0',
                borderLeft: `4px solid ${priorityColors[task.priority].dot}`,
                opacity: task.completed ? 0.6 : 1
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', color: '#f1f5f9', textDecoration: task.completed ? 'line-through' : 'none', marginBottom: '6px', wordBreak: 'break-word' }}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', lineHeight: '1.4', wordBreak: 'break-word' }}>
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
                      <span style={{ fontSize: '11px', color: new Date(task.dueDate) < new Date() && !task.completed ? '#fca5a5' : '#94a3b8' }}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                        {new Date(task.dueDate) < new Date() && !task.completed && ' ⚠️ Overdue'}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: isMobile ? '0' : '16px' }}>
                  <button onClick={() => toggleTask(task._id, task.completed)} style={{
                    background: task.completed ? '#334155' : '#22c55e',
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
        {activeTab === 'profile' && <Profile setToken={setToken} />}

      </div>
    </div>
  )
}

export default Dashboard