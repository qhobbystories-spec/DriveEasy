import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { api } from '../api/client';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    let cancelled = false;
    api.verifyEmail(token)
      .then(() => {
        if (!cancelled) { setStatus('success'); setMessage('Your email has been verified!'); }
      })
      .catch(err => {
        if (!cancelled) { setStatus('error'); setMessage(err.message || 'Verification failed. The link may have expired.'); }
      });

    return () => { cancelled = true; };
  }, [token]);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {status === 'loading' && (
            <>
              <Loader size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Verifying Email...</h2>
              <p style={{ color: 'var(--gray-1)', fontSize: 14 }}>Please wait while we verify your email address.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle size={56} color="var(--success)" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Email Verified!</h2>
              <p style={{ color: 'var(--gray-1)', fontSize: 14, marginBottom: 24 }}>{message}</p>
              <Link to="/signin" className="btn btn-primary" style={{ width: '100%' }}>Go to Sign In</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle size={56} color="var(--primary)" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Verification Failed</h2>
              <p style={{ color: 'var(--gray-1)', fontSize: 14, marginBottom: 24 }}>{message}</p>
              <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>Go to Home</Link>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
