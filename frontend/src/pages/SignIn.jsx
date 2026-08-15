import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const ok = await login(email, password);
      if (ok) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Sign In to AMK Motors & AutoCare</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px' }}>Access your account and manage your services</p>
        </div>

        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary btn-block btn-lg${isLoading ? ' loading' : ''}`}
            >
              {isLoading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46, 160, 67, 0.3)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--gray-1)', marginBottom: '8px', fontWeight: '600' }}>Demo Credentials:</p>
              <p style={{ fontSize: '12px', color: 'var(--gray-1)', margin: '4px 0' }}>Email: <span style={{ color: '#fff', fontWeight: '500' }}>demo@example.com</span></p>
              <p style={{ fontSize: '12px', color: 'var(--gray-1)', margin: '4px 0' }}>Password: <span style={{ color: '#fff', fontWeight: '500' }}>demo1234</span></p>
            </div>
          )}

          <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--gray-1)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
              Sign Up
            </Link>
          </p>
        </div>

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
