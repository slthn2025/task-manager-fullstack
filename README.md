# 🚀 Task Manager Fullstack App

A modern fullstack Task Management application built using the MERN stack with JWT authentication, protected routes, and a clean responsive UI with Dark Mode support.

---

## 📌 Live Demo

Frontend: https://your-frontend-url.vercel.app  
Backend API: https://your-backend-url.onrender.com

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
- CORS
- Global Error Handling

### Frontend

- React (Vite)
- React Router
- Axios (with Interceptors)
- Tailwind CSS
- Dark Mode (class-based)
- Protected Routes

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Token Authentication
- Protected Dashboard Route
- Auto Logout on 401 (Interceptor)

### 📋 Task Management

- Create Task
- Read Tasks
- Update Task
- Delete Task
- Task Status (Pending, In Progress, Completed)
- Task Statistics Dashboard

### 📊 Dashboard

- Total Tasks Count
- Pending Tasks
- In Progress Tasks
- Completed Tasks
- Clean Stat Cards UI

### 🎨 UI/UX

- Responsive Design
- Dark Mode Support
- Clean Component Structure
- Loading & Error Handling States

---

## 🧠 Architecture

### Backend Structure

backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── index.js

### Frontend Structure

frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── pages/
│ ├── routes/
│ └── App.jsx
└── main.jsx

## ⚙️ Environment Variables

### Backend (.env)

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

### Frontend (.env)

VITE_API_URL=http://localhost:5000/api

### For production:

VITE_API_URL=https://your-backend-url.onrender.com/api

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/your-username/task-manager-fullstack.git
cd task-manager-fullstack

### 2️⃣ Backend Setup

cd backend
npm install
npm run dev

### 3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

Frontend will run on:
http://localhost:5173

Backend will run on:
http://localhost:5000

## 🔐 API Response Format

All API responses follow a consistent structure:
{
"success": true,
"message": "Description message",
"data": {}
}

---

## 📌 Key Learning Outcomes

- Building a RESTful API with Express
- Implementing JWT Authentication
- Structuring scalable backend architecture
- Connecting React frontend to backend securely
- Using Axios Interceptors for token management
- Implementing Dark Mode with Tailwind CSS
- Handling loading & error states professionally

---

## 👨‍💻 Author

Your Name  
Fullstack Developer

---

## 📄 License

This project is for portfolio and educational purposes.
