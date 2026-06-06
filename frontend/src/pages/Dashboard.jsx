import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://task-manager-9glc.onrender.com'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [activeTab, setActiveTab] = useState('tasks')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

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
    { title, priority, dueDate: dueDate || null },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  setTitle('')
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

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const priorityColors = {
    high: { bg: '#450a0a', color: '#fca5a5', dot: '#ef4444' },
    medium: { bg: '#431407', color: '#fdba74', dot: '#f97316' },
    low: { bg: '#052e16', color: '#86efac', dot: '#22c55e' }
  }

  const filteredTasks = tasks
    .filter(t => filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.filter(t => !t.completed).length
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{
        width: '220px', background: '#1e293b', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        borderRight: '1px solid #334155', minHeight: '100vh'
      }}>
        <h2 style={{ color: '#6366f1', fontSize: '20px', fontWeight: '700', marginBottom: '24px', paddingLeft: '8px' }}>
          📋 TaskManager
        </h2>

        {[
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'tasks', icon: '✅', label: 'My Tasks' },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px', border: 'none',
            background: activeTab === item.id ? '#6366f1' : 'transparent',
            color: activeTab === item.id ? 'white' : '#94a3b8',
            cursor: 'pointer', fontSize: '14px', fontWeight: '500',
            textAlign: 'left'
          }}>
            {item.icon} {item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px', border: 'none',
            background: 'transparent', color: '#ef4444',
            cursor: 'pointer', fontSize: '14px', width: '100%'
          }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
              Dashboard 📊
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Your task overview</p>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              {[
                { label: 'Total Tasks', value: tasks.length, icon: '📋', color: '#6366f1', bg: '#1e1b4b' },
                { label: 'Completed', value: completed, icon: '✅', color: '#22c55e', bg: '#052e16' },
                { label: 'Pending', value: pending, icon: '⏳', color: '#f97316', bg: '#431407' },
                { label: 'High Priority', value: highPriority, icon: '🔴', color: '#ef4444', bg: '#450a0a' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: stat.bg, borderRadius: '16px', padding: '20px',
                  border: `1px solid ${stat.color}33`
                }}>
                  <p style={{ fontSize: '28px', marginBottom: '4px' }}>{stat.icon}</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Completion Rate */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ color: '#f1f5f9', fontWeight: '600' }}>Overall Completion</p>
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
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px' }}>
              <p style={{ color: '#f1f5f9', fontWeight: '600', marginBottom: '16px' }}>Priority Breakdown</p>
              {['high', 'medium', 'low'].map(p => {
                const count = tasks.filter(t => t.priority === p).length
                const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0
                return (
                  <div key={p} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: priorityColors[p].color, fontSize: '13px', textTransform: 'capitalize' }}>
                        {p} priority
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{count} tasks</span>
                    </div>
                    <div style={{ background: '#334155', borderRadius: '99px', height: '6px' }}>
                      <div style={{
                        background: priorityColors[p].dot, height: '6px',
                        borderRadius: '99px', width: `${pct}%`
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
              My Tasks ✅
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{completed}/{tasks.length} completed</p>

            {/* Progress Bar */}
            <div style={{ background: '#1e293b', borderRadius: '99px', height: '8px', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                height: '8px', borderRadius: '99px',
                width: tasks.length ? `${(completed / tasks.length) * 100}%` : '0%',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {/* Add Task */}
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text" placeholder="Add a new task..."
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ minWidth: '120px' }}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟠 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', borderRadius: '8px' }}
                />
                <button onClick={addTask} style={{
                  background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px', border: 'none', cursor: 'pointer'
                }}>+ Add</button>
              </div>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <input
                type="text" placeholder="🔍 Search tasks..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: '180px' }}
              />
              {['all', 'pending', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#6366f1' : '#1e293b',
                  color: filter === f ? 'white' : '#94a3b8',
                  borderRadius: '8px', padding: '10px 16px', textTransform: 'capitalize'
                }}>{f}</button>
              ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#475569', background: '#1e293b', borderRadius: '16px' }}>
                <p style={{ fontSize: '40px' }}>📭</p>
                <p style={{ marginTop: '10px' }}>No tasks found!</p>
              </div>
            )}

            {filteredTasks.map(task => (
              <div key={task._id} style={{
                background: '#1e293b', borderRadius: '12px', padding: '16px 20px',
                marginBottom: '12px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', borderLeft: `4px solid ${priorityColors[task.priority].dot}`,
                opacity: task.completed ? 0.6 : 1
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '16px', color: '#f1f5f9',
                    textDecoration: task.completed ? 'line-through' : 'none', marginBottom: '6px'
                  }}>
                    {task.title}
                  </p>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                    background: priorityColors[task.priority].bg,
                    color: priorityColors[task.priority].color,
                    fontWeight: '600', textTransform: 'uppercase'
                  }}>{task.priority}</span>
                  {task.dueDate && (
  <span style={{
    fontSize: '11px', marginLeft: '8px',
    color: new Date(task.dueDate) < new Date() && !task.completed ? '#fca5a5' : '#94a3b8'
  }}>
    📅 {new Date(task.dueDate).toLocaleDateString()}
    {new Date(task.dueDate) < new Date() && !task.completed && ' ⚠️ Overdue'}
  </span>
)}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button onClick={() => toggleTask(task._id, task.completed)} style={{
                    background: task.completed ? '#334155' : '#22c55e',
                    color: 'white', borderRadius: '8px', padding: '8px 14px', fontSize: '13px'
                  }}>{task.completed ? 'Undo' : '✓ Done'}</button>
                  <button onClick={() => deleteTask(task._id)} style={{
                    background: '#ef4444', color: 'white',
                    borderRadius: '8px', padding: '8px 14px', fontSize: '13px'
                  }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard