# 🎓 Student Management System (Apex College Portal)

A comprehensive, full-stack **Student Management System** built with **React 19**, **Vite**, **Node.js Express**, and **Supabase (PostgreSQL)** featuring **Clerk Authentication**, role-based access control, financial fee ledgers, PDF invoice generation, daily attendance tracking, department timetable schedules, and grievance resolution desks.

---

## 🌟 Core Feature Modules

### 🛡️ 1. Master Admin Dashboard
- **Campus-Wide Analytics**: Monitor department-wise enrollment statistics, low attendance alerts, and overall CGPA distributions.
- **Registration Requests Queue**: Approve or reject new enrollment applications for Students, Faculty, and Registrar Officers.
- **Full Student Directory**: Advanced search, filtering by department or fee clearance status, and student record editing.
- **Directory Inspections**: Access Master Directories for Professors and Registrar Officers.

### 👨‍🏫 2. Faculty & Professor Workspace
- **Left Column Navigation**: Streamlined sidebar access for all departmental operations.
- **Grades & Performance Matrix**: Update student semester GPAs and attendance metrics.
- **Daily Attendance Logger**: Track daily student attendance logs per subject with status flags (*Present*, *Late*, *Absent*).
- **Department Timetable & Schedules**: Access weekly class timetables mapped to courses and lecture halls.
- **Grievance Desk**: Review and resolve academic/lab complaints submitted by department students.

### 🏢 3. Registrar Office & Operations
- **Financial Dues & Fee Ledgers**: Track outstanding tuition dues and calculate branch-wise collection percentages.
- **Printable Tuition Fee Invoice Generator**: Instantly generate and print formal fee receipts with digital accounts seals.
- **Document Verification Engine**: Verify student high school marksheets, passport/ID proofs, and admission letters.
- **Registrar Officers Roster**: Directory of on-duty administrative desk officers.

### 🎓 4. Student Self-Service Portal
- **My Academic Overview**: View semester GPAs, target attendance percentages, and download report cards.
- **Subject Attendance Logs**: Detailed history of attendance logs across all enrolled courses.
- **Class Timetable Matrix**: Weekly schedule of lectures, break periods, and classroom numbers.
- **Fees & Ledger Invoices**: Download fee receipts and track outstanding tuition dues.
- **Grievance Desk**: Raise complaints directly to department faculty and track resolution statuses.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Clerk Authentication (`@clerk/clerk-react`), Lucide React Icons, Custom Design Tokens |
| **Backend** | Node.js, Express.js, Supabase JS Client (`@supabase/supabase-js`), CORS, dotenv |
| **Database** | PostgreSQL (Supabase Cloud Database) |
| **Dev Tools** | Oxlint, Vite Dev Server, Git |

---

## 📁 Repository Architecture

```text
student_mgmt/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js              # Supabase & Express API integration client
│   │   ├── components/
│   │   │   ├── Dashboard.jsx           # Campus analytics overview
│   │   │   ├── StudentTable.jsx        # Full student directory matrix
│   │   │   ├── StudentPortal.jsx       # Student self-service portal
│   │   │   ├── ProfessorWorkspace.jsx  # Faculty grading & attendance workspace
│   │   │   ├── RegistrarWorkspace.jsx  # Billing, invoices & document verification
│   │   │   ├── ApprovalsQueue.jsx      # Admin registration requests queue
│   │   │   ├── LoginView.jsx           # Clerk sign-in & authentication view
│   │   │   ├── AnnouncementsBoard.jsx  # Campus bulletin board
│   │   │   ├── ProfessorsDirectory.jsx # Faculty roster
│   │   │   └── RegistrarsDirectory.jsx # Registrar desk roster
│   │   ├── App.jsx                     # Master router & state manager
│   │   ├── mockData.js                 # Initial fallback mock records & timetable generator
│   │   └── index.css                   # Custom modern CSS design system tokens
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── routes/
│   │   ├── students.js                 # Students CRUD API routes
│   │   ├── announcements.js            # Announcements bulletin API routes
│   │   ├── complaints.js               # Grievance desk API routes
│   │   └── seed.js                     # Initial Supabase DB seeder
│   ├── index.js                        # Express app entrypoint
│   ├── supabase.js                     # Supabase client connection
│   └── package.json
├── supabase_schema.sql                 # SQL schema for Supabase tables
└── README.md                           # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at **`http://localhost:5173`**.

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend API server will start at **`http://localhost:5000`**.

---

## 🔗 Key API Routes Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server & database health check |
| `GET` | `/api/students` | Fetch all student records |
| `POST` | `/api/students` | Create new student profile |
| `PUT` | `/api/students/:id` | Update student profile & performance |
| `DELETE` | `/api/students/:id` | Delete student record |
| `GET` | `/api/announcements` | Fetch campus announcements |
| `POST` | `/api/announcements` | Post new announcement |
| `GET` | `/api/complaints` | Fetch grievance tickets |
| `PUT` | `/api/complaints/:id/resolve` | Resolve grievance ticket |

---

## 📄 License
This project is open-source under the **MIT License**.
