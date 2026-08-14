import React from 'react';
import { Clock, ShieldAlert, LogOut, ArrowRight } from 'lucide-react';
import { SignOutButton } from '@clerk/clerk-react';

export default function PendingApprovalView({ 
  userEmail, 
  requestDetails, 
  onSubmitRequest,
  devRoleOverride,
  setDevRoleOverride
}) {
  const [name, setName] = React.useState('');
  const [desiredRole, setDesiredRole] = React.useState('student');
  const [dept, setDept] = React.useState('Computer Science');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmitRequest({ 
      name, 
      desiredRole, 
      department: desiredRole === 'student' || desiredRole === 'professor' ? dept : 'N/A', 
      email: userEmail 
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-primary)',
      fontFamily: 'var(--font-family)',
      padding: '24px',
      animation: 'fadeIn 0.3s ease'
    }}>
      
      <div style={{
        maxWidth: '540px',
        width: '100%',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        
        {/* Status Indicator Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: requestDetails ? 'var(--warning-light)' : 'var(--accent-light)',
          color: requestDetails ? 'var(--warning)' : 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          {requestDetails ? <Clock size={36} /> : <ShieldAlert size={36} />}
        </div>

        {requestDetails ? (
          /* Application is already submitted and pending */
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Approval Pending</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              Thank you, <strong>{requestDetails.name}</strong>! Your application is pending review by the system administrator.
            </p>
            
            <div style={{
              textAlign: 'left',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '28px'
            }}>
              <span className="profile-detail-label">Request Details:</span>
              <div style={{ marginTop: '8px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>Name: <strong>{requestDetails.name}</strong></div>
                <div>Email: <strong>{userEmail}</strong></div>
                <div>Desired Role: <strong style={{ textTransform: 'capitalize' }}>{requestDetails.desiredRole}</strong></div>
                {requestDetails.department !== 'N/A' && (
                  <div>Branch/Dept: <strong>{requestDetails.department}</strong></div>
                )}
                <div>Status: <span className="badge badge-warning" style={{ fontSize: '11px', padding: '2px 8px' }}>Pending Admin Action</span></div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-tertiary)', lineHeight: '1.5', marginBottom: '32px' }}>
              The administrator will approve your profile and assign your specific system roles (along with your roll number if you are a student). Please check back later.
            </p>
          </div>
        ) : (
          /* Needs to submit registration details */
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Enrollment Request</h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
              Welcome! Your Gmail is successfully logged in. Please submit your name and desired system role to request access.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginBottom: '28px' }}>
              <div className="form-group">
                <label className="form-label">Official Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Request System Role</label>
                <select
                  className="form-control"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor (Teacher)</option>
                  <option value="registrar">Registrar Office (Fees/Docs)</option>
                </select>
              </div>

              {(desiredRole === 'student' || desiredRole === 'professor') && (
                <div className="form-group">
                  <label className="form-label">Academic Department</label>
                  <select
                    className="form-control"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Enrollment Request
              </button>
            </form>
          </div>
        )}

        {/* Action Controls Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          
          {/* Simulation dropdown has been completely removed to enforce authentic email-based role gating */}

          <SignOutButton>
            <button className="btn-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', width: '100%', justifyContent: 'center', height: 'auto', borderRadius: 'var(--radius-md)' }}>
              <LogOut size={16} /> Sign Out of Account
            </button>
          </SignOutButton>

        </div>

      </div>
    </div>
  );
}
