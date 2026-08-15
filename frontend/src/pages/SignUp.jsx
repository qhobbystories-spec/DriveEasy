import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader, Car } from 'lucide-react';
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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '16px', color: 'var(--primary)' }}><Car size={48} /></div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Create Your Account</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px' }}>Join AMK Motors & AutoCare today</p>
        </div>

        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input className="form-control" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0547129448" style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)' }} />
                <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`btn btn-primary btn-block btn-lg${isLoading ? ' loading' : ''}`}>
              {isLoading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--gray-1)' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
              Sign In
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
