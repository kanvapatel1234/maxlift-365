# MaxLift365 — Production Full-Stack Gym Workout & PR Tracker

**MaxLift365** is a production-style gym workout and personal-record tracking platform built with React, Vite, Node.js, Express, PostgreSQL, and Prisma ORM.

---

## ⚡ Tech Stack

- **Frontend:** React.js, Vite, React Router v6, Axios, Tailwind CSS, Context API (`AuthContext`), Lucide Icons
- **Backend:** Node.js, Express.js (MVC architecture), PostgreSQL, Prisma ORM, JWT Authentication, bcryptjs
- **Formulas & Metrics:** Epley Estimated 1RM Formula (`1RM = Weight × (1 + Reps / 30)`), Maximum Weight PR, Peak Set Volume, Historical Progression

---

## 🏗️ Project Architecture

```text
maxlift365/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models: User, MuscleGroup, Exercise, WorkoutRecord
│   │   └── seed.js             # Pre-populates 7 muscle groups, 83 exercises, & demo user
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Prisma client instance
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── exerciseController.js
│   │   │   ├── workoutController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── exerciseRoutes.js
│   │   │   ├── muscleGroupRoutes.js
│   │   │   ├── workoutRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── workoutService.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── AddWorkoutModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MuscleGroups.jsx
│   │   │   ├── Exercises.jsx
│   │   │   ├── ExerciseDetails.jsx
│   │   │   └── Profile.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── workoutService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🗄️ Database Design

Relational architecture powered by PostgreSQL and Prisma ORM:

```text
User (1) ─────────── (N) WorkoutRecord
MuscleGroup (1) ───── (N) Exercise
Exercise (1) ──────── (N) WorkoutRecord
```

- **`User`**: `id`, `name`, `email`, `passwordHash`, `createdAt`, `updatedAt`
- **`MuscleGroup`**: `id`, `name` (Chest, Back, Shoulders, Biceps, Triceps, Legs, Abs)
- **`Exercise`**: `id`, `name`, `muscleGroupId`, `description`, `createdAt`
- **`WorkoutRecord`**: `id`, `userId`, `exerciseId`, `weight`, `reps`, `performedAt`, `createdAt`

Workout records store **only `exerciseId`** as a foreign key and never duplicate exercise names or catalog definitions.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+ running on port 5432)

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment (.env)
cp .env.example .env
# Ensure DATABASE_URL="postgresql://postgres:kanva@localhost:5432/maxlift365?schema=public"

# Synchronize database schema & seed exercise catalog
npx prisma db push
node prisma/seed.js

# Start backend dev server (runs on port 5000)
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Account Credentials

Use the pre-seeded account or click the **"1-Click Demo Login"** button on the Login page:

- **Email:** `alex@maxlift365.com`
- **Password:** `Password123!`

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user & return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Fetch authenticated user profile |
| `GET` | `/api/muscle-groups` | Public | List all muscle groups with counts |
| `GET` | `/api/muscle-groups/:id/exercises` | Public/Auth | List exercises for a muscle group with user PRs |
| `GET` | `/api/exercises` | Public/Auth | Search & list all exercises |
| `GET` | `/api/exercises/:id` | Public | Get exercise metadata |
| `GET` | `/api/exercises/:id/workouts` | Private | Get user history & PR for exercise |
| `GET` | `/api/exercises/:id/pr` | Private | Get calculated current PR and 1RM |
| `POST` | `/api/workouts` | Private | Log a new workout record set |
| `GET` | `/api/workouts` | Private | List all workout records for user |
| `GET` | `/api/workouts/:id` | Private | Get single workout record by ID |
| `DELETE`| `/api/workouts/:id` | Private | Delete workout record (ownership enforced) |
| `GET` | `/api/users/profile` | Private | Get user profile & aggregate statistics |
| `GET` | `/api/users/stats` | Private | Get dashboard metrics & top PRs |
