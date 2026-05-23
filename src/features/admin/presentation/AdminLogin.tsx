/**
 * AdminLogin — Clean, minimal login page for all roles
 * Single form; role is detected automatically from the profiles table after login.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../core/supabase/client';

export function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/admin');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '1rem',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='0' y='0' width='2' height='2' rx='0.4' fill='rgba(255%2C255%2C255%2C0.04)'/%3E%3Crect x='5' y='5' width='2' height='2' rx='0.4' fill='rgba(255%2C255%2C255%2C0.04)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '10px 10px',
      }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px',
        background: '#1e293b', borderRadius: '16px', padding: '40px 36px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/images/Logo.png" alt="TechHub" style={{ height: '52px', margin: '0 auto 16px' }} />
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Sign in with your TechHub credentials
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@techhub.com"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#A3D045'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 40px 10px 14px', borderRadius: '8px',
                  background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f1f5f9', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#A3D045'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
                  padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              color: '#fca5a5', fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: loading ? '#6b7280' : '#A3D045',
              color: '#0f172a', fontWeight: 700, fontSize: '14px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.15s',
              transform: 'scale(1)',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#475569', fontSize: '12px' }}>
          Access is restricted to authorised TechHub personnel.
        </p>
      </div>
    </div>
  );
}
