import express from 'express';
import prisma from '../db.js';

const router = express.Router();

const INITIAL_STUDENTS = [
  {
    name: "Aarav Sharma",
    rollNumber: "CS2023001",
    email: "aarav.sharma@college.edu",
    department: "Computer Science",
    year: 3,
    semester: 5,
    cgpa: 9.2,
    attendance: 88,
    feeStatus: "Paid",
    feeAmount: 0,
    courses: ["Database Systems", "Computer Networks", "Software Engineering", "Artificial Intelligence"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Ananya Patel",
    rollNumber: "CS2023009",
    email: "ananya.patel@college.edu",
    department: "Computer Science",
    year: 3,
    semester: 5,
    cgpa: 8.7,
    attendance: 72,
    feeStatus: "Pending",
    feeAmount: 45000,
    courses: ["Database Systems", "Computer Networks", "Design of Algorithms", "Web Security"],
    documents: [
      { name: "High School Marksheet", status: "Submitted" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Submitted" }
    ]
  },
  {
    name: "Rohan Verma",
    rollNumber: "ME2022045",
    email: "rohan.verma@college.edu",
    department: "Mechanical",
    year: 4,
    semester: 7,
    cgpa: 7.9,
    attendance: 81,
    feeStatus: "Paid",
    feeAmount: 0,
    courses: ["Fluid Mechanics", "CAD/CAM", "Refrigeration & AC", "Operations Research"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Isha Gupta",
    rollNumber: "EC2024012",
    email: "isha.gupta@college.edu",
    department: "Electronics",
    year: 2,
    semester: 3,
    cgpa: 8.1,
    attendance: 94,
    feeStatus: "Overdue",
    feeAmount: 62000,
    courses: ["Digital Electronics", "Network Analysis", "Signals & Systems", "Electromagnetic Fields"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Rejected" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Kabir Mehta",
    rollNumber: "IT2023015",
    email: "kabir.mehta@college.edu",
    department: "Information Technology",
    year: 3,
    semester: 5,
    cgpa: 6.8,
    attendance: 64,
    feeStatus: "Pending",
    feeAmount: 38000,
    courses: ["Operating Systems", "Cloud Computing", "Human Computer Interaction", "Web Frameworks"],
    documents: [
      { name: "High School Marksheet", status: "Submitted" },
      { name: "ID Proof / Passport", status: "Submitted" },
      { name: "Admissions Letter", status: "Pending" }
    ]
  },
  {
    name: "Sneha Reddy",
    rollNumber: "EE2025008",
    email: "sneha.reddy@college.edu",
    department: "Electrical",
    year: 1,
    semester: 1,
    cgpa: 8.5,
    attendance: 90,
    feeStatus: "Paid",
    feeAmount: 0,
    courses: ["Calculus I", "Basic Electrical Eng", "Engineering Physics", "Intro to Programming"],
    documents: [
      { name: "High School Marksheet", status: "Verified" },
      { name: "ID Proof / Passport", status: "Verified" },
      { name: "Admissions Letter", status: "Verified" }
    ]
  },
  {
    name: "Aditya Sen",
    rollNumber: "CV2022022",
    email: "aditya.sen@college.edu",
    department: "Civil",
    year: 4,
    semester: 7,
    cgpa: 7.2,
    attendance: 68,
    feeStatus: "Overdue",
    feeAmount: 51000,
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
  { name: "Vikram Malhotra", email: "vikram.malhotra@college.edu", department: "Information Technology", desiredRole: "student" },
  { name: "Divya Nair", email: "divya.nair@college.edu", department: "Electronics", desiredRole: "student" }
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

// POST /api/seed — Seed database
router.post('/', async (req, res) => {
  try {
    // Clear existing
    await prisma.attendanceLog.deleteMany();
    await prisma.studentCourse.deleteMany();
    await prisma.studentDocument.deleteMany();
    await prisma.student.deleteMany();
    await prisma.pendingApproval.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.complaint.deleteMany();

    // Insert Students
    for (const s of INITIAL_STUDENTS) {
      await prisma.student.create({
        data: {
          name: s.name,
          rollNumber: s.rollNumber,
          email: s.email,
          department: s.department,
          year: s.year,
          semester: s.semester,
          cgpa: s.cgpa,
          attendance: s.attendance,
          feeStatus: s.feeStatus,
          feeAmount: s.feeAmount,
          courses: {
            create: s.courses.map(c => ({ courseName: c }))
          },
          documents: {
            create: s.documents.map(d => ({ name: d.name, status: d.status }))
          }
        }
      });
    }

    // Insert Roles
    for (const r of INITIAL_ROLES) {
      await prisma.userRole.upsert({
        where: { email: r.email },
        update: { role: r.role },
        create: { email: r.email, role: r.role }
      });
    }

    // Insert Pending
    for (const p of INITIAL_PENDING) {
      await prisma.pendingApproval.create({ data: p });
    }

    // Insert Announcements
    for (const a of INITIAL_ANNOUNCEMENTS) {
      await prisma.announcement.create({ data: a });
    }

    res.json({ message: 'Database seeded successfully with initial records!' });
  } catch (err) {
    console.error('Error seeding database:', err);
    res.status(500).json({ error: 'Failed to seed database', details: err.message });
  }
});

export default router;
