import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if key is missing or placeholder
const isKeyMissing = !PUBLISHABLE_KEY || PUBLISHABLE_KEY.trim() === '' || PUBLISHABLE_KEY.includes('your_publishable_key_here');

function KeySetupFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'hsl(222.2, 84%, 4.9%)',
      color: 'hsl(210, 40%, 98%)',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        backgroundColor: 'hsl(222.2, 47.4%, 11.2%)',
        border: '1px solid hsl(217.2, 32.6%, 17.5%)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: 'hsl(263.4, 70%, 58%)' }}>Clerk API Key Required</h2>
        <p style={{ fontSize: '14.5px', color: 'hsl(215, 20.2%, 65.1%)', lineHeight: '1.6', marginBottom: '24px' }}>
          To enable secure student/staff authentication, you need to configure your Clerk Publishable Key in the project environment.
        </p>
        <div style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderRadius: '8px', border: '1px solid hsl(217.2, 32.6%, 17.5%)', fontSize: '13.5px', lineHeight: '1.7', marginBottom: '24px' }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Quick Setup Instructions:</strong>
          1. Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" style={{ color: 'hsl(263.4, 70%, 58%)', textDecoration: 'underline', fontWeight: '600' }}>dashboard.clerk.com</a> and sign up.<br />
          2. Create a new Clerk application.<br />
          3. Copy your <strong>Publishable Key</strong>.<br />
          4. Open the <code>.env</code> file at the root of this project.<br />
          5. Replace the key value with your copied key:<br />
          <code style={{ display: 'block', marginTop: '6px', background: '#0b0f19', padding: '6px', borderRadius: '4px', border: '1px solid #243048', wordBreak: 'break-all' }}>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
        </div>
        <p style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>
          The local development server will reload automatically once you update the <code>.env</code> file.
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isKeyMissing ? (
      <KeySetupFallback />
    ) : (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    )}
  </StrictMode>
)
