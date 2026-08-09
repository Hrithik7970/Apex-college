import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Shield, BookOpen, Users, BarChart2 } from 'lucide-react';

export default function LoginView({ onDemoLogin }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-primary)',
      fontFamily: 'var(--font-family)',
      animation: 'fadeIn 0.4s ease'
    }}>
      
      {/* Left Column: College Branding & Visual Feature Cards */}
      <div style={{
        flex: 1.2,
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, hsl(262.1, 83.3%, 57.8%) 0%, hsl(262.1, 70%, 45%) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }} className="login-branding-sec">
        
        {/* Abstract Background SVG shapes */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
          <svg width="400" height="400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="white" />
          </svg>
        </div>
        
        <div style={{ maxWidth: '580px', zIndex: 2 }}>
          {/* Logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            fontSize: '26px',
            fontWeight: '900',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>A</div>
          
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            Apex College Academic Portal
          </h1>
          <p style={{ fontSize: '17px', opacity: 0.85, marginBottom: '48px', lineHeight: '1.6' }}>
            A comprehensive MERN-stack student management network for college staff and student self-service utilities.
          </p>

          {/* Core Feature List cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '14px' }}>
              <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                <BarChart2 size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Administrative Insights Dashboard</h4>
                <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.4' }}>Track department enrollments, monitor warning thresholds, and observe key financial statistics.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '14px' }}>
              <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Student Directory & Register</h4>
                <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.4' }}>Filter profiles by branch and fees status, search roll numbers, and modify academic folders instantly.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '14px' }}>
              <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Student self-service dashboards</h4>
                <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.4' }}>Access semester GPAs, subject-wise attendance logs, and fee ledger statements directly.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Right Column: Clerk Authorization Widget & Demo Mode */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: 'var(--bg-primary)',
        gap: '24px',
        overflowY: 'auto'
      }} className="login-widget-sec">
        
        <div style={{
          transform: 'scale(1.05)',
          animation: 'fadeIn 0.5s ease',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '16px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '400px'
        }}>
          <SignIn 
            appearance={{
              elements: {
                card: {
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'none'
                },
                headerTitle: {
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family)',
                  fontWeight: '800'
                },
                headerSubtitle: {
                  color: 'var(--text-secondary)'
                },
                socialButtonsBlockButton: {
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '&:hover': {
                    background: 'var(--bg-tertiary)'
                  }
                },
                formButtonPrimary: {
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--accent-hover)'
                  }
                },
                formFieldLabel: {
                  color: 'var(--text-secondary)'
                },
                formFieldInput: {
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                },
                footerActionText: {
                  color: 'var(--text-secondary)'
                },
                footerActionLink: {
                  color: 'var(--accent)',
                  '&:hover': {
                    color: 'var(--accent-hover)'
                  }
                }
              }
            }}
          />
        </div>

      </div>

    </div>
  );
}

