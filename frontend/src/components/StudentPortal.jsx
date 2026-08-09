import React, { useState } from 'react';
import { Mail, BookOpen, Award, CreditCard, AlertTriangle, Calendar, FileText, CheckCircle, MessageSquare, Send, Clock } from 'lucide-react';
import { generateWeeklySchedule } from '../mockData';

export default function StudentPortal({ students = [], complaints = [], onAddComplaint, activeSection = 'overview' }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?._id || '');

  const activeStudent = students.find(s => s._id === selectedStudentId);
  
  // Complaint form states
  const [compSubject, setCompSubject] = useState('');
  const [compDesc, setCompDesc] = useState('');

  const handleDownloadReportCard = (student) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Convert CGPA to letter grades
    const getGradeFromCgpa = (cgpaValue) => {
      if (cgpaValue >= 9.0) return { letter: 'A+', points: 10 };
      if (cgpaValue >= 8.0) return { letter: 'A', points: 9 };
      if (cgpaValue >= 7.0) return { letter: 'B+', points: 8 };
      if (cgpaValue >= 6.0) return { letter: 'B', points: 7 };
      if (cgpaValue >= 5.0) return { letter: 'C', points: 6 };
      return { letter: 'D', points: 5 };
    };

    const coursesRows = (student.courses || []).map((course, idx) => {
      const offset = (idx % 2 === 0 ? 0.3 : -0.4);
      let subjectCgpa = student.cgpa + offset;
      subjectCgpa = Math.max(4.0, Math.min(10.0, subjectCgpa));
      const gradeInfo = getGradeFromCgpa(subjectCgpa);
      return `
        <tr>
          <td>CS-${300 + idx * 10}</td>
          <td style="font-weight: 600;">${course}</td>
          <td>4</td>
          <td style="font-weight: 700; color: #4f46e5;">${gradeInfo.letter}</td>
          <td>${gradeInfo.points}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Apex College Academic Transcript - ${student.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            padding: 40px;
            background-color: white;
            line-height: 1.5;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px double #6366f1;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .college-logo {
            font-size: 28px;
            font-weight: 900;
            color: white;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            width: 54px;
            height: 54px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: -1px;
          }
          .title-area {
            text-align: right;
          }
          .title-area h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .title-area p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .student-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .meta-group p {
            margin: 6px 0;
            font-size: 13.5px;
          }
          .meta-group strong {
            color: #0f172a;
          }
          .meta-group span {
            color: #64748b;
            display: inline-block;
            width: 110px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 2px solid #cbd5e1;
          }
          td {
            padding: 14px 12px;
            font-size: 13.5px;
            border-bottom: 1px solid #e2e8f0;
          }
          .summary-sec {
            display: flex;
            justify-content: space-around;
            background-color: #f8fafc;
            border: 1.5px solid #cbd5e1;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 50px;
          }
          .summary-box {
            text-align: center;
          }
          .summary-val {
            font-size: 30px;
            font-weight: 800;
            color: #4f46e5;
            margin-bottom: 4px;
          }
          .summary-label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .sign-area {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
          }
          .signature {
            border-top: 1.5px dashed #cbd5e1;
            width: 220px;
            text-align: center;
            padding-top: 10px;
            font-size: 12.5px;
            font-weight: 600;
            color: #475569;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="college-logo">A</div>
          <div class="title-area">
            <h1>APEX TECH COLLEGE</h1>
            <p>Official Grade Report Card</p>
          </div>
        </div>

        <div class="student-meta">
          <div class="meta-group">
            <p><span>Student Name:</span> <strong>${student.name}</strong></p>
            <p><span>Roll Number:</span> <strong>${student.rollNumber}</strong></p>
            <p><span>Department:</span> <strong>${student.department}</strong></p>
          </div>
          <div class="meta-group" style="text-align: right;">
            <p><span style="width:auto;">Semester:</span> <strong>Sem ${student.semester}</strong></p>
            <p><span style="width:auto;">Academic Year:</span> <strong>Year ${student.year}</strong></p>
            <p><span style="width:auto;">Date of Issue:</span> <strong>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th>Letter Grade</th>
              <th>Grade Points</th>
            </tr>
          </thead>
          <tbody>
            ${coursesRows}
          </tbody>
        </table>

        <div class="summary-sec">
          <div class="summary-box">
            <div class="summary-val">${student.cgpa.toFixed(2)}</div>
            <div class="summary-label">Cumulative GPA</div>
          </div>
          <div class="summary-box">
            <div class="summary-val">${student.attendance}%</div>
            <div class="summary-label">Term Attendance</div>
          </div>
          <div class="summary-box">
            <div class="summary-val">Sem ${student.semester}</div>
            <div class="summary-label">Active Term</div>
          </div>
        </div>

        <div class="sign-area">
          <div class="signature">Academic Registrar Office</div>
          <div class="signature">College Seal & Director</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!compSubject.trim() || !compDesc.trim()) return;

    onAddComplaint({
      studentId: activeStudent._id,
      studentName: activeStudent.name,
      studentRoll: activeStudent.rollNumber,
      department: activeStudent.department,
      subject: compSubject.trim(),
      description: compDesc.trim()
    });

    setCompSubject('');
    setCompDesc('');
  };

  // Helper: generate mock SGPAs for past semesters
  const getMockSemesterSgpas = (student) => {
    const sem = student.semester;
    const cgpa = student.cgpa;
    const sgpas = [];
    
    // Seed random numbers based on student name length so it's deterministic
    const seed = student.name.length;
    for (let i = 1; i <= sem; i++) {
      let sgpa = cgpa + (Math.sin(i * seed) * 0.4);
      sgpa = Math.max(4.0, Math.min(10.0, sgpa)); // Clamp between 4 and 10
      sgpas.push({ semester: `Sem ${i}`, sgpa: parseFloat(sgpa.toFixed(2)) });
    }
    return sgpas;
  };

  // Calculate subject-wise attendance metrics dynamically from attendanceLogs
  const getSubjectAttendanceFromLogs = (student) => {
    const courses = student.courses || [];
    const logs = student.attendanceLogs || [];
    
    return courses.map(course => {
      const courseLogs = logs.filter(log => log.course === course);
      const totalHours = courseLogs.length || 15; // default lectures if empty
      const presentHours = courseLogs.length > 0 
        ? courseLogs.filter(log => log.status === 'Present' || log.status === 'Late').length
        : Math.round(0.85 * 15); // seed realistic value if no log
      const subAtt = Math.round((presentHours / totalHours) * 100);
      
      return {
        subject: course,
        attendance: subAtt,
        hoursAttended: presentHours,
        totalHours: totalHours
      };
    });
  };

  const sgpas = activeStudent ? getMockSemesterSgpas(activeStudent) : [];
  const subjectAttendance = activeStudent ? getSubjectAttendanceFromLogs(activeStudent) : [];
  const studentComplaints = activeStudent ? complaints.filter(c => c.studentId === activeStudent._id) : [];

  // Schedule configurations
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const getTodayDayString = () => {
    const dayIndex = new Date().getDay();
    if (dayIndex >= 1 && dayIndex <= 5) return daysOfWeek[dayIndex - 1];
    return "Monday";
  };
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(getTodayDayString());

  const branchSchedule = activeStudent 
    ? generateWeeklySchedule(activeStudent.department, activeStudent.courses)
    : null;
    
  const activeDaySchedule = branchSchedule ? branchSchedule[selectedScheduleDay] : [];

  // SGPA Trend Line Chart Dimensions
  const chartHeight = 150;
  const chartWidth = 420;
  const padding = 35;
  
  // Calculate SVG line path for SGPAs
  const getLinePath = () => {
    if (sgpas.length <= 1) return '';
    const xSpacing = (chartWidth - 2 * padding) / (sgpas.length - 1);
    
    return sgpas.map((item, index) => {
      const x = padding + index * xSpacing;
      // Map SGPA (4 to 10 scale) to SVG Y (chartHeight - padding to padding)
      const y = chartHeight - padding - ((item.sgpa - 4) / 6) * (chartHeight - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Calculate SVG closed area path for the gradient fill under the line
  const getAreaPath = () => {
    const linePath = getLinePath();
    if (!linePath) return '';
    const xSpacing = (chartWidth - 2 * padding) / (sgpas.length - 1);
    const xFirst = padding;
    const xLast = padding + (sgpas.length - 1) * xSpacing;
    const yBottom = chartHeight - padding;
    return `${linePath} L ${xLast} ${yBottom} L ${xFirst} ${yBottom} Z`;
  };

  return (
    <div className="student-portal-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Student Selector Bar */}
      <div className="directory-controls" style={{ marginBottom: '32px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>Simulate Student Portal</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Select a student profile below to enter their personal portal dashboard.</p>
        </div>
        <div>
          <select
            className="select-filter"
            style={{ fontWeight: '700', borderColor: 'var(--accent)', padding: '12px 20px' }}
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
            ))}
          </select>
        </div>
      </div>

      {!activeStudent ? (
        <div className="empty-state">
          <h3 className="empty-title">No Students Registered</h3>
          <p className="empty-desc">Register students in the administrative dashboard to view the student portal.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* SECTION: Overview - Welcome Banner + Metrics */}
          {activeSection === 'overview' && (
          <>
          {/* Welcome Banner Card */}
          <div className="metric-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'flex-start', alignItems: 'center', padding: '32px' }}>
            <div className="profile-avatar" style={{ width: '72px', height: '72px', fontSize: '28px' }}>
              {activeStudent.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>Welcome back, {activeStudent.name}!</h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <span>Roll: <strong>{activeStudent.rollNumber}</strong></span>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span>Branch: <strong>{activeStudent.department}</strong></span>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span>Sem: <strong>{activeStudent.semester} (Year {activeStudent.year})</strong></span>
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
              <div className="role-badge" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-text)', fontSize: '13px' }}>
                <CheckCircle size={15} /> Active Profile Status
              </div>
              <button 
                type="button"
                onClick={() => handleDownloadReportCard(activeStudent)}
                className="btn-primary" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 16px', 
                  fontSize: '13px', 
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                <FileText size={16} /> Download Report Card
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">Cumulative GPA</span>
                <span className="metric-value" style={{ color: 'var(--accent)' }}>{activeStudent.cgpa.toFixed(2)}</span>
              </div>
              <div className="metric-icon-box" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <Award size={24} />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">Registered Courses</span>
                <span className="metric-value">{activeStudent.courses?.length || 0}</span>
              </div>
              <div className="metric-icon-box" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                <BookOpen size={24} />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">Semester Attendance</span>
                <span className="metric-value" style={{ color: activeStudent.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                  {activeStudent.attendance}%
                </span>
              </div>
              <div className="metric-icon-box" style={{ backgroundColor: activeStudent.attendance >= 75 ? 'var(--success-light)' : 'var(--danger-light)', color: activeStudent.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                {activeStudent.attendance >= 75 ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">Fees Ledger Balance</span>
                <span className="metric-value" style={{ color: activeStudent.feeStatus === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
                  {activeStudent.feeStatus === 'Paid' ? 'No Dues' : `₹${activeStudent.feeAmount.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="metric-icon-box" style={{ backgroundColor: activeStudent.feeStatus === 'Paid' ? 'var(--success-light)' : 'var(--warning-light)', color: activeStudent.feeStatus === 'Paid' ? 'var(--success)' : 'var(--warning)' }}>
                <CreditCard size={24} />
              </div>
            </div>
          </div>
          </>
          )}

          {/* SECTION: Academics - SGPA Chart + Subject Attendance */}
          {activeSection === 'academics' && (
          <div className="charts-grid">
            
            {/* GPA Track Line Chart with Gradient Fill */}
            <div className="chart-card">
              <h3 className="chart-title">Academic SGPA Performance Curve</h3>
              {sgpas.length === 1 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Performance trends will populate once Semester 2 starts.</p>
                </div>
              ) : (
                <div className="svg-container" style={{ minHeight: '180px' }}>
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis Guidelines */}
                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4" />
                    <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border-color)" strokeWidth={1} />
                    
                    <text x={padding - 8} y={padding + 4} textAnchor="end" fontSize="9.5" fontWeight="600" fill="var(--text-tertiary)">10.0</text>
                    <text x={padding - 8} y={chartHeight - padding + 4} textAnchor="end" fontSize="9.5" fontWeight="600" fill="var(--text-tertiary)">4.0</text>

                    {/* Gradient Area Fill under the curve */}
                    <path
                      d={getAreaPath()}
                      fill="url(#gpaGradient)"
                    />

                    {/* Connecting Stroke Line */}
                    <path
                      d={getLinePath()}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Graph Nodes */}
                    {sgpas.map((item, idx) => {
                      const xSpacing = (chartWidth - 2 * padding) / (sgpas.length - 1);
                      const x = padding + idx * xSpacing;
                      const y = chartHeight - padding - ((item.sgpa - 4) / 6) * (chartHeight - 2 * padding);
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="5" fill="var(--accent)" stroke="var(--bg-secondary)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }} />
                          {/* Value on Node */}
                          <text x={x} y={y - 12} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="var(--text-primary)">
                            {item.sgpa}
                          </text>
                          {/* X-axis title */}
                          <text x={x} y={chartHeight - padding + 18} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--text-secondary)">
                            Sem {idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

            {/* Subject Attendance Breakdown */}
            <div className="chart-card">
              <h3 className="chart-title">Subject Attendance Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {subjectAttendance.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.subject}</span>
                      <span style={{ fontWeight: '700', color: item.attendance < 75 ? 'var(--danger)' : 'var(--success)' }}>
                        {item.attendance}% <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>({item.hoursAttended}/{item.totalHours} lectures)</span>
                      </span>
                    </div>
                    <div className="attendance-progress-bar" style={{ width: '100%', height: '8px' }}>
                      <div 
                        className="attendance-progress-fill" 
                        style={{ 
                          width: `${item.attendance}%`, 
                          backgroundColor: item.attendance >= 75 ? 'var(--success)' : 'var(--danger)' 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          )}

          {/* SECTION: Timetable */}
          {activeSection === 'timetable' && (
          <div className="chart-card">
            <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} style={{ color: 'var(--accent)' }} />
                <div>
                  <h3 className="chart-title">Weekly Class Timetable ({activeStudent.department} branch)</h3>
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
          )}

          {/* SECTION: Fees */}
          {activeSection === 'fees' && (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Outstanding Tuition Invoices</h3>
              <span className={`badge ${
                activeStudent.feeStatus === 'Paid' ? 'badge-success' : 
                activeStudent.feeStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
              }`}>
                {activeStudent.feeStatus === 'Paid' ? 'Fee Cleared' : 'Dues Outstanding'}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div>
                  <span className="profile-detail-label">Active Invoice Description</span>
                  <p style={{ fontSize: '15px', fontWeight: '700', marginTop: '6px', color: 'var(--text-primary)' }}>Semester {activeStudent.semester} Academic Term Tuition Fee</p>
                </div>
                <div>
                  <span className="profile-detail-label">Account Balance</span>
                  <p style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px', color: activeStudent.feeStatus === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
                    ₹{(activeStudent.feeStatus === 'Paid' ? 0 : activeStudent.feeAmount).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {activeStudent.feeStatus !== 'Paid' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger-text)', backgroundColor: 'var(--danger-light)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '13.5px', fontWeight: '600' }}>
                  <AlertTriangle size={18} /> Please clear dues before final semester exams.
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-text)', backgroundColor: 'var(--success-light)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '13.5px', fontWeight: '600' }}>
                  <CheckCircle size={18} /> No outstanding balance invoices found.
                </div>
              )}

            </div>
          </div>
          )}

          {/* SECTION: Attendance Logs */}
          {activeSection === 'attendance' && (
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Daily Lecture Attendance History</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>Inspect date-wise lecture check-in records</p>
              </div>
              <span className="badge badge-success">
                {activeStudent.attendanceLogs?.length || 0} Sessions Tracked
              </span>
            </div>

            {(!activeStudent.attendanceLogs || activeStudent.attendanceLogs.length === 0) ? (
              <div className="empty-state" style={{ padding: '24px' }}>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>No lecture attendance records found.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <table className="responsive-table" style={{ border: 'none', margin: 0 }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '12px 16px', fontSize: '12px' }}>Lecture Date</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px' }}>Course / Subject</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px', textAlign: 'right' }}>Status Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStudent.attendanceLogs.map((log, index) => {
                      let tagClass = 'badge-success';
                      if (log.status === 'Absent') tagClass = 'badge-danger';
                      if (log.status === 'Late') tagClass = 'badge-warning';

                      return (
                        <tr key={index}>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>{log.date}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>{log.course}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right' }}>
                            <span className={`badge ${tagClass}`} style={{ minWidth: '70px', justifyContent: 'center' }}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}

          {/* SECTION: Complaints */}
          {activeSection === 'complaints' && (
          <div className="chart-card">
            <div className="chart-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="chart-title">Grievance &amp; Complaint Desk</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>Submit issues directly to your branch professors and track resolution feedback</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', marginTop: '24px' }} className="complaints-grid">
              {/* Form to submit a new complaint */}
              <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>File a New Grievance</h4>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>Complaint Subject</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Lab server unreachable / grades issue"
                    value={compSubject}
                    onChange={(e) => setCompSubject(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '13px', backgroundColor: 'var(--bg-secondary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>Detailed Description</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Describe the issue in detail so professors can resolve it..." 
                    rows="4"
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', backgroundColor: 'var(--bg-secondary)' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '13.5px', marginTop: '8px' }}
                >
                  <Send size={14} /> Submit Complaint
                </button>
              </form>

              {/* List of past complaints */}
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>Your Grievance History</h4>
                
                {studentComplaints.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', border: '1.5px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>No issues logged yet. Your filed grievances will appear here.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '350px', overflowY: 'auto' }}>
                    {studentComplaints.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ 
                          padding: '16px', 
                          backgroundColor: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.subject}</strong>
                          <span className={`badge ${item.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '11px' }}>
                            {item.status}
                          </span>
                        </div>
                        
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{item.description}</p>
                        
                        {item.status === 'Resolved' && item.resolution && (
                          <div style={{ padding: '12px', backgroundColor: 'var(--success-light)', borderLeft: '3px solid var(--success)', borderRadius: '4px', marginTop: '4px' }}>
                            <span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--success-text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Professor Response:</span>
                            <p style={{ fontSize: '12.5px', color: 'var(--success-text)', margin: 0, lineHeight: '1.4' }}>{item.resolution}</p>
                          </div>
                        )}
                        
                        <span style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>Filed on: {item.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

        </div>
      )}

    </div>
  );
}
