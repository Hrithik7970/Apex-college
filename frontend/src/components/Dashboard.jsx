import React from 'react';
import { Users, GraduationCap, AlertTriangle, CreditCard } from 'lucide-react';
import { DEPARTMENTS } from '../mockData';

export default function Dashboard({ students = [] }) {
  // 1. Calculations for Metric Cards
  const totalStudents = students.length;
  
  const avgCgpa = totalStudents > 0
    ? (students.reduce((acc, curr) => acc + curr.cgpa, 0) / totalStudents).toFixed(2)
    : '0.00';
    
  const riskStudents = students.filter(s => s.attendance < 75);
  const attendanceDeficitCount = riskStudents.length;
  
  const paidCount = students.filter(s => s.feeStatus === 'Paid').length;
  const feeCollectionRate = totalStudents > 0
    ? Math.round((paidCount / totalStudents) * 100)
    : 0;

  const avgAttendance = totalStudents > 0
    ? Math.round(students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents)
    : 0;

  // 2. Department distribution calculations for Bar Chart
  const deptCounts = DEPARTMENTS.reduce((acc, dept) => {
    acc[dept] = students.filter(s => s.department === dept).length;
    return acc;
  }, {});

  const maxDeptCount = Math.max(...Object.values(deptCounts), 1);

  // SVG Bar Chart dimensions & helpers
  const chartHeight = 160;
  const barWidth = 40;
  const gap = 20;
  const chartWidth = DEPARTMENTS.length * (barWidth + gap) + gap;

  // Radial gauge variables (Radius = 70, Circumference = 2 * PI * 70 ≈ 439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (avgAttendance / 100) * circumference;

  return (
    <div className="dashboard-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* 4 Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Students</span>
            <span className="metric-value">{totalStudents}</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Average CGPA</span>
            <span className="metric-value">{avgCgpa} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>/10</span></span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Attendance Alerts</span>
            <span className="metric-value">{attendanceDeficitCount}</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Fees Paid Rate</span>
            <span className="metric-value">{feeCollectionRate}%</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* Charts Panels */}
      <div className="charts-grid">
        {/* Department Enrollment Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Enrollment by Department</h3>
          </div>
          <div className="svg-container">
            <svg viewBox={`0 0 ${chartWidth} 200`} width="100%" height="200" style={{ overflow: 'visible' }}>
              {DEPARTMENTS.map((dept, index) => {
                const count = deptCounts[dept] || 0;
                const pct = count / maxDeptCount;
                const barHeight = pct * chartHeight;
                const x = gap + index * (barWidth + gap);
                const y = chartHeight - barHeight + 20;

                // Truncate dept name for label
                const shortName = dept.length > 12 ? dept.substring(0, 10) + '..' : dept;

                return (
                  <g key={dept}>
                    {/* Background tracking bar */}
                    <rect
                      x={x}
                      y={20}
                      width={barWidth}
                      height={chartHeight}
                      rx={4}
                      fill="var(--bg-tertiary)"
                    />
                    {/* Animated Fill bar */}
                    <rect
                      className="bar-hoverable"
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 4)} // show at least a small line if count is 0
                      rx={4}
                      fill={count > 0 ? "var(--accent)" : "var(--text-tertiary)"}
                    />
                    {/* Count Label on top of bar */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="var(--text-primary)"
                    >
                      {count}
                    </text>
                    {/* X-Axis Label */}
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight + 36}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="500"
                      fill="var(--text-secondary)"
                    >
                      {shortName}
                    </text>
                  </g>
                );
              })}
              {/* Ground line */}
              <line
                x1={0}
                y1={chartHeight + 20}
                x2={chartWidth}
                y2={chartHeight + 20}
                stroke="var(--border-color)"
                strokeWidth={1}
              />
            </svg>
          </div>
        </div>

        {/* Circular Average Attendance Gauge */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Overall Campus Attendance</h3>
          </div>
          <div className="svg-container">
            <svg width="180" height="180" viewBox="0 0 180 180" style={{ overflow: 'visible' }}>
              <circle
                className="radial-track"
                cx="90"
                cy="90"
                r={radius}
                strokeWidth="12"
              />
              <circle
                className="radial-fill"
                cx="90"
                cy="90"
                r={radius}
                strokeWidth="12"
                stroke="var(--success)"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
              {/* Percentage label in the center */}
              <text
                x="90"
                y="92"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="26"
                fontWeight="800"
                fill="var(--text-primary)"
              >
                {avgAttendance}%
              </text>
              <text
                x="90"
                y="114"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="600"
                fill="var(--text-tertiary)"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                Avg Attendance
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Attendance Alert Watchlist */}
      <div className="chart-card" style={{ marginBottom: 0 }}>
        <div className="chart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
            <h3 className="chart-title" style={{ color: 'var(--text-primary)' }}>Attendance Warning Watchlist (&lt; 75%)</h3>
          </div>
          <span className="badge badge-danger">{attendanceDeficitCount} Students</span>
        </div>
        
        {attendanceDeficitCount === 0 ? (
          <div className="empty-state" style={{ padding: '32px' }}>
            <p className="empty-title">All clear!</p>
            <p className="empty-desc">No students currently fall below the required 75% attendance threshold.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="responsive-table" style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: 'transparent', padding: '12px 16px' }}>Student</th>
                  <th style={{ backgroundColor: 'transparent', padding: '12px 16px' }}>Branch</th>
                  <th style={{ backgroundColor: 'transparent', padding: '12px 16px' }}>Sem</th>
                  <th style={{ backgroundColor: 'transparent', padding: '12px 16px' }}>CGPA</th>
                  <th style={{ backgroundColor: 'transparent', padding: '12px 16px', textAlign: 'right' }}>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {riskStudents.map(student => (
                  <tr key={student._id}>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="student-profile-cell">
                        <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                          {student.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <div className="student-name" style={{ fontSize: '13.5px' }}>{student.name}</div>
                          <div className="student-meta">{student.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{student.department}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>Sem {student.semester}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{student.cgpa}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span className="badge badge-danger">
                        {student.attendance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
