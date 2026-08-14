import React, { useState } from 'react';
import { Search, Building, Phone, Mail, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { MOCK_REGISTRARS } from '../mockData';

export default function RegistrarsDirectory({ registrars = MOCK_REGISTRARS }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegistrars = registrars.filter(officer => 
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.responsibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="registrars-directory-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Header & Filter Controls */}
      <div className="table-container" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Registrar Officers &amp; Desk Directory</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Administrative registrars overseeing student admissions, fee ledgers, document verification, and academic certificates.
            </p>
          </div>
          <span className="badge badge-success" style={{ fontSize: '13px', padding: '6px 14px', borderRadius: 'var(--radius-sm)' }}>
            {filteredRegistrars.length} Officers On Duty
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, title, desk location, domain..."
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Registrars Cards Grid */}
      {filteredRegistrars.length === 0 ? (
        <div className="table-container" style={{ padding: '64px', textAlign: 'center' }}>
          <FileText size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '12px' }} />
          <h3 className="empty-title">No Registrar Officers Found</h3>
          <p className="empty-desc">Try clearing your search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredRegistrars.map(officer => (
            <div 
              key={officer.id} 
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--warning-light)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {officer.name.split(' ').map(n=>n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{officer.name}</h3>
                  <span style={{ fontSize: '12.5px', color: 'var(--warning)', fontWeight: '700', display: 'block', marginTop: '2px' }}>
                    {officer.title}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className="badge badge-warning" style={{ fontSize: '11px', fontWeight: '700' }}>
                  {officer.employeeId}
                </span>
                <span className="badge badge-success" style={{ fontSize: '11px', fontWeight: '700' }}>
                  {officer.status}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{officer.desk}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={15} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span>{officer.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{officer.email}</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  Operational Domain &amp; Responsibilities:
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: 0, fontWeight: '600', lineHeight: '1.4' }}>
                  {officer.responsibility}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
