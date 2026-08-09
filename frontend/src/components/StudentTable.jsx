import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, Plus, Filter, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../mockData';

export default function StudentTable({ students = [], onSelectStudent, onEditStudent, onDeleteStudent, onAddStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');
  const [attendanceWarningFilter, setAttendanceWarningFilter] = useState(false);

  // Filter students based on UI controls
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter ? student.department === deptFilter : true;
    const matchesFee = feeFilter ? student.feeStatus === feeFilter : true;
    const matchesWarning = attendanceWarningFilter ? student.attendance < 75 : true;

    return matchesSearch && matchesDept && matchesFee && matchesWarning;
  });

  return (
    <div className="students-table-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Search and Filters panel */}
      <div className="directory-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students by name, email, roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          {/* Dept Filter */}
          <select
            className="select-filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Fee Filter */}
          <select
            className="select-filter"
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
          >
            <option value="">All Fee Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          {/* Attendance warning toggle */}
          <button
            type="button"
            className="select-filter"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: attendanceWarningFilter ? 'var(--danger-light)' : 'var(--bg-secondary)',
              borderColor: attendanceWarningFilter ? 'var(--danger)' : 'var(--border-color)',
              color: attendanceWarningFilter ? 'var(--danger-text)' : 'var(--text-secondary)',
              fontWeight: attendanceWarningFilter ? '600' : 'normal'
            }}
            onClick={() => setAttendanceWarningFilter(!attendanceWarningFilter)}
          >
            <AlertCircle size={15} />
            &lt; 75% Attendance
          </button>

          <button className="btn-primary" onClick={onAddStudent}>
            <Plus size={16} />
            Register Student
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="table-container">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <Search size={40} style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="empty-title">No Students Found</h3>
            <p className="empty-desc">We couldn't find any students matching your search criteria. Try modifying your filters.</p>
          </div>
        ) : (
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Department</th>
                <th>Academic Year</th>
                <th>GPA</th>
                <th>Attendance</th>
                <th>Tuition Fees</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                // Get initials
                const initials = student.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2);

                return (
                  <tr key={student._id}>
                    <td>
                      <div className="student-profile-cell">
                        <div className="avatar">{initials}</div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div className="student-meta">{student.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.department}</td>
                    <td>Year {student.year} (Sem {student.semester})</td>
                    <td style={{ fontWeight: '600' }}>{student.cgpa.toFixed(2)}</td>
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
                      <span className={`badge ${
                        student.feeStatus === 'Paid' ? 'badge-success' :
                        student.feeStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-action" onClick={() => onSelectStudent(student)} title="View Details">
                          <Eye size={14} />
                        </button>
                        <button className="btn-action edit" onClick={() => onEditStudent(student)} title="Edit Record">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn-action delete" onClick={() => onDeleteStudent(student._id)} title="Delete Record">
                          <Trash2 size={14} />
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
  );
}
