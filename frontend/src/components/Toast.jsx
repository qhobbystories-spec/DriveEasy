import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  const icons = { success: <CheckCircle size={18} color="var(--success)" />, error: <XCircle size={18} color="var(--primary)" />, info: <Info size={18} color="var(--secondary-light)" /> };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {icons[t.type] || icons.info}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
