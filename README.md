# 🎓 ClassMate — AI-Powered Student Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-emerald.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ClassMate** is a full-stack, enterprise-grade, modern, and responsive **AI-Powered Student Management System** built with **React 18 + Vite**, **Express + Node.js**, and **MongoDB Atlas**.

---

## 🌟 Key Features

### 👑 Administrator Portal
- **Executive Telemetry**: Institutional KPI analytics, enrollment velocity, attendance ratios, and fee collection meters.
- **Student Admissions & Directory**: Complete CRUD, roll numbers, department/semester/status filtering, and photo uploads.
- **Faculty Management**: Staff profiles, designations, employee IDs, and department allocations.
- **Curriculum Architecture**: Tabbed manager for Departments, Degree Programs, Syllabus Subjects, and Sections.
- **Attendance Monitor**: Class-wide roll records, percentage calculator, and absentee auditing.
- **Examinations & Grading**: Exam scheduler, term results recorder, and automated grade card generation.
- **Fees & Billing**: Semester invoice tracker, fee structures, payment records, and PDF receipt downloads.
- **AI Retention Radar**: Predictive early warning system flagging students at risk based on attendance (<75%) and grade trends.

### 👨‍🏫 Faculty Portal
- **Daily Roll Call**: Interactive attendance sheet with single-click **All Present** / **All Absent** buttons.
- **Coursework Manager**: Create homework/lab assignments with deadlines and review student submissions.
- **AI Assessment Copilot**: Automatic multiple-choice question and quiz generator with full answer keys and reasoning explanations.

### 🎓 Student Portal
- **Student Overview**: Real-time cumulative GPA tracker, attendance eligibility gauge, and upcoming coursework.
- **Subject-wise Attendance**: Visual attendance progress bars with automatic warnings if below the 75% examination threshold.
- **Grades & Transcripts**: Semester-wise breakdown of marks, credit scores, and letter grades.
- **Assignment Submissions**: Turn in solutions (code repositories, essays, text answers) and view faculty feedback.
- **Fee Receipts**: Downloadable tuition receipts and payment balance status.
- **Interactive AI Study Tutor**: Personalized 24/7 AI tutor for exam revisions, Pomodoro schedules, and concept breakdowns.

---

## 🏗️ Architecture

```
student-management-system/
├── client/                 # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, modals
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── admin/      # Admin dashboard, students, faculty, curriculum, fees
│   │   │   ├── faculty/    # Roll call, assignments, AI quiz generator
│   │   │   ├── student/    # Attendance, results, assignments, AI tutor
│   │   │   ├── shared/     # Notice board, profile
│   │   │   └── auth/       # 3D interactive login page
│   │   ├── routes/         # Protected route guards
│   │   └── services/       # Axios API client
│   └── package.json
├── server/                 # Express + Node.js Backend
│   ├── src/
│   │   ├── config/         # MongoDB Atlas connection & Swagger
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # JWT authentication, rate limiting, upload
│   │   ├── models/         # 19 Mongoose schemas
│   │   ├── routes/         # Express REST routes
│   │   ├── services/       # AI service & context builders
│   │   └── utils/          # Database seeder
│   └── package.json
└── README.md
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@sms.edu` | `Admin@123!` | Complete institutional control |
| **Faculty** | `rajesh@sms.edu` | `Faculty@123!` | Roll call, exam grading, AI quiz generator |
| **Student** | `arjun@student.sms.edu` | `Student@123!` | Personal transcript, attendance gauge, AI tutor |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas database URI
- npm or yarn

### 1. Backend Setup
```bash
cd server
npm install
node src/utils/seed.js   # Seed demo data to MongoDB Atlas
npm start                # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev              # Starts frontend on http://localhost:5173
```

---

## 🌐 Deployment to Vercel

### Client (Frontend)
1. Import repository into [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Set Framework to `Vite`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. on Render/Railway/Vercel serverless).
5. Click **Deploy**.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
