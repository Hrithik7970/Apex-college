import React, { useState } from 'react';
import { Megaphone, Trash2, Plus, Bell, Calendar, X } from 'lucide-react';

export default function AnnouncementsBoard({ 
  announcements = [], 
  onAddAnnouncement, 
  onDeleteAnnouncement, 
  userRole,
  guestMode = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('medium'); // 'low' | 'medium' | 'high'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      title: title.trim(),
      content: content.trim(),
      priority,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    });

    // Reset Form
    setTitle('');
    setContent('');
    setPriority('medium');
    setIsOpen(false);
  };

  const getPriorityStyle = (prio) => {
    switch (prio) {
      case 'high':
        return {
          bg: 'var(--danger-light)',
          text: 'var(--danger-text)',
          border: '1px solid hsl(346.8, 77.2%, 85%)'
        };
      case 'medium':
        return {
          bg: 'var(--warning-light)',
          text: 'var(--warning-text)',
          border: '1px solid hsl(38, 92%, 85%)'
        };
      case 'low':
      default:
        return {
          bg: 'var(--accent-light)',
          text: 'var(--accent)',
          border: '1px solid hsl(262.1, 83.3%, 90%)'
        };
    }
  };

  return (
    <div className="chart-card" style={{ animation: 'fadeIn 0.3s ease', marginBottom: '24px' }}>
      <div className="chart-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Megaphone size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h3 className="chart-title">Campus Bulletin Board</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Official notices and academic alerts</p>
          </div>
        </div>
        
        {userRole === 'admin' && !guestMode && (
          <button 
            type="button" 
            className="btn-primary" 
            style={{ padding: '8px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={14} /> : <Plus size={14} />}
            {isOpen ? 'Close Form' : 'Post Notice'}
          </button>
        )}
      </div>

      {/* Admin Notice Posting Form */}
      {isOpen && userRole === 'admin' && (
        <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', margin: '16px 0', border: '1px solid var(--border-color)', animation: 'slideDown 0.25s ease' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>Create New Notice</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>Notice Title</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. End Semester Exam Schedule" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>Content Details</label>
              <textarea 
                className="input-field" 
                placeholder="Write the full announcement detail here..." 
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ width: '100%', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>Alert Urgency</label>
                <select 
                  className="select-filter" 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', marginTop: '16px' }}>
                Publish Bulletin
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Announcements List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        {announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Bell size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '8px', opacity: 0.6 }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>No active notices at the moment.</p>
          </div>
        ) : (
          announcements.map((item) => {
            const styles = getPriorityStyle(item.priority);
            return (
              <div 
                key={item.id} 
                style={{ 
                  padding: '16px 20px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  gap: '16px', 
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                {/* Priority Status Dot */}
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '99px', 
                  fontSize: '10px', 
                  fontWeight: '800', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backgroundColor: styles.bg,
                  color: styles.text,
                  border: styles.border
                }}>
                  {item.priority}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{item.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={10} /> {item.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{item.content}</p>
                </div>

                {userRole === 'admin' && !guestMode && (
                  <button 
                    type="button" 
                    onClick={() => onDeleteAnnouncement(item.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-tertiary)', 
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'var(--danger-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    title="Delete notice"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
