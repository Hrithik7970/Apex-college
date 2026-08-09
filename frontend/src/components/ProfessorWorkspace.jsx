import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, AlertTriangle, Edit3, X, Calendar, CheckSquare, Users, MessageSquare, Clock } from 'lucide-react';
import { COURSES_BY_DEPT, generateWeeklySchedule } from '../mockData';

export default function ProfessorWorkspace({ 
  students = [], 
  department = 'Computer Science', 
  onUpdatePerformance,
  onUpdateBulkAttendance,
  complaints = [],
  onResolveComplaint
}) {
  // Filter students to only show the professor's department
  const deptStudents = students.filter(s => s.department === department);
  
  // Calculate department KPIs
  const totalStudents = deptStudents.length;
  const avgCgpa = totalStudents > 0
    ? (deptStudents.reduce((acc, curr) => acc + curr.cgpa, 0) / totalStudents).toFixed(2)
    : '0.00';
    
  const riskStudents = deptStudents.filter(s => s.attendance < 75);
  const attendanceWarningCount = riskStudents.length;

  const courses = COURSES_BY_DEPT[department] || [];

  // Tab controls
  const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'attendance' | 'complaints'

  // Performance Edit State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [cgpa, setCgpa] = useState(0.0);
  const [attendance, setAttendance] = useState(100);

  // Daily Attendance Marker States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState(courses[0] || '');
  const [attendanceStatuses, setAttendanceStatuses] = useState({});

  // Weekly Timetable States
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const getTodayDayString = () => {
    const dayIndex = new Date().getDay();
    if (dayIndex >= 1 && dayIndex <= 5) return daysOfWeek[dayIndex - 1];
    return "Monday";
  };
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(getTodayDayString());

  const deptSchedule = generateWeeklySchedule(department, courses);
  const activeDaySchedule = deptSchedule ? deptSchedule[selectedScheduleDay] : [];

  // Complaint Resolution States
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  // Filter complaints for this department
  const deptComplaints = complaints.filter(c => c.department === department);
  const pendingComplaintsCount = deptComplaints.filter(c => c.status === 'Pending').length;

  // Sync attendance state when date/course changes
  useEffect(() => {
    const initialStatuses = {};
    deptStudents.forEach(s => {
      const existingLog = (s.attendanceLogs || []).find(
        log => log.date === selectedDate && log.course === selectedCourse
      );
      initialStatuses[s._id] = existingLog ? existingLog.status : 'Present';
    });
    setAttendanceStatuses(initialStatuses);
  }, [selectedDate, selectedCourse, students]);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setCgpa(student.cgpa);
    setAttendance(student.attendance);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...selectedStudent,
      cgpa: parseFloat(cgpa) || 0.0,
      attendance: parseInt(attendance, 10) || 0
    };
    onUpdatePerformance(updatedData);
    setSelectedStudent(null);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = () => {
    if (!selectedCourse) return;
    onUpdateBulkAttendance(selectedDate, selectedCourse, attendanceStatuses);
  };

  const openResolveModal = (complaint) => {
    setSelectedComplaint(complaint);
    setResolutionText(complaint.resolution || '');
  };

  const handleComplaintResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolutionText.trim()) return;

    onResolveComplaint(selectedComplaint.id, resolutionText.trim());
    setSelectedComplaint(null);
    setResolutionText('');
  };

  return (
    <div className="professor-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Welcome Banner */}
      <div className="metric-card" style={{ marginBottom: '32px', backgroundColor: 'var(--bg-secondary)', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Academic Portal: {department} Department</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          You have access to manage grades (GPA) and log attendance logs for students enrolled in your department.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid" style={{ marginBottom: '32px' }}>
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Enrolled in {department}</span>
            <span className="metric-value">{totalStudents}</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Award size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Department Avg CGPA</span>
            <span className="metric-value" style={{ color: 'var(--success)' }}>{avgCgpa}</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Low Attendance Alerts</span>
            <span className="metric-value" style={{ color: attendanceWarningCount > 0 ? 'var(--danger)' : 'inherit' }}>
              {attendanceWarningCount}
            </span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: attendanceWarningCount > 0 ? 'var(--danger-light)' : 'var(--bg-tertiary)', color: attendanceWarningCount > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: '100%', maxWidth: 'fit-content' }}>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            backgroundColor: activeTab === 'performance' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'performance' ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('performance')}
        >
          Grades &amp; Performance
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            backgroundColor: activeTab === 'attendance' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'attendance' ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('attendance')}
        >
          Log Daily Attendance
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'complaints' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'complaints' ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('complaints')}
        >
          Complaints Desk
          {pendingComplaintsCount > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--warning)', color: 'var(--warning-text)' }}>
              {pendingComplaintsCount}
            </span>
          )}
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            backgroundColor: activeTab === 'schedule' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'schedule' ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('schedule')}
        >
          Department Schedule
        </button>
      </div>

      {/* TAB 1: Performance/Grades Grid */}
      {activeTab === 'performance' && (
        <div className="table-container">
          <div className="chart-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="chart-title">Student Performance List ({department})</h3>
          </div>

          {deptStudents.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No Students Registered</p>
              <p className="empty-desc">There are no approved students enrolled in your department yet.</p>
            </div>
          ) : (
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Academic Year</th>
                  <th>GPA</th>
                  <th>Attendance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deptStudents.map(student => {
                  const initials = student.name.split(' ').map(n=>n[0]).join('');
                  return (
                    <tr key={student._id}>
                      <td>
                        <div className="student-profile-cell">
                          <div className="avatar">{initials}</div>
                          <div>
                            <div className="student-name">{student.name}</div>
                            <div className="student-meta">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{student.rollNumber}</strong></td>
                      <td>Year {student.year} (Sem {student.semester})</td>
                      <td style={{ fontWeight: '700' }}>{student.cgpa.toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${student.attendance >= 75 ? 'badge-success' : 'badge-danger'}`} style={{ width: '45px', justifyContent: 'center' }}>
                            {student.attendance}%
                          </span>
                          <div className="attendance-progress-bar">
                            <div 
                              className="attendance-progress-fill" 
                              style={{ 
                                width: `${student.attendance}%`,
                                backgroundColor: student.attendance >= 75 ? 'var(--success)' : 'var(--danger)'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button 
                            className="btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                            onClick={() => openEditModal(student)}
                          >
                            <Edit3 size={13} /> Update Performance
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: Daily Attendance marker */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.25s ease' }}>
          
          {/* Lecture Settings controls */}
          <div className="chart-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Lecture Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', fontSize: '14px', padding: '10px', backgroundColor: 'var(--bg-primary)' }}
              />
            </div>
            
            <div style={{ flex: 1.5, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Subject / Course</label>
              <select 
                className="select-filter" 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ width: '100%', fontSize: '14px', padding: '10px', backgroundColor: 'var(--bg-primary)' }}
              >
                {courses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student list daily marker grid */}
          <div className="table-container">
            <div className="chart-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 className="chart-title">Attendance Logging Sheet</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Log session records for {selectedCourse} on {selectedDate}</p>
              </div>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleSubmitAttendance}
                style={{ backgroundColor: 'var(--success)' }}
              >
                Submit Daily Attendance
              </button>
            </div>

            {deptStudents.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">No Students Registered</p>
                <p className="empty-desc">There are no approved students enrolled in your department yet.</p>
              </div>
            ) : (
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Student Profile</th>
                    <th>Roll Number</th>
                    <th>Lecture Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStudents.map(student => {
                    const initials = student.name.split(' ').map(n=>n[0]).join('');
                    const currentStatus = attendanceStatuses[student._id] || 'Present';
                    
                    return (
                      <tr key={student._id}>
                        <td>
                          <div className="student-profile-cell">
                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '13px' }}>{initials}</div>
                            <div>
                              <div className="student-name" style={{ fontSize: '14px' }}>{student.name}</div>
                              <div className="student-meta">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><strong>{student.rollNumber}</strong></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student._id, 'Present')}
                              style={{
                                padding: '6px 14px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                backgroundColor: currentStatus === 'Present' ? 'var(--success-light)' : 'var(--bg-secondary)',
                                color: currentStatus === 'Present' ? 'var(--success-text)' : 'var(--text-secondary)',
                                borderColor: currentStatus === 'Present' ? 'var(--success)' : 'var(--border-color)'
                              }}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student._id, 'Absent')}
                              style={{
                                padding: '6px 14px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                backgroundColor: currentStatus === 'Absent' ? 'var(--danger-light)' : 'var(--bg-secondary)',
                                color: currentStatus === 'Absent' ? 'var(--danger-text)' : 'var(--text-secondary)',
                                borderColor: currentStatus === 'Absent' ? 'var(--danger)' : 'var(--border-color)'
                              }}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student._id, 'Late')}
                              style={{
                                padding: '6px 14px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                backgroundColor: currentStatus === 'Late' ? 'var(--warning-light)' : 'var(--bg-secondary)',
                                color: currentStatus === 'Late' ? 'var(--warning-text)' : 'var(--text-secondary)',
                                borderColor: currentStatus === 'Late' ? 'var(--warning)' : 'var(--border-color)'
                              }}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Student Complaints review panel */}
      {activeTab === 'complaints' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.25s ease' }}>
          
          <div className="table-container">
            <div className="chart-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="chart-title">Student Grievances &amp; Complaints</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Review and resolve issues filed by students in the {department} department</p>
              </div>
              <span className="badge badge-warning">
                {pendingComplaintsCount} Pending Review
              </span>
            </div>

            {deptComplaints.length === 0 ? (
              <div className="empty-state" style={{ padding: '48px' }}>
                <p className="empty-title">All Clear!</p>
                <p className="empty-desc">No complaints have been filed by students in your department.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Student Details</th>
                      <th>Grievance Subject</th>
                      <th>Date Filed</th>
                      <th>Status Tag</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptComplaints.map(comp => {
                      return (
                        <tr key={comp.id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{comp.studentName}</strong>
                              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Roll: {comp.studentRoll}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
                              <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{comp.subject}</strong>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={comp.description}>
                                {comp.description}
                              </p>
                            </div>
                          </td>
                          <td style={{ fontSize: '12.5px' }}>{comp.date}</td>
                          <td>
                            <span className={`badge ${comp.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>
                              {comp.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => openResolveModal(comp)}
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '12.5px',
                                backgroundColor: comp.status === 'Resolved' ? 'var(--bg-tertiary)' : 'var(--accent)',
                                color: comp.status === 'Resolved' ? 'var(--text-primary)' : 'white',
                                border: comp.status === 'Resolved' ? '1px solid var(--border-color)' : 'none',
                                boxShadow: 'none'
                              }}
                            >
                              {comp.status === 'Resolved' ? 'View Details' : 'Write Response'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Edit Performance Modal */}
      {selectedStudent && (
        <div className="modal-overlay open" onClick={() => setSelectedStudent(null)}>
          <form className="modal-container" onClick={(e) => e.stopPropagation()} onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h3 className="page-title">Update Performance: {selectedStudent.name}</h3>
              <button type="button" className="btn-icon" onClick={() => setSelectedStudent(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '13.5px' }}>
                <div>Roll: <strong>{selectedStudent.rollNumber}</strong></div>
                <div>•</div>
                <div>Year: <strong>Year {selectedStudent.year} (Sem {selectedStudent.semester})</strong></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cumulative GPA (CGPA)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    className="form-control"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Overall Attendance (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="form-control"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={() => setSelectedStudent(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Academic Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resolve / View Complaint Modal */}
      {selectedComplaint && (
        <div className="modal-overlay open" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="page-title">Grievance Review</h3>
              <button type="button" className="btn-icon" onClick={() => setSelectedComplaint(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                <p style={{ margin: '0 0 6px 0' }}>Student: <strong>{selectedComplaint.studentName} ({selectedComplaint.studentRoll})</strong></p>
                <p style={{ margin: 0 }}>Date: <strong>{selectedComplaint.date}</strong></p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Subject</label>
                <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>{selectedComplaint.subject}</strong>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Detailed Description</label>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.status === 'Resolved' ? (
                <div style={{ padding: '16px', backgroundColor: 'var(--success-light)', borderLeft: '4px solid var(--success)', borderRadius: '4px', marginTop: '10px' }}>
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--success-text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Resolution Response:</span>
                  <p style={{ fontSize: '13px', color: 'var(--success-text)', margin: 0, lineHeight: '1.4' }}>{selectedComplaint.resolution}</p>
                </div>
              ) : (
                <form onSubmit={handleComplaintResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>Write Resolution / Response *</label>
                    <textarea 
                      className="input-field" 
                      placeholder="Explain the solution or feedback you want to send back to the student..." 
                      rows="4"
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      required
                      style={{ width: '100%', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', backgroundColor: 'var(--bg-primary)' }}
                    />
                  </div>
                  <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '8px' }}>
                    <button type="button" className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={() => setSelectedComplaint(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--success)' }}>
                      Resolve &amp; Send Feedback
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
      {/* TAB 4: Department Class Schedule */}
      {activeTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.25s ease' }}>
          <div className="chart-card">
            <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} style={{ color: 'var(--accent)' }} />
                <div>
                  <h3 className="chart-title">Weekly Lecture Timetable ({department} branch)</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>Daily lectures are 55 minutes each with a 1 hour recess break. Classes start at 09:15 AM.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedScheduleDay(day)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: selectedScheduleDay === day ? 'var(--accent)' : 'transparent',
                      color: selectedScheduleDay === day ? 'white' : 'var(--text-secondary)'
                    }}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {activeDaySchedule.map((slot, idx) => {
                const isLunch = slot.isBreak;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: isLunch ? 'var(--warning-light)' : 'var(--bg-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isLunch && (
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: 'var(--warning)' }} />
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: isLunch ? 'var(--warning-text)' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {slot.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {slot.time}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: isLunch ? 'var(--warning-text)' : 'var(--text-primary)' }}>
                      {slot.subject}
                    </h4>

                    {!isLunch && (
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Duration: 55 mins
                      </span>
                    )}
                    {isLunch && (
                      <span style={{ fontSize: '11px', color: 'var(--warning-text)' }}>
                        Duration: 1 hour break
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
