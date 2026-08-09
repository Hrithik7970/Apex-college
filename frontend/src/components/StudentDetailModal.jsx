import React from 'react';
import { X, Mail, BookOpen, CreditCard, Award, BarChart2 } from 'lucide-react';

export default function StudentDetailModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="page-title">Student Profile Detail</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Profile Hero */}
          <div className="profile-hero">
            <div className="profile-avatar">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-meta-main">
              <h3>{student.name}</h3>
              <span className="student-meta" style={{ fontSize: '14px' }}>Roll Number: <strong>{student.rollNumber}</strong></span>
            </div>
          </div>

          {/* Academic Info Grid */}
          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <span className="profile-detail-label">Department</span>
              <span className="profile-detail-value">{student.department}</span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">Email Address</span>
              <span className="profile-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} style={{ color: 'var(--text-tertiary)' }} />
                {student.email}
              </span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">Year & Semester</span>
              <span className="profile-detail-value">Year {student.year} / Semester {student.semester}</span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">CGPA Profile</span>
              <span className="profile-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: student.cgpa >= 8 ? 'var(--success)' : 'inherit' }}>
                <Award size={14} />
                {student.cgpa.toFixed(2)} / 10.0
              </span>
            </div>

            <div className="profile-detail-item" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="profile-detail-label">Overall Attendance</span>
                <span className={`badge ${student.attendance >= 75 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '2px 8px', fontSize: '11px' }}>
                  {student.attendance}%
                </span>
              </div>
              <div className="attendance-progress-bar" style={{ width: '100%' }}>
                <div 
                  className="attendance-progress-fill" 
                  style={{ 
                    width: `${student.attendance}%`, 
                    backgroundColor: student.attendance >= 75 ? 'var(--success)' : 'var(--danger)' 
                  }}
                />
              </div>
            </div>

            <div className="profile-detail-item" style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
              <span className="profile-detail-label" style={{ marginBottom: '6px' }}>Fee Invoice Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={`badge ${
                  student.feeStatus === 'Paid' ? 'badge-success' : 
                  student.feeStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                }`}>
                  <CreditCard size={12} />
                  {student.feeStatus}
                </span>
                {student.feeStatus !== 'Paid' && (
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    Outstanding: <span style={{ color: 'var(--danger)' }}>₹{student.feeAmount.toLocaleString('en-IN')}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Courses Sub-List */}
          <div className="courses-sec">
            <h4 className="courses-sec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} /> Enrolled Semester Courses
            </h4>
            {student.courses && student.courses.length > 0 ? (
              <div className="courses-pill-container">
                {student.courses.map((course, idx) => (
                  <span className="course-pill" key={idx}>{course}</span>
                ))}
              </div>
            ) : (
              <span className="student-meta">No courses registered for this semester.</span>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={onClose}>
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
