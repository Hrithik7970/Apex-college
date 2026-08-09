-- Supabase SQL Schema for Apex College Student Management System
-- Copy and run this script inside your Supabase Dashboard -> SQL Editor

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  year INT DEFAULT 1,
  semester INT DEFAULT 1,
  cgpa NUMERIC(3, 2) DEFAULT 0.0,
  attendance INT DEFAULT 0,
  fee_status TEXT DEFAULT 'Pending',
  fee_amount INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Student Courses Table
CREATE TABLE IF NOT EXISTS student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL
);

-- 3. Student Documents Table
CREATE TABLE IF NOT EXISTS student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Pending'
);

-- 4. Attendance Logs Table
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  course TEXT NOT NULL,
  status TEXT NOT NULL
);

-- 5. Pending Approvals Table
CREATE TABLE IF NOT EXISTS pending_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  desired_role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'Normal',
  author TEXT DEFAULT 'College Administration',
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT,
  student_name TEXT NOT NULL,
  student_roll TEXT NOT NULL,
  department TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  resolution TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
