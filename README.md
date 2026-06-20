# 📋 TaskManager — Full Stack Task Management App

A full-stack task management web application built with the MERN stack (MongoDB, Express, React, Node.js), featuring authentication, real-time task tracking, data visualization, and a fully responsive dark/light themed UI.

## 🔗 Live Demo

- **Frontend:** [task-manager-rho-lyart-74.vercel.app](https://task-manager-rho-lyart-74.vercel.app)
- **Custom Domain:** taskmanager.is-a.dev *(coming soon)*
- **Backend API:** [task-manager-9glc.onrender.com](https://task-manager-9glc.onrender.com)

## ✨ Features

- 🔐 **Authentication** — Secure JWT-based register/login system with hashed passwords
- ✅ **Task Management** — Full CRUD: create, edit, complete, and delete tasks
- 🏷️ **Categories** — Organize tasks by Work, Personal, Study, or Other
- 🚦 **Priority Levels** — Mark tasks as High, Medium, or Low priority with color coding
- 📅 **Due Dates** — Set deadlines with automatic overdue warnings
- 📝 **Descriptions** — Add detailed notes to any task
- 🔍 **Search & Filter** — Find tasks instantly by title, status, or category
- 📊 **Dashboard Analytics** — Visual stats cards, completion rate, and interactive pie charts (Recharts)
- 🌙 **Dark/Light Mode** — Theme toggle with persistent preference
- 🔔 **Due Date Notifications** — Browser notifications for tasks due within 24 hours
- 🖼️ **Profile Management** — Update name, change password, and upload a profile picture (Cloudinary)
- 📱 **Fully Responsive** — Optimized layout for mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Axios, Recharts
- **Backend:** Node.js, Express, JWT, bcrypt.js
- **Database:** MongoDB Atlas (Mongoose)
- **File Storage:** Cloudinary (profile picture uploads)
- **Deployment:** Vercel (frontend) + Render (backend)

## 📂 Project Structure

```
task-manager/
├── backend/
│   ├── models/          (User & Task schemas)
│   ├── routes/          (Auth & task API routes)
│   ├── cloudinary.js    (Image upload config)
│   └── server.js        (Express app entry point)
└── frontend/
    └── src/
        ├── pages/       (Login, Register, Dashboard, Profile)
        └── App.jsx      (Routing & auth state)
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Authenticate and get JWT |
| GET | `/api/auth/profile` | Get logged-in user's profile |
| PUT | `/api/auth/profile` | Update user name |
| PUT | `/api/auth/password` | Change password |
| POST | `/api/auth/upload-avatar` | Upload profile picture |
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/yashhiwale/task-manager.git

# Backend setup
cd backend
npm install
# Add a .env file with MONGO_URI, JWT_SECRET, CLOUDINARY keys
node server.js

# Frontend setup
cd ../frontend
npm install
npm run dev
```

## 👤 Author

**Yash Hiwale**
BSc IT Student, MIT Cidco
[LinkedIn](https://linkedin.com/in/yash-hiwale) | [GitHub](https://github.com/yashhiwale)

---
⭐ If you found this project useful, consider giving it a star!
