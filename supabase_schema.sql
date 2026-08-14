-- Supabase SQL Schema for Student Management System
-- Copy and run this script inside your Supabase Dashboard -> SQL Editor

-- 1. Student Table
CREATE TABLE IF NOT EXISTS "Student" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "rollNumber" TEXT UNIQUE NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "department" TEXT NOT NULL,
  "year" INT DEFAULT 1,
  "semester" INT DEFAULT 1,
  "cgpa" DOUBLE PRECISION DEFAULT 0.0,
  "attendance" INT DEFAULT 0,
  "feeStatus" TEXT DEFAULT 'Pending',
  "feeAmount" INT DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. StudentCourse Table
CREATE TABLE IF NOT EXISTS "StudentCourse" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT REFERENCES "Student"("id") ON DELETE CASCADE,
  "courseName" TEXT NOT NULL
);

-- 3. StudentDocument Table
CREATE TABLE IF NOT EXISTS "StudentDocument" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT REFERENCES "Student"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "status" TEXT DEFAULT 'Pending'
);

-- 4. AttendanceLog Table
CREATE TABLE IF NOT EXISTS "AttendanceLog" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT REFERENCES "Student"("id") ON DELETE CASCADE,
  "date" TEXT NOT NULL,
  "course" TEXT NOT NULL,
  "status" TEXT NOT NULL
);

-- 5. PendingApproval Table
CREATE TABLE IF NOT EXISTS "PendingApproval" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "department" TEXT NOT NULL,
  "desiredRole" TEXT DEFAULT 'student',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 6. Announcement Table
CREATE TABLE IF NOT EXISTS "Announcement" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "priority" TEXT DEFAULT 'Normal',
  "author" TEXT DEFAULT 'System Administration',
  "date" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 7. Complaint Table
CREATE TABLE IF NOT EXISTS "Complaint" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT,
  "studentName" TEXT NOT NULL,
  "studentRoll" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT DEFAULT 'Pending',
  "resolution" TEXT,
  "date" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 8. UserRole Table
CREATE TABLE IF NOT EXISTS "UserRole" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
