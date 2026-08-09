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
