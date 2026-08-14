# Student Management System

A full-featured **Student Management System** built with React, Vite, Express, and PostgreSQL (Supabase) featuring multi-role access (Admin, Professor, Registrar, Student), student record management, attendance tracking, fee management, complaint resolution, and announcement broadcasting.

## 🚀 Features

- **Role-Based Access Control**: Portals for Admin, Professor, Registrar, and Students.
- **Student Directory & Profiles**: Filter by branch, fee status, search roll numbers, and view detailed academic performance.
- **Attendance & Grade Management**: Track course-level attendance percentages and CGPA.
- **Financial & Registrar Workspace**: Fee status monitoring, invoice generation, and clearance certificates.
- **Grievance & Announcement Boards**: System-wide announcements and student complaint submission/resolution tracking.

## 📁 Project Architecture

- `frontend/` - React 19 + Vite app with Clerk authentication integration.
- `backend/` - Node.js Express API connected to Supabase PostgreSQL database.
- `supabase_schema.sql` - Complete SQL schema setup for backend persistence.

## 🛠️ Setup & Running Locally

1. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
