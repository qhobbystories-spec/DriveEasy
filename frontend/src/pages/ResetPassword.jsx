import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader, CheckCircle, ArrowLeft } from 'lucide-react';
import { api } from '../api/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '10px 12px 10px 42px',
    background: 'var(--dark-3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: '#fff', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!token) { setError('Invalid or missing reset token'); return; }

    setError('');
    setIsLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/signin'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Invalid Reset Link</h2>
          <p style={{ color: 'var(--gray-1)', marginBottom: 24 }}>This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="btn btn-primary">Request a New Link</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px' }}>Enter your new password below</p>
        </div>

        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Password Reset!</h3>
              <p style={{ color: 'var(--gray-1)', fontSize: 14 }}>Redirecting to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: 'var(--primary)', fontSize: 13, marginBottom: 16 }}>{error}</p>}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#fff' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--gray-1)' }} />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#fff' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--gray-1)' }} />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: 11 }}>
                {isLoading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Resetting...</> : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
