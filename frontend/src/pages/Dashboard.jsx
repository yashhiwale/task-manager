import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://task-manager-9glc.onrender.com/api/tasks', {
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
    await axios.post('https://task-manager-9glc.onrender.com/api/tasks',
      { title, priority },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setTitle('')
    fetchTasks()
  }

  const toggleTask = async (id, completed) => {
    await axios.put(`https://task-manager-9glc.onrender.com/api/tasks/${id}`,
      { completed: !completed },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`https://task-manager-9glc.onrender.com/api/tasks/${id}`,
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

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '20px' }}>
      
      {/* Header */}
      <div style={{
        maxWidth: '700px', margin: '0 auto 30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f1f5f9' }}>
            📋 Task Manager
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            {completed}/{tasks.length} tasks completed
          </p>
        </div>
        <button onClick={logout} style={{
          background: '#ef4444', color: 'white', borderRadius: '8px'
        }}>
          Logout
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '700px', margin: '0 auto 24px' }}>
        <div style={{ background: '#1e293b', borderRadius: '99px', height: '8px' }}>
          <div style={{
            background: '#6366f1', height: '8px', borderRadius: '99px',
            width: tasks.length ? `${(completed / tasks.length) * 100}%` : '0%',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Add Task */}
      <div style={{
        maxWidth: '700px', margin: '0 auto 24px',
        background: '#1e293b', padding: '20px', borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Add a new task..."
            value={title} onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}
            style={{ minWidth: '110px' }}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟠 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button onClick={addTask} style={{
            background: '#6366f1', color: 'white', borderRadius: '8px', padding: '10px 20px'
          }}>
            + Add
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{
        maxWidth: '700px', margin: '0 auto 20px',
        display: 'flex', gap: '10px', flexWrap: 'wrap'
      }}>
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
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {filteredTasks.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px', color: '#475569',
            background: '#1e293b', borderRadius: '16px'
          }}>
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
                textDecoration: task.completed ? 'line-through' : 'none',
                marginBottom: '6px'
              }}>
                {task.title}
              </p>
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                background: priorityColors[task.priority].bg,
                color: priorityColors[task.priority].color,
                fontWeight: '600', textTransform: 'uppercase'
              }}>
                {task.priority}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
              <button onClick={() => toggleTask(task._id, task.completed)} style={{
                background: task.completed ? '#334155' : '#22c55e',
                color: 'white', borderRadius: '8px', padding: '8px 14px', fontSize: '13px'
              }}>
                {task.completed ? 'Undo' : '✓ Done'}
              </button>
              <button onClick={() => deleteTask(task._id)} style={{
                background: '#ef4444', color: 'white',
                borderRadius: '8px', padding: '8px 14px', fontSize: '13px'
              }}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard