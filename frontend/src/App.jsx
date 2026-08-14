import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, GraduationCap, Sun, Moon, ShieldAlert, X, CreditCard, BookOpen, Calendar, Clock, MessageSquare, ClipboardList, Award, Bell, Menu } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { MOCK_STUDENTS, MOCK_PENDING_APPROVALS, MOCK_PROFESSORS, MOCK_REGISTRARS } from './mockData';

// Import components
import Dashboard from './components/Dashboard';
import StudentTable from './components/StudentTable';
import StudentDetailModal from './components/StudentDetailModal';
import StudentFormDrawer from './components/StudentFormDrawer';
import StudentPortal from './components/StudentPortal';
import LoginView from './components/LoginView';
import PendingApprovalView from './components/PendingApprovalView';
import ApprovalsQueue from './components/ApprovalsQueue';
import ProfessorWorkspace from './components/ProfessorWorkspace';
import RegistrarWorkspace from './components/RegistrarWorkspace';
import ProfessorsDirectory from './components/ProfessorsDirectory';
import RegistrarsDirectory from './components/RegistrarsDirectory';
import AnnouncementsBoard from './components/AnnouncementsBoard';
import { api } from './api/client';

import './App.css';

// Seeding utility to generate daily logs for the past 15 academic days
const seedStudentAttendanceLogs = (student) => {
  if (student.attendanceLogs && student.attendanceLogs.length > 0) {
    return student.attendanceLogs;
  }

  const logs = [];
  const courses = student.courses || [];
  const targetPct = student.attendance || 85;
  
  // Use a deterministic seed based on student name length to avoid shifting values
  const seed = student.name.length;
  
  for (let i = 0; i < 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    
    const formattedDate = d.toISOString().split('T')[0];
    const course = courses[i % courses.length];
    
    // Deterministic random check matching target percentage
    const roll = Math.abs(Math.sin(i * seed + 1)) * 100;
    const status = roll <= targetPct ? 'Present' : (roll <= targetPct + 10 ? 'Late' : 'Absent');
    
    logs.push({ date: formattedDate, course, status });
  }
  
  // Sort logs chronologically by date descending
  return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
};

