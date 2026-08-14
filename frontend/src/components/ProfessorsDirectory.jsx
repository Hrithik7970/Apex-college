import React, { useState } from 'react';
import { Search, GraduationCap, MapPin, Phone, Mail, Award, BookOpen } from 'lucide-react';
import { DEPARTMENTS, MOCK_PROFESSORS } from '../mockData';

export default function ProfessorsDirectory({ professors = MOCK_PROFESSORS }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredProfessors = professors.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prof.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || prof.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="professors-directory-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Header & Filter Controls */}
      <div className="table-container" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Faculty &amp; Professors Directory</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Academic professors, department heads (HODs), and faculty advisors across all departments.
            </p>
          </div>
          <span className="badge badge-info" style={{ fontSize: '13px', padding: '6px 14px', borderRadius: 'var(--radius-sm)' }}>
            {filteredProfessors.length} Professors Found
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, qualification..."
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Department:</label>
            <select
              className="select-filter"
              style={{ padding: '10px 16px', fontWeight: '700' }}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Professors Cards Grid */}
      {filteredProfessors.length === 0 ? (
        <div className="table-container" style={{ padding: '64px', textAlign: 'center' }}>
          <BookOpen size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '12px' }} />
          <h3 className="empty-title">No Professors Match Criteria</h3>
          <p className="empty-desc">Try clearing your search keyword or switching department filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredProfessors.map(prof => (
            <div 
              key={prof.id} 
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
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {prof.name.split(' ').map(n=>n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{prof.name}</h3>
                  <span style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: '700', display: 'block', marginTop: '2px' }}>
                    {prof.designation}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '11px', fontWeight: '700' }}>
                  {prof.department}
                </span>
                <span className="badge badge-success" style={{ fontSize: '11px', fontWeight: '700' }}>
                  {prof.experienceYears} Years Experience
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{prof.qualification}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={15} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                  <span>{prof.office}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={15} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span>{prof.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{prof.email}</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                  Teaching Courses:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {prof.courses.map(c => (
                    <span key={c} style={{ fontSize: '11.5px', padding: '3px 10px', borderRadius: '4px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '700' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
