import express from 'express';
import supabase from '../db.js';

const router = express.Router();

const INITIAL_STUDENTS = [
  {
    name: "Aarav Sharma",
    roll_number: "CS2023001",
    email: "aarav.sharma@college.edu",
    department: "Computer Science",
    year: 3,
    semester: 5,
    cgpa: 9.2,
    attendance: 88,
    fee_status: "Paid",
    fee_amount: 0,
    courses: ["Database Systems", "Computer Networks", "Software Engineering", "Artificial Intelligence"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Ananya Patel",
    roll_number: "CS2023009",
    email: "ananya.patel@college.edu",
    department: "Computer Science",
    year: 3,
    semester: 5,
    cgpa: 8.7,
    attendance: 72,
    fee_status: "Pending",
    fee_amount: 45000,
    courses: ["Database Systems", "Computer Networks", "Design of Algorithms", "Web Security"],
    documents: [
      { name: "High School Marksheet", status: "Submitted" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Submitted" }
    ]
  },
  {
    name: "Rohan Verma",
    roll_number: "ME2022045",
    email: "rohan.verma@college.edu",
    department: "Mechanical",
    year: 4,
    semester: 7,
    cgpa: 7.9,
    attendance: 81,
    fee_status: "Paid",
    fee_amount: 0,
    courses: ["Fluid Mechanics", "CAD/CAM", "Refrigeration & AC", "Operations Research"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Isha Gupta",
    roll_number: "EC2024012",
    email: "isha.gupta@college.edu",
    department: "Electronics",
    year: 2,
    semester: 3,
    cgpa: 8.1,
    attendance: 94,
    fee_status: "Overdue",
    fee_amount: 62000,
    courses: ["Digital Electronics", "Network Analysis", "Signals & Systems", "Electromagnetic Fields"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Rejected" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Kabir Mehta",
    roll_number: "IT2023015",
    email: "kabir.mehta@college.edu",
    department: "Information Technology",
    year: 3,
    semester: 5,
    cgpa: 6.8,
    attendance: 64,
    fee_status: "Pending",
    fee_amount: 38000,
    courses: ["Operating Systems", "Cloud Computing", "Human Computer Interaction", "Web Frameworks"],
    documents: [
      { name: "High School Marksheet", status: "Submitted" },
      { name: "ID Proof / Passport", status: "Submitted" },
      { name: "Admissions Letter", status: "Pending" }
    ]
  },
  {
    name: "Sneha Reddy",
    roll_number: "EE2025008",
    email: "sneha.reddy@college.edu",
    department: "Electrical",
    year: 1,
    semester: 1,
    cgpa: 8.5,
    attendance: 90,
    fee_status: "Paid",
    fee_amount: 0,
    courses: ["Calculus I", "Basic Electrical Eng", "Engineering Physics", "Intro to Programming"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Aditya Sen",
    roll_number: "CV2022022",
    email: "aditya.sen@college.edu",
    department: "Civil",
    year: 4,
    semester: 7,
    cgpa: 7.2,
    attendance: 68,
    fee_status: "Overdue",
    fee_amount: 51000,
    courses: ["Structural Analysis II", "Geotechnical Eng", "Hydrology", "Concrete Technology"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Submitted" },
      { name: "Admissions Letter", status: "Pending" }
    ]
  }
];

const INITIAL_ROLES = [
  { email: 'admin@college.edu', role: 'admin' },
  { email: 'professor@college.edu', role: 'professor' },
  { email: 'registrar@college.edu', role: 'registrar' },
  { email: 'aarav.sharma@college.edu', role: 'student' }
];

const INITIAL_PENDING = [
  { name: "Vikram Malhotra", email: "vikram.malhotra@college.edu", department: "Information Technology", desired_role: "student" },
  { name: "Divya Nair", email: "divya.nair@college.edu", department: "Electronics", desired_role: "student" }
];

const INITIAL_ANNOUNCEMENTS = [
  {
    title: "Final Semester Examination Timetable Released",
    content: "The end-semester exam schedules for all departments are now available on the portal dashboard.",
    priority: "High",
    author: "Academic Registrar",
    date: "May 10, 2026"
  },
  {
    title: "Campus Wi-Fi Maintenance Window",
    content: "Scheduled network upgrade on Saturday between 02:00 AM and 06:00 AM.",
    priority: "Normal",
    author: "IT Support Center",
    date: "May 08, 2026"
  }
];

// POST /api/seed — Seed database in Supabase
router.post('/', async (req, res) => {
  try {
    // Clear existing tables
    await supabase.from('attendance_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('student_courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('student_documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('pending_approvals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('complaints').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert Students
    for (const s of INITIAL_STUDENTS) {
      const { data: createdStudent, error: sErr } = await supabase
        .from('students')
        .insert([{
          name: s.name,
          roll_number: s.roll_number,
          email: s.email,
          department: s.department,
          year: s.year,
          semester: s.semester,
          cgpa: s.cgpa,
          attendance: s.attendance,
          fee_status: s.fee_status,
          fee_amount: s.fee_amount
        }])
        .select()
        .single();

      if (!sErr && createdStudent) {
        await supabase.from('student_courses').insert(
          s.courses.map(c => ({ student_id: createdStudent.id, course_name: c }))
        );
        await supabase.from('student_documents').insert(
          s.documents.map(d => ({ student_id: createdStudent.id, name: d.name, status: d.status }))
        );
      }
    }

    // Insert Roles
    for (const r of INITIAL_ROLES) {
      await supabase.from('user_roles').upsert({ email: r.email, role: r.role }, { onConflict: 'email' });
    }

    // Insert Pending
    await supabase.from('pending_approvals').insert(INITIAL_PENDING);

    // Insert Announcements
    await supabase.from('announcements').insert(INITIAL_ANNOUNCEMENTS);

    res.json({ message: 'Database seeded successfully in Supabase!' });
  } catch (err) {
    console.error('Error seeding Supabase database:', err.message);
    res.status(500).json({ error: 'Failed to seed database', details: err.message });
  }
});

export default router;
