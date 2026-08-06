import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email', 'error');
      return;
    }

    if (password.length < 8) {
      addToast('Password must be at least 8 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      addToast('Please enter a valid phone number', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const ok = await register(email, password, name, phone);
      if (ok) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Create Your Account</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px' }}>Join AMK Motors & AutoCare today</p>
        </div>

        {/* Form Card */}
        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--gray-1)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 42px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--gray-1)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 42px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--gray-1)' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0547129448"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 42px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--gray-1)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 42px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--gray-1)' }} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 42px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px',
                background: isLoading ? 'rgba(230, 57, 70, 0.6)' : 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.background = 'rgba(230, 57, 70, 0.9)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.background = 'var(--primary)')}
            >
              {isLoading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }} />

          {/* Sign In Link */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--gray-1)' }}>
            Already have an account? 
            <Link to="/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', marginLeft: '4px' }}>
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-2)', marginTop: '20px' }}>
          <Link to="/terms" style={{ color: 'var(--gray-1)', textDecoration: 'none' }}>Terms</Link>
          <span style={{ margin: '0 8px' }}>•</span>
          <Link to="/privacy" style={{ color: 'var(--gray-1)', textDecoration: 'none' }}>Privacy</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
