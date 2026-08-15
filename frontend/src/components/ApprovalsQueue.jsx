import React, { useState } from 'react';
import { Check, X, ShieldAlert, Users, Award, CreditCard } from 'lucide-react';
import { DEPARTMENTS, COURSES_BY_DEPT } from '../mockData';

export default function ApprovalsQueue({ pendingApprovals = [], onApprove, onReject, guestMode = false }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Dynamic role assignment states
  const [approvedRole, setApprovedRole] = useState('student');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [cgpa, setCgpa] = useState(6.0);
  const [feeAmount, setFeeAmount] = useState(50000);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const openApproveModal = (req) => {
    setSelectedRequest(req);
    setApprovedRole(req.desiredRole || 'student');
    setDepartment(req.department !== 'N/A' ? req.department : 'Computer Science');
    
    // Auto-generate a roll number suggestion based on department initials
    const activeDept = req.department !== 'N/A' ? req.department : 'Computer Science';
    const deptCode = activeDept.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setRollNumber(`${deptCode}2026${randomNum}`);
    
    setYear(1);
    setSemester(1);
    setCgpa(6.0);
    setFeeAmount(50000);
    setSelectedCourses([]);
  };

  const handleRoleChangeInModal = (role) => {
    setApprovedRole(role);
    if (role === 'student') {
      const deptCode = department.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setRollNumber(`${deptCode}2026${randomNum}`);
    }
  };

  const handleDeptChangeInModal = (deptVal) => {
    setDepartment(deptVal);
    if (approvedRole === 'student') {
      const deptCode = deptVal.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setRollNumber(`${deptCode}2026${randomNum}`);
    }
    setSelectedCourses([]);
  };

  const handleCourseCheckboxChange = (course) => {
    setSelectedCourses(prev => 
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const handleSubmitApproval = (e) => {
    e.preventDefault();
    
    let approvalPayload = {
      role: approvedRole,
      name: selectedRequest.name,
      email: selectedRequest.email
    };

    if (approvedRole === 'student') {
      if (!rollNumber.trim()) {
        alert('Please assign a Roll Number.');
        return;
      }
      approvalPayload = {
        ...approvalPayload,
        rollNumber,
        department,
        year: parseInt(year, 10),
        semester: parseInt(semester, 10),
        cgpa: Math.max(6.0, parseFloat(cgpa) || 6.0),
        attendance: 100,
        feeStatus: feeAmount > 0 ? 'Pending' : 'Paid',
        feeAmount: parseFloat(feeAmount) || 0,
        courses: selectedCourses
      };
    } else if (approvedRole === 'professor') {
      approvalPayload = {
        ...approvalPayload,
        department
      };
    }

    onApprove(selectedRequest.id, approvalPayload);
    setSelectedRequest(null);
  };

  const availableCourses = COURSES_BY_DEPT[department] || [];

  return (
    <div className="approvals-queue-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      <div className="table-container">
        <div className="chart-header" style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--warning)' }} /> Pending Registration Approvals
          </h3>
          <span className="badge badge-warning">{pendingApprovals.length} Requests</span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="empty-state" style={{ padding: '64px' }}>
            <Check size={40} style={{ color: 'var(--success)' }} />
            <h3 className="empty-title">All Caught Up!</h3>
            <p className="empty-desc">No registration requests are waiting in the queue.</p>
          </div>
        ) : (
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Registered Email</th>
                <th>Desired Role</th>
                <th>Desired Department</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map(req => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: '750', color: 'var(--text-primary)' }}>{req.name}</div>
                  </td>
                  <td>{req.email}</td>
                  <td>
                    <span className={`badge ${
                      req.desiredRole === 'student' ? 'badge-success' : 
                      req.desiredRole === 'professor' ? 'badge-info' : 'badge-warning'
                    }`} style={{ textTransform: 'capitalize', backgroundColor: req.desiredRole === 'professor' ? 'var(--accent-light)' : undefined, color: req.desiredRole === 'professor' ? 'var(--accent)' : undefined }}>
                      {req.desiredRole}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                      {req.department}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {guestMode ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Read-only</span>
                      ) : (
                        <>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                            onClick={() => openApproveModal(req)}
                          >
                            <Check size={13} /> Approve &amp; Assign Role
                          </button>
                          <button 
                            className="btn-action delete"
                            onClick={() => onReject(req.id)}
                            title="Reject Request"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approval Settings Modal */}
      {selectedRequest && (
        <div className="modal-overlay open" onClick={() => setSelectedRequest(null)}>
          <form className="modal-container" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmitApproval}>
            <div className="modal-header">
              <h3 className="page-title">Approve &amp; Configure Profile</h3>
              <button type="button" className="btn-icon" onClick={() => setSelectedRequest(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '13.5px' }}>
                <span className="profile-detail-label">Applicant Request Info</span>
                <p style={{ fontWeight: '700', marginTop: '4px' }}>{selectedRequest.name} ({selectedRequest.email})</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Requested Role: <strong style={{ textTransform: 'capitalize' }}>{selectedRequest.desiredRole}</strong></p>
              </div>

              {/* Set Final Approved Role */}
              <div className="form-group">
                <label className="form-label">Assign Final System Role</label>
                <select 
                  className="form-control"
                  value={approvedRole}
                  onChange={(e) => handleRoleChangeInModal(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor (Teacher)</option>
                  <option value="registrar">Registrar Office (Fees/Docs)</option>
                </select>
              </div>

              {/* Conditional Rendering: Professor Parameters */}
              {approvedRole === 'professor' && (
                <div className="form-group" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <label className="form-label">Assign Department / Branch</label>
                  <select 
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Rendering: Student Parameters */}
              {approvedRole === 'student' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Assign Roll Number *</label>
                      <input 
                        type="text" 
                        required
                        className="form-control"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department / Branch</label>
                      <select 
                        className="form-control"
                        value={department}
                        onChange={(e) => handleDeptChangeInModal(e.target.value)}
                      >
                        {DEPARTMENTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Year of Study</label>
                      <select 
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Semester</label>
                      <input 
                        type="number"
                        min="1"
                        max="8"
                        className="form-control"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">CGPA Profile (if transfer)</label>
                      <input 
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        className="form-control"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Term Tuition Fees (₹)</label>
                      <input 
                        type="number"
                        min="0"
                        className="form-control"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Course Checklist */}
                  <div className="form-group">
                    <label className="form-label">Select Semester Courses</label>
                    <div className="courses-checkbox-grid">
                      {availableCourses.map(course => (
                        <label className="checkbox-label" key={course}>
                          <input 
                            type="checkbox"
                            checked={selectedCourses.includes(course)}
                            onChange={() => handleCourseCheckboxChange(course)}
                          />
                          {course}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {approvedRole === 'registrar' && (
                <div style={{ padding: '12px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  No extra settings are needed. Approving will authorize this email as a Registrar.
                </div>
              )}

            </div>

            <div className="modal-footer">
              <button type="button" className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={() => setSelectedRequest(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm Enrollment Approval
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
