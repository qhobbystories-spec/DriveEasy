import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader, CheckCircle, Lock } from 'lucide-react';
import { api } from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return; }

    setError('');
    setIsLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px 10px 42px',
    background: 'var(--dark-3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: '#fff', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '16px', color: 'var(--primary)' }}><Lock size={48} /></div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Forgot Password?</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px' }}>Enter your email and we'll send you a reset link</p>
        </div>

        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check Your Email</h3>
              <p style={{ color: 'var(--gray-1)', fontSize: 14, marginBottom: 24 }}>
                If an account exists with <strong>{email}</strong>, we've sent a password reset link.
              </p>
              <Link to="/signin" className="btn btn-primary" style={{ width: '100%' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: 'var(--primary)', fontSize: 13, marginBottom: 16 }}>{error}</p>}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#fff' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--gray-1)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(230,57,70,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: 11 }}>
                {isLoading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray-1)' }}>
            <Link to="/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Back to Sign In
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