function App() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const activeEmail = userEmail;

  // Local storage state syncing for database records
  const [students, setStudents] = useState(() => {
    const localData = localStorage.getItem('college_students');
    const rawStudents = localData ? JSON.parse(localData) : MOCK_STUDENTS;
    return rawStudents.map(student => {
      const logs = seedStudentAttendanceLogs(student);
      const total = logs.length;
      const present = logs.filter(l => l.status === 'Present' || l.status === 'Late').length;
      const derivedPct = total > 0 ? Math.round((present / total) * 100) : 100;
      const clampedCgpa = student.cgpa ? Math.max(6.0, parseFloat(student.cgpa)) : 6.0;
      return {
        ...student,
        cgpa: clampedCgpa,
        attendanceLogs: logs,
        attendance: derivedPct
      };
    });
  });

  const [pendingRequests, setPendingRequests] = useState(() => {
    const localData = localStorage.getItem('pending_approvals');
    return localData ? JSON.parse(localData) : MOCK_PENDING_APPROVALS;
  });

  // Professors and Registrars Directory States
  const [professors, setProfessors] = useState(() => {
    const localData = localStorage.getItem('college_professors');
    return localData ? JSON.parse(localData) : MOCK_PROFESSORS;
  });

  const [registrars, setRegistrars] = useState(() => {
    const localData = localStorage.getItem('college_registrars');
    return localData ? JSON.parse(localData) : MOCK_REGISTRARS;
  });

  useEffect(() => {
    localStorage.setItem('college_professors', JSON.stringify(professors));
  }, [professors]);

  useEffect(() => {
    localStorage.setItem('college_registrars', JSON.stringify(registrars));
  }, [registrars]);

  // Access Directory: Maps Emails to approved roles
  const [userRoles, setUserRoles] = useState(() => {
    const localData = localStorage.getItem('college_user_roles');
    if (localData) return JSON.parse(localData);

    // Initial seed directory mapping
    return [
      { email: "hraj22634@gmail.com", role: "admin" }, // Fixed Master Admin
      { email: "admin@college.edu", role: "admin" },
      { email: "aarav.sharma@college.edu", role: "student", detailsId: "s1" },
      { email: "ananya.patel@college.edu", role: "student", detailsId: "s2" },
      { email: "rohan.verma@college.edu", role: "student", detailsId: "s3" },
      { email: "isha.gupta@college.edu", role: "student", detailsId: "s4" },
      { email: "kabir.mehta@college.edu", role: "student", detailsId: "s5" },
      { email: "sneha.reddy@college.edu", role: "student", detailsId: "s6" },
      { email: "aditya.sen@college.edu", role: "student", detailsId: "s7" },
      // Professors Mapping
      { email: "professor@college.edu", role: "professor", department: "Computer Science" },
      { email: "sunita.rao@college.edu", role: "professor", department: "Computer Science" },
      { email: "amit.kulkarni@college.edu", role: "professor", department: "Information Technology" },
      { email: "priya.deshmukh@college.edu", role: "professor", department: "Electronics" },
      { email: "vikram.joshi@college.edu", role: "professor", department: "Mechanical" },
      { email: "meenakshi.iyer@college.edu", role: "professor", department: "Civil" },
      { email: "suresh.nambiar@college.edu", role: "professor", department: "Electrical" },
      // Registrars Mapping
      { email: "registrar@college.edu", role: "registrar" }
    ];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('college_theme') || 'light';
  });

  const [toasts, setToasts] = useState([]);
  
  // Modal / Drawer control states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Gated Role States
  const [userRole, setUserRole] = useState('pending'); // 'admin' | 'professor' | 'registrar' | 'student' | 'pending'
  const [studentPortalId, setStudentPortalId] = useState('');
  const [professorDept, setProfessorDept] = useState('Computer Science');
  
  // Developer Simulator (useful during design reviews, can be set to empty for real flows)
  const [devRoleOverride, setDevRoleOverride] = useState(''); 

  // Notification bell state
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    const saved = localStorage.getItem('college_read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('college_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('pending_approvals', JSON.stringify(pendingRequests));
  }, [pendingRequests]);

  useEffect(() => {
    localStorage.setItem('college_user_roles', JSON.stringify(userRoles));
  }, [userRoles]);

  // Initial Sync from Backend Express Server if Online
  useEffect(() => {
    async function syncWithBackend() {
      const health = await api.checkHealth();
      if (!health) return; // Backend offline, keep local state

      const [serverStudents, serverApprovals, serverAnnouncements, serverComplaints] = await Promise.all([
        api.getStudents(),
        api.getPendingApprovals(),
        api.getAnnouncements(),
        api.getComplaints()
      ]);

      if (serverStudents && Array.isArray(serverStudents) && serverStudents.length > 0) {
        setStudents(serverStudents.map(s => ({
          ...s,
          attendanceLogs: seedStudentAttendanceLogs(s)
        })));
      }
      if (serverApprovals && Array.isArray(serverApprovals)) {
        setPendingRequests(serverApprovals);
      }
      if (serverAnnouncements && Array.isArray(serverAnnouncements)) {
        setAnnouncements(serverAnnouncements);
      }
      if (serverComplaints && Array.isArray(serverComplaints)) {
        setComplaints(serverComplaints);
      }
    }

    syncWithBackend();
  }, []);

  // Announcements State & Handlers
  const [announcements, setAnnouncements] = useState(() => {
    const localData = localStorage.getItem('college_announcements');
    if (localData) return JSON.parse(localData);
    
    return [
      {
        id: 'ann_1',
        title: 'End Term Theory Exams Schedule',
        content: 'The final exams schedule has been posted on the student portal. Exams start from August 5th.',
        priority: 'high',
        date: 'Jul 20, 2026'
      },
      {
        id: 'ann_2',
        title: 'Odd Semester Fees Clearance',
        content: 'All students are requested to clear their outstanding tuition fees before July 30th to avoid registration holds.',
        priority: 'medium',
        date: 'Jul 18, 2026'
      },
      {
        id: 'ann_3',
        title: 'Technical Club Hackathon',
        content: 'Apex Tech club is hosting its annual Hackathon "CodeStorm 2026" on July 25th. Register now!',
        priority: 'low',
        date: 'Jul 15, 2026'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('college_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handleAddAnnouncement = (newNotice) => {
    const notice = {
      ...newNotice,
      id: 'ann_' + Date.now()
    };
    setAnnouncements((prev) => [notice, ...prev]);
    addToast('Notice published successfully!', 'success');
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    addToast('Notice removed from bulletin board.', 'info');
  };

  // Complaints State & Handlers
  const [complaints, setComplaints] = useState(() => {
    const localData = localStorage.getItem('college_complaints');
    if (localData) return JSON.parse(localData);

    return [
      {
        id: 'comp_1',
        studentId: 's1',
        studentName: 'Aarav Sharma',
        studentRoll: 'CS2023001',
        department: 'Computer Science',
        subject: 'Lab Machine Node Version',
        description: 'The PCs in Computer Lab 2 are using a very old version of Node.js. Can we update them to version 20?',
        status: 'Pending',
        resolution: '',
        date: 'Jul 20, 2026'
      },
      {
        id: 'comp_2',
        studentId: 's2',
        studentName: 'Ananya Patel',
        studentRoll: 'CS2023009',
        department: 'Computer Science',
        subject: 'Database Systems Reference Book',
        description: 'The library only has 2 copies of the Database Systems text, which are always checked out.',
        status: 'Resolved',
        resolution: 'Approved request to purchase 5 additional copies of Database Systems Reference books.',
        date: 'Jul 19, 2026'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('college_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const handleAddComplaint = (newComp) => {
    const complaint = {
      ...newComp,
      id: 'comp_' + Date.now(),
      status: 'Pending',
      resolution: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setComplaints((prev) => [complaint, ...prev]);
    addToast('Complaint submitted successfully!', 'success');
  };

  const handleResolveComplaint = (id, resolution) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved', resolution } : c))
    );
    addToast('Complaint resolved.', 'success');
  };

  // Sync theme attribute to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('college_theme', theme);
  }, [theme]);

  // Load students from Supabase backend API on mount
  useEffect(() => {
    async function fetchBackendStudents() {
      const data = await api.getStudents();
      if (data && Array.isArray(data) && data.length > 0) {
        setStudents(data);
      }
    }
    fetchBackendStudents();
  }, []);

  // Determine User Role (Admin or Normal User/Student/Registrar/Professor)
  useEffect(() => {
    if (!activeEmail) return;

    const lowerEmail = activeEmail.toLowerCase();
    const clerkName = user?.fullName || user?.firstName || (activeEmail.includes('@') ? activeEmail.split('@')[0] : 'User');

    // 1. Admin Access Check
    if (lowerEmail === 'hraj22634@gmail.com' || lowerEmail === 'admin@college.edu' || lowerEmail.includes('admin')) {
      setUserRole('admin');
      setActiveTab('dashboard');
      return;
    }

    // 2. Query Authorized Database Roles
    const matchedRoleEntry = userRoles.find(
      (entry) => entry.email.toLowerCase() === lowerEmail
    );

    if (matchedRoleEntry) {
      if (matchedRoleEntry.role === 'admin') {
        setUserRole('admin');
        setActiveTab('dashboard');
      } else if (matchedRoleEntry.role === 'professor') {
        setUserRole('professor');
        setProfessorDept(matchedRoleEntry.department || 'Computer Science');
      } else if (matchedRoleEntry.role === 'registrar') {
        setUserRole('registrar');
      } else {
        setUserRole('student');
        setStudentPortalId(matchedRoleEntry.detailsId);
        setActiveTab('overview');
      }
      return;
    }

    // 3. Query Student Database by Logged-In Email
    const matchedStudent = students.find(
      (s) => s.email && s.email.toLowerCase() === lowerEmail
    );

    if (matchedStudent) {
      setUserRole('student');
      setStudentPortalId(matchedStudent._id || matchedStudent.id);
      setActiveTab('overview');
      return;
    }

    // 4. Provision / Map profile for logged in user
    const existingAuto = students.find(s => s.email && s.email.toLowerCase() === lowerEmail);
    if (existingAuto) {
      setUserRole('student');
      setStudentPortalId(existingAuto._id || existingAuto.id);
      setActiveTab('overview');
    } else {
      const newStudent = {
        _id: 's_clerk_' + Date.now(),
        name: clerkName,
        rollNumber: 'CS2023' + Math.floor(100 + Math.random() * 899),
        email: activeEmail,
        department: 'Computer Science',
        year: 1,
        semester: 1,
        cgpa: 8.5,
        attendance: 92,
        feeStatus: 'Paid',
        feeAmount: 0,
        courses: ['Database Systems', 'Computer Networks', 'Software Engineering', 'Artificial Intelligence'],
        documents: [
          { name: "High School Marksheet", status: "Verified" },
          { name: "ID Proof / Passport", status: "Verified" },
          { name: "Admissions Letter", status: "Verified" }
        ]
      };
      setStudents((prev) => [newStudent, ...prev]);
      setUserRole('student');
      setStudentPortalId(newStudent._id);
      setActiveTab('overview');
    }
  }, [activeEmail, user, students, userRoles]);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Student Update / Create handler (saves to Supabase DB via backend API)
  const handleSaveStudent = async (studentData) => {
    const exists = students.some(s => s._id === studentData._id || s.id === studentData._id);

    if (exists && studentData._id && !studentData._id.startsWith('s_')) {
      const updated = await api.updateStudent(studentData._id, studentData);
      setStudents((prev) =>
        prev.map((s) => (s._id === studentData._id ? { ...s, ...studentData } : s))
      );
      addToast(`Updated record for student: ${studentData.name}`, 'success');
    } else {
      const savedStudent = await api.createStudent(studentData);
      if (savedStudent && (savedStudent._id || savedStudent.id)) {
        setStudents((prev) => [savedStudent, ...prev]);
        addToast(`Student "${studentData.name}" enrolled & saved to database!`, 'success');
      } else {
        const newStudent = {
          ...studentData,
          _id: 's_' + Date.now()
        };
        setStudents((prev) => [newStudent, ...prev]);
        addToast(`Student "${studentData.name}" enrolled!`, 'success');
      }
    }
    setIsDrawerOpen(false);
    setEditingStudent(null);
  };

  const handleSaveBulkAttendance = (date, course, attendanceMap) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (attendanceMap[s._id]) {
          const status = attendanceMap[s._id];
          const cleanLogs = (s.attendanceLogs || []).filter(
            (log) => !(log.date === date && log.course === course)
          );
          const newLogs = [{ date, course, status }, ...cleanLogs].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          
          const total = newLogs.length;
          const present = newLogs.filter(l => l.status === 'Present' || l.status === 'Late').length;
          const derivedPct = total > 0 ? Math.round((present / total) * 100) : 100;
          
          return {
            ...s,
            attendanceLogs: newLogs,
            attendance: derivedPct
          };
        }
        return s;
      })
    );
    addToast(`Daily attendance logs updated for ${course} on ${date}.`, 'success');
  };

  const handleDeleteStudent = async (id) => {
    const studentToDelete = students.find(s => s._id === id || s.id === id);
    const confirmDelete = window.confirm(`Are you sure you want to remove ${studentToDelete?.name || 'this student'}?`);
    
    if (confirmDelete) {
      await api.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      setUserRoles((prev) => prev.filter((entry) => entry.detailsId !== id));
      addToast(`Student record deleted from database.`, 'error');
    }
  };

  // Approval Pipeline Operations
  const handleRegisterRequestSubmit = (requestData) => {
    const newRequest = {
      id: 'req_' + Date.now(),
      name: requestData.name,
      email: requestData.email,
      desiredRole: requestData.desiredRole,
      department: requestData.department
    };
    setPendingRequests((prev) => [...prev, newRequest]);
    addToast(`Enrollment request submitted!`, 'info');
  };

  const handleApproveRegistration = (reqId, approvalPayload) => {
    const detailsId = 's_' + Date.now();
    const lowerEmail = approvalPayload.email.toLowerCase();

    if (approvalPayload.role === 'student') {
      // 1. Create the Student Profile Record
      const newStudent = {
        _id: detailsId,
        name: approvalPayload.name,
        rollNumber: approvalPayload.rollNumber,
        email: approvalPayload.email,
        department: approvalPayload.department,
        year: approvalPayload.year,
        semester: approvalPayload.semester,
        cgpa: Math.max(6.0, parseFloat(approvalPayload.cgpa) || 6.0),
        attendance: approvalPayload.attendance,
        feeStatus: approvalPayload.feeStatus,
        feeAmount: approvalPayload.feeAmount,
        courses: approvalPayload.courses,
        documents: [
          { name: "High School Marksheet", status: "Verified" },
          { name: "ID Proof / Passport", status: "Submitted" },
          { name: "Admissions Letter", status: "Pending" }
        ]
      };
      setStudents((prev) => [...prev, newStudent]);

      // 2. Add to authorized userRoles mapping
      setUserRoles((prev) => [
        ...prev,
        { email: lowerEmail, role: 'student', detailsId }
      ]);
    } else if (approvalPayload.role === 'professor') {
      // Add as Authorized Professor
      setUserRoles((prev) => [
        ...prev,
        { email: lowerEmail, role: 'professor', department: approvalPayload.department }
      ]);
    } else if (approvalPayload.role === 'registrar') {
      // Add as Authorized Registrar
      setUserRoles((prev) => [
        ...prev,
        { email: lowerEmail, role: 'registrar' }
      ]);
    }

    // Remove from pending Requests queue
    setPendingRequests((prev) => prev.filter((req) => req.id !== reqId));
    addToast(`Approved request for ${approvalPayload.name} as ${approvalPayload.role.toUpperCase()}`, 'success');
  };

  const handleRejectRegistration = (reqId) => {
    setPendingRequests((prev) => prev.filter((req) => req.id !== reqId));
    addToast(`Registration request rejected.`, 'error');
  };

  const openAddDrawer = () => {
    setEditingStudent(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (student) => {
    setEditingStudent(student);
    setIsDrawerOpen(true);
  };

  const openDetailModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Find if user currently has an active request in pending list
  const currentPendingRequest = pendingRequests.find(
    (req) => req.email.toLowerCase() === activeEmail.toLowerCase()
  );


  const renderMainApp = () => {
    return (
      <>
        {/* Case 1: Pending Approval View */}
        {userRole === 'pending' && (
          <PendingApprovalView 
            userEmail={activeEmail}
            requestDetails={currentPendingRequest}
            onSubmitRequest={handleRegisterRequestSubmit}
            devRoleOverride={devRoleOverride}
            setDevRoleOverride={setDevRoleOverride}
          />
        )}

        {/* Case 2: Authenticated College Views */}
        {userRole !== 'pending' && (
          <>
            {/* Sidebar Navigation */}
            {/* Mobile sidebar backdrop */}
            <div 
              className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
              onClick={closeSidebar}
            />

            <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
              <div className="brand">
                <div className="brand-logo">S</div>
                <span className="brand-name" style={{ fontSize: '16px', lineHeight: '1.2' }}>Student Management System</span>
              </div>

              <ul className="menu-list">
                {userRole === 'admin' && (
                  /* Admin Navigation - Full System Control */
                  <>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); closeSidebar(); }}
                      >
                        <LayoutDashboard size={20} />
                        Dashboard
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('students'); closeSidebar(); }}
                      >
                        <Users size={20} />
                        Students Directory
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'professors_directory' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('professors_directory'); closeSidebar(); }}
                      >
                        <BookOpen size={20} />
                        Professors Directory
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'registrars_directory' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('registrars_directory'); closeSidebar(); }}
                      >
                        <CreditCard size={20} />
                        Registrars Directory
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'approvals' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('approvals'); closeSidebar(); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <ShieldAlert size={20} />
                          Approvals
                        </div>
                        {pendingRequests.length > 0 && (
                          <span 
                            className="badge badge-warning" 
                            style={{ 
                              padding: '2px 6px', 
                              fontSize: '10px', 
                              borderRadius: '4px',
                              marginLeft: '8px'
                            }}
                          >
                            {pendingRequests.length}
                          </span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'professor_workspace' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('professor_workspace'); closeSidebar(); }}
                      >
                        <BookOpen size={20} />
                        Faculty &amp; Grading
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'registrar_workspace' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('registrar_workspace'); closeSidebar(); }}
                      >
                        <CreditCard size={20} />
                        Billing &amp; Documents
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'student_portal' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('student_portal'); closeSidebar(); }}
                      >
                        <GraduationCap size={20} />
                        Student Portal Inspector
                      </div>
                    </li>
                  </>
                )}

                {userRole === 'professor' && (
                  /* Professor Navigation Items in Left Column */
                  <>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'performance' || activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('performance'); closeSidebar(); }}
                      >
                        <Award size={20} />
                        Grades &amp; Performance
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('attendance'); closeSidebar(); }}
                      >
                        <ClipboardList size={20} />
                        Log Daily Attendance
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'complaints' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('complaints'); closeSidebar(); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <MessageSquare size={20} />
                          Complaints Desk
                        </div>
                        {complaints.filter(c => c.department === professorDept && c.status === 'Pending').length > 0 && (
                          <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                            {complaints.filter(c => c.department === professorDept && c.status === 'Pending').length}
                          </span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('schedule'); closeSidebar(); }}
                      >
                        <Calendar size={20} />
                        Department Schedule
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'roster' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('roster'); closeSidebar(); }}
                      >
                        <Users size={20} />
                        Faculty &amp; Professors Roster
                      </div>
                    </li>
                  </>
                )}

                {userRole === 'registrar' && (
                  /* Registrar Navigation Items in Left Column */
                  <>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'finance' || activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('finance'); closeSidebar(); }}
                      >
                        <CreditCard size={20} />
                        Finance &amp; Admissions
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'roster' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('roster'); closeSidebar(); }}
                      >
                        <Users size={20} />
                        Registrar Officers Roster
                      </div>
                    </li>
                  </>
                )}

                {userRole === 'student' && (
                  /* Student Navigation with Sub-Sections */
                  <>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('overview'); closeSidebar(); }}
                      >
                        <GraduationCap size={20} />
                        My Portal
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'academics' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('academics'); closeSidebar(); }}
                      >
                        <Award size={18} />
                        Academics
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'timetable' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('timetable'); closeSidebar(); }}
                      >
                        <Calendar size={18} />
                        Class Timetable
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'fees' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('fees'); closeSidebar(); }}
                      >
                        <CreditCard size={18} />
                        Fees & Invoices
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('attendance'); closeSidebar(); }}
                      >
                        <ClipboardList size={18} />
                        Attendance Logs
                      </div>
                    </li>
                    <li>
                      <div 
                        className={`menu-item ${activeTab === 'complaints' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('complaints'); closeSidebar(); }}
                      >
                        <MessageSquare size={18} />
                        Grievance Desk
                      </div>
                    </li>
                  </>
                )}
              </ul>

              {/* Sidebar Footer */}
              <div className="sidebar-footer">
                {userRole === 'student' && (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div>Student Profile:</div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {students.find(s => (s._id === studentPortalId || s.id === studentPortalId))?.name || user?.fullName || user?.firstName || 'Student'}
                    </strong>
                  </div>
                )}
                {userRole === 'professor' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                    Professor ({professorDept})
                  </div>
                )}
                {userRole === 'registrar' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
                    Registrar Office
                  </div>
                )}
                {userRole === 'admin' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                    Admin Mode Active
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-wrapper">
              
              {/* Navbar */}
              <header className="navbar">
                <button 
                  className="hamburger-btn"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle sidebar menu"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <h1 className="page-title">
                  {userRole === 'admin' && activeTab === 'dashboard' && 'Campus Dashboard Overview'}
                  {userRole === 'admin' && activeTab === 'students' && 'Student Directory Matrix'}
                  {userRole === 'admin' && activeTab === 'professors_directory' && 'Faculty & Professors Master Directory'}
                  {userRole === 'admin' && activeTab === 'registrars_directory' && 'Registrar Officers & Desk Roster'}
                  {userRole === 'admin' && activeTab === 'approvals' && 'Registration Requests Queue'}
                  {userRole === 'admin' && activeTab === 'professor_workspace' && 'Faculty & Departmental Grading Control'}
                  {userRole === 'admin' && activeTab === 'registrar_workspace' && 'Admissions Billing Ledger & Documents Control'}
                  {userRole === 'admin' && activeTab === 'student_portal' && 'Student Self-Service Portal Inspector'}
                  {userRole === 'professor' && 'Professor Grading & Attendance Panel'}
                  {userRole === 'registrar' && 'Admissions Billing Ledger & Documents'}
                  {userRole === 'student' && 'Student Self-Service Portal'}
                </h1>

                <div className="nav-actions">
                  <span className="role-badge">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: userRole === 'admin' ? 'var(--success)' : 'var(--accent)' }} />
                    Role: {userRole === 'admin' ? 'Staff Admin' : userRole === 'professor' ? 'Teacher' : userRole === 'registrar' ? 'Registrar' : 'Student'}
                  </span>

                  {/* Notification Bell */}
                  {(() => {
                    // Build notifications list based on role
                    const notifs = [];
                    
                    // Announcements for everyone
                    announcements.slice(0, 5).forEach(a => {
                      notifs.push({
                        id: a.id,
                        type: 'announcement',
                        icon: '📢',
                        title: a.title,
                        subtitle: a.date,
                        priority: a.priority
                      });
                    });

                    // Pending approvals for admin
                    if (userRole === 'admin') {
                      pendingRequests.forEach(req => {
                        notifs.push({
                          id: req.id,
                          type: 'approval',
                          icon: '🔔',
                          title: `New registration: ${req.name}`,
                          subtitle: `Requested ${req.role} access`,
                          priority: 'high'
                        });
                      });
                    }

                    // Pending complaints for professors
                    if (userRole === 'professor') {
                      complaints.filter(c => c.status === 'Pending').forEach(c => {
                        notifs.push({
                          id: c.id,
                          type: 'complaint',
                          icon: '⚠️',
                          title: c.subject,
                          subtitle: `From ${c.studentName} • ${c.date}`,
                          priority: 'medium'
                        });
                      });
                    }

                    // Resolved complaints for students
                    if (userRole === 'student') {
                      complaints.filter(c => c.status === 'Resolved' && c.studentId === studentPortalId).forEach(c => {
                        notifs.push({
                          id: c.id,
                          type: 'resolved',
                          icon: '✅',
                          title: `Resolved: ${c.subject}`,
                          subtitle: c.date,
                          priority: 'low'
                        });
                      });
                    }

                    const unreadCount = notifs.filter(n => !readNotificationIds.includes(n.id)).length;

                    const markAllRead = () => {
                      const allIds = notifs.map(n => n.id);
                      setReadNotificationIds(allIds);
                      localStorage.setItem('college_read_notifications', JSON.stringify(allIds));
                    };

                    return (
                      <div style={{ position: 'relative' }}>
                        <button
                          className="btn-icon"
                          onClick={() => setShowNotifications(!showNotifications)}
                          title="Notifications"
                          style={{ position: 'relative' }}
                        >
                          <Bell size={18} />
                          {unreadCount > 0 && (
                            <span style={{
                              position: 'absolute',
                              top: '-2px',
                              right: '-2px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--danger)',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: '800',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid var(--bg-primary)',
                              animation: 'pulse 2s infinite'
                            }}>
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </button>

                        {showNotifications && (
                          <>
                            <div
                              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                              onClick={() => setShowNotifications(false)}
                            />
                            <div style={{
                              position: 'absolute',
                              top: '44px',
                              right: 0,
                              width: 'min(360px, calc(100vw - 32px))',
                              maxHeight: '420px',
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-lg)',
                              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                              zIndex: 100,
                              overflow: 'hidden',
                              animation: 'fadeIn 0.15s ease'
                            }}>
                              {/* Header */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--border-color)'
                              }}>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  Notifications {unreadCount > 0 && <span style={{ color: 'var(--accent)', fontSize: '12px' }}>({unreadCount} new)</span>}
                                </h4>
                                {unreadCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={markAllRead}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--accent)',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Mark all read
                                  </button>
                                )}
                              </div>

                              {/* Notification List */}
                              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                                {notifs.length === 0 ? (
                                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                    <Bell size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>No notifications yet</p>
                                  </div>
                                ) : (
                                  notifs.map((n) => {
                                    const isUnread = !readNotificationIds.includes(n.id);
                                    return (
                                      <div
                                        key={n.id}
                                        style={{
                                          display: 'flex',
                                          gap: '12px',
                                          alignItems: 'flex-start',
                                          padding: '14px 20px',
                                          borderBottom: '1px solid var(--border-color)',
                                          backgroundColor: isUnread ? 'var(--accent-light)' : 'transparent',
                                          transition: 'background-color 0.15s ease',
                                          cursor: 'default'
                                        }}
                                      >
                                        <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{n.icon}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p style={{
                                            fontSize: '13px',
                                            fontWeight: isUnread ? '700' : '500',
                                            color: 'var(--text-primary)',
                                            margin: '0 0 3px 0',
                                            lineHeight: '1.3',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}>
                                            {n.title}
                                          </p>
                                          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{n.subtitle}</span>
                                        </div>
                                        {isUnread && (
                                          <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--accent)',
                                            flexShrink: 0,
                                            marginTop: '6px'
                                          }} />
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}



                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>

                  <button 
                    className="btn-icon" 
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                </div>
              </header>

              {/* Content Body */}
              <div className="content-body">
                {userRole === 'admin' && activeTab === 'dashboard' && (
                  <>
                    <AnnouncementsBoard 
                      announcements={announcements} 
                      onAddAnnouncement={handleAddAnnouncement}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                      userRole={userRole}
                    />
                    <Dashboard students={students} professors={professors} registrars={registrars} />
                  </>
                )}

                {userRole === 'admin' && activeTab === 'students' && (
                  <StudentTable 
                    students={students}
                    onSelectStudent={openDetailModal}
                    onEditStudent={openEditDrawer}
                    onDeleteStudent={handleDeleteStudent}
                    onAddStudent={openAddDrawer}
                  />
                )}

                {userRole === 'admin' && activeTab === 'professors_directory' && (
                  <ProfessorsDirectory professors={professors} />
                )}

                {userRole === 'admin' && activeTab === 'registrars_directory' && (
                  <RegistrarsDirectory registrars={registrars} />
                )}

                {userRole === 'admin' && activeTab === 'approvals' && (
                  <ApprovalsQueue 
                    pendingApprovals={pendingRequests}
                    onApprove={handleApproveRegistration}
                    onReject={handleRejectRegistration}
                  />
                )}

                {userRole === 'admin' && activeTab === 'professor_workspace' && (
                  <ProfessorWorkspace 
                    students={students}
                    department={professorDept}
                    onUpdatePerformance={handleSaveStudent}
                    onUpdateBulkAttendance={handleSaveBulkAttendance}
                    complaints={complaints}
                    onResolveComplaint={handleResolveComplaint}
                    userRole={userRole}
                    professors={professors}
                  />
                )}

                {userRole === 'admin' && activeTab === 'registrar_workspace' && (
                  <RegistrarWorkspace 
                    students={students}
                    onUpdateBilling={handleSaveStudent}
                    onUpdateDocuments={handleSaveStudent}
                    userRole={userRole}
                    registrars={registrars}
                  />
                )}

                {userRole === 'admin' && activeTab === 'student_portal' && (
                  <StudentPortal 
                    students={students} 
                    initialStudentId={studentPortalId}
                    complaints={complaints}
                    onAddComplaint={handleAddComplaint}
                    activeSection="overview"
                    userRole={userRole}
                  />
                )}

                {userRole === 'professor' && (
                  <>
                    <AnnouncementsBoard 
                      announcements={announcements} 
                      onAddAnnouncement={handleAddAnnouncement}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                      userRole={userRole}
                    />
                    <ProfessorWorkspace 
                      students={students}
                      department={professorDept}
                      onUpdatePerformance={handleSaveStudent}
                      onUpdateBulkAttendance={handleSaveBulkAttendance}
                      complaints={complaints}
                      onResolveComplaint={handleResolveComplaint}
                      userRole={userRole}
                      professors={professors}
                      activeSection={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </>
                )}

                {userRole === 'registrar' && (
                  <>
                    <AnnouncementsBoard 
                      announcements={announcements} 
                      onAddAnnouncement={handleAddAnnouncement}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                      userRole={userRole}
                    />
                    <RegistrarWorkspace 
                      students={students}
                      onUpdateBilling={handleSaveStudent}
                      onUpdateDocuments={handleSaveStudent}
                      userRole={userRole}
                      registrars={registrars}
                      activeSection={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </>
                )}

                {userRole === 'student' && (
                  <>
                    {activeTab === 'overview' && (
                      <AnnouncementsBoard 
                        announcements={announcements} 
                        onAddAnnouncement={handleAddAnnouncement}
                        onDeleteAnnouncement={handleDeleteAnnouncement}
                        userRole={userRole}
                      />
                    )}
                    <StudentPortal 
                      students={students} 
                      initialStudentId={studentPortalId}
                      complaints={complaints}
                      onAddComplaint={handleAddComplaint}
                      activeSection={activeTab}
                      userRole={userRole}
                    />
                  </>
                )}
              </div>
            </main>

            {/* Modals & Sliding Drawers */}
            <StudentDetailModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              student={selectedStudent}
            />

            <StudentFormDrawer 
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                setEditingStudent(null);
              }}
              onSave={handleSaveStudent}
              student={editingStudent}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <SignedOut>
        <LoginView />
      </SignedOut>

      <SignedIn>
        {renderMainApp()}
      </SignedIn>

      {/* Toast Overlay Notification System */}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
            <span className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </span>
          </div>
        ))}
      </div>
    </>
  );

}

export default App;
