export const MOCK_STUDENTS = [
  {
    _id: "s1",
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
    _id: "s2",
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
    _id: "s3",
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
    _id: "s4",
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
    _id: "s5",
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
    _id: "s6",
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
    _id: "s7",
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

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical"
];

export const COURSES_BY_DEPT = {
  "Computer Science": ["Database Systems", "Computer Networks", "Software Engineering", "Artificial Intelligence", "Design of Algorithms", "Web Security", "Compiler Design"],
  "Information Technology": ["Operating Systems", "Cloud Computing", "Human Computer Interaction", "Web Frameworks", "Cyber Security", "Data Mining"],
  "Electronics": ["Digital Electronics", "Network Analysis", "Signals & Systems", "Electromagnetic Fields", "Microprocessors", "VLSI Design"],
  "Mechanical": ["Fluid Mechanics", "CAD/CAM", "Refrigeration & AC", "Operations Research", "Thermodynamics", "Machine Design"],
  "Civil": ["Structural Analysis II", "Geotechnical Eng", "Hydrology", "Concrete Technology", "Transportation Engineering", "Surveying"],
  "Electrical": ["Calculus I", "Basic Electrical Eng", "Engineering Physics", "Intro to Programming", "Control Systems", "Power Electronics"]
};

export const MOCK_PENDING_APPROVALS = [
  {
    id: "req1",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@college.edu",
    desiredRole: "student",
    department: "Information Technology"
  },
  {
    id: "req2",
    name: "Divya Nair",
    email: "divya.nair@college.edu",
    desiredRole: "student",
    department: "Electronics"
  }
];

export const MOCK_PROFESSORS = [
  {
    id: "p1",
    name: "Dr. Rajesh Sharma",
    email: "professor@college.edu",
    department: "Computer Science",
    designation: "Head of Department (HOD)",
    qualification: "Ph.D. in Computer Science & AI (IIT Bombay)",
    phone: "+91 98765 43210",
    office: "CS Building, Block A - Room 302",
    courses: ["Database Systems", "Artificial Intelligence", "Compiler Design"],
    experienceYears: 18,
    status: "Active"
  },
  {
    id: "p2",
    name: "Dr. Sunita Rao",
    email: "sunita.rao@college.edu",
    department: "Computer Science",
    designation: "Associate Professor",
    qualification: "Ph.D. in Cybersecurity & Networks",
    phone: "+91 98765 43211",
    office: "CS Building, Block A - Room 305",
    courses: ["Computer Networks", "Web Security", "Software Engineering"],
    experienceYears: 12,
    status: "Active"
  },
  {
    id: "p3",
    name: "Prof. Amit Kulkarni",
    email: "amit.kulkarni@college.edu",
    department: "Information Technology",
    designation: "HOD & Professor",
    qualification: "M.Tech in Cloud Systems & Distributed Computing",
    phone: "+91 98765 43212",
    office: "IT Block - Room 201",
    courses: ["Cloud Computing", "Operating Systems", "Cyber Security"],
    experienceYears: 15,
    status: "Active"
  },
  {
    id: "p4",
    name: "Dr. Priya Deshmukh",
    email: "priya.deshmukh@college.edu",
    department: "Electronics",
    designation: "Head of Department (HOD)",
    qualification: "Ph.D. in Microelectronics & VLSI",
    phone: "+91 98765 43213",
    office: "ECE Building - Room 104",
    courses: ["Digital Electronics", "VLSI Design", "Microprocessors"],
    experienceYears: 16,
    status: "Active"
  },
  {
    id: "p5",
    name: "Prof. Vikram Joshi",
    email: "vikram.joshi@college.edu",
    department: "Mechanical",
    designation: "Associate Professor",
    qualification: "M.Tech in Thermal Engineering & Fluid Dynamics",
    phone: "+91 98765 43214",
    office: "Mechanical Wing - Room 112",
    courses: ["Fluid Mechanics", "Thermodynamics", "CAD/CAM"],
    experienceYears: 10,
    status: "Active"
  },
  {
    id: "p6",
    name: "Dr. Meenakshi Iyer",
    email: "meenakshi.iyer@college.edu",
    department: "Civil",
    designation: "HOD & Senior Professor",
    qualification: "Ph.D. in Structural Engineering & Geotechnics",
    phone: "+91 98765 43215",
    office: "Civil Complex - Room 401",
    courses: ["Structural Analysis II", "Geotechnical Eng", "Hydrology"],
    experienceYears: 20,
    status: "Active"
  },
  {
    id: "p7",
    name: "Prof. Suresh Nambiar",
    email: "suresh.nambiar@college.edu",
    department: "Electrical",
    designation: "Assistant Professor",
    qualification: "M.Tech in Power Systems & Control Systems",
    phone: "+91 98765 43216",
    office: "Electrical Hall - Room 208",
    courses: ["Basic Electrical Eng", "Control Systems", "Power Electronics"],
    experienceYears: 8,
    status: "Active"
  }
];

export const MOCK_REGISTRARS = [
  {
    id: "r1",
    name: "Rameshwar Prasad",
    email: "registrar@college.edu",
    title: "Chief Controller of Admissions, Billing & Student Records",
    desk: "Administrative Block - Main Registrar Desk (Counter 01)",
    phone: "+91 98111 22334",
    responsibility: "Admissions Approvals, Fee Ledgers, Tuition Invoices, Document Verification & Timetable Audits",
    employeeId: "REG-2021-001",
    status: "Active Desk"
  },
  {
    id: "r2",
    name: "Sunita Sen",
    email: "billing.registrar@college.edu",
    title: "Senior Invoicing & Fee Operations Specialist",
    desk: "Administrative Block - Counter 03",
    phone: "+91 98111 22335",
    responsibility: "Tuition Invoices, Outstanding Dues Collection & Payment Postings",
    employeeId: "REG-2022-014",
    status: "Active Desk"
  },
  {
    id: "r3",
    name: "Alok Kumar",
    email: "verification.registrar@college.edu",
    title: "Document Verification & Admissions Officer",
    desk: "Administrative Block - Counter 05",
    phone: "+91 98111 22336",
    responsibility: "High School Marksheets, Passport/ID Checks & Admissions Approvals",
    employeeId: "REG-2023-029",
    status: "Active Desk"
  },
  {
    id: "r4",
    name: "Kavita Singh",
    email: "academic.registrar@college.edu",
    title: "Student Academic Records & Transcripts Manager",
    desk: "Administrative Block - Counter 07",
    phone: "+91 98111 22337",
    responsibility: "Transcript Issuance, Academic Holds & Student Status Verification",
    employeeId: "REG-2024-042",
    status: "Active Desk"
  }
];

export const generateWeeklySchedule = (branch, courses) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    { name: "Lecture 1", time: "09:15 AM - 10:10 AM" },
    { name: "Lecture 2", time: "10:10 AM - 11:05 AM" },
    { name: "Lecture 3", time: "11:05 AM - 12:00 PM" },
    { name: "Lunch Break", time: "12:00 PM - 01:00 PM", isBreak: true },
    { name: "Lecture 4", time: "01:00 PM - 01:55 PM" },
    { name: "Lecture 5", time: "01:55 PM - 02:50 PM" },
    { name: "Lecture 6", time: "02:50 PM - 03:45 PM" }
  ];

  const schedule = {};
  
  days.forEach((day, dayIdx) => {
    schedule[day] = timeSlots.map((slot, slotIdx) => {
      if (slot.isBreak) {
        return { ...slot, subject: "Lunch Break & Recess" };
      }
      const adjustedIdx = slotIdx > 3 ? slotIdx - 1 : slotIdx;
      const courseIdx = (dayIdx + adjustedIdx) % (courses.length || 1);
      return {
        ...slot,
        subject: courses[courseIdx] || "Self Study"
      };
    });
  });

  return schedule;
};
