import React, { useEffect, useState, useCallback } from 'react';
import { Bell, Calendar, Car, Users, CreditCard, TrendingUp, CheckCheck } from 'lucide-react';
import { api } from '../../api/client';
import { useApp } from '../../context/AppContext';

const STATUS_COLORS = {
  PENDING: 'rgba(244,162,97,0.15)',
  CONFIRMED: 'rgba(46,160,67,0.15)',
  ACTIVE: 'rgba(69,123,157,0.15)',
  COMPLETED: 'rgba(46,160,67,0.15)',
  CANCELLED: 'rgba(139,148,158,0.12)',
  REJECTED: 'rgba(230,57,70,0.12)',
  RETURNED: 'rgba(46,160,67,0.15)',
};

const dateOnly = (d) => (d ? String(d).slice(0, 10) : '');

export default function AdminOverview() {
  const { addToast } = useApp();
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, notifRes] = await Promise.all([api.dashboard.stats(), api.notifications.list()]);
      setStats(statsRes.data);
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
    } catch (err) {
      addToast('Could not load dashboard stats (admin access required).', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const markAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      addToast('All notifications marked as read', 'success');
    } catch (e) {
      addToast('Could not update notifications', 'error');
    }
  };

  const statCards = stats ? [
    { label: 'Total Vehicles', value: stats.totalCars, icon: <Car size={20} /> },
    { label: 'Available', value: stats.availableCars, icon: <Car size={20} /> },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <Calendar size={20} /> },
    { label: 'Pending', value: stats.pendingBookings, icon: <Calendar size={20} /> },
    { label: 'Active Rentals', value: stats.activeBookings, icon: <Calendar size={20} /> },
    { label: 'Customers', value: stats.totalCustomers, icon: <Users size={20} /> },
    { label: 'Total Revenue', value: `GHS ${Math.round(stats.totalRevenue).toLocaleString()}`, icon: <CreditCard size={20} /> },
    { label: 'This Month', value: `GHS ${Math.round(stats.monthRevenue).toLocaleString()}`, icon: <TrendingUp size={20} /> },
  ] : [];

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-1)' }}>Loading dashboard...</div>;
  }

  return (
    <>
      {statCards.length > 0 && (
        <div className="ov-stats">
          {statCards.map(s => (
            <div key={s.label} className="ov-stat">
              <div className="ov-stat-icon">{s.icon}</div>
              <div>
                <div className="ov-stat-value">{s.value}</div>
                <div className="ov-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {stats && stats.recentBookings && stats.recentBookings.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent Bookings</h3>
          <div className="ov-list">
            {stats.recentBookings.slice(0, 5).map(b => (
              <div key={b.id} className="ov-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {b.car ? `${b.car.brand} ${b.car.model}` : 'Vehicle'}
                    <span className="ov-id"> #{b.bookingNumber}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-1)' }}>
                    {b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : '—'} · {dateOnly(b.pickupDate)} → {dateOnly(b.returnDate)}
                  </div>
                </div>
                <span className="ov-badge" style={{ background: STATUS_COLORS[b.bookingStatus] || STATUS_COLORS.PENDING, color: 'var(--white)' }}>
                  {b.bookingStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <div className="ov-head">
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notifications</h3>
          {notifications.some(n => !n.isRead) && (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div style={{ color: 'var(--gray-1)', fontSize: 14, padding: '16px 0' }}>
            <Bell size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />No notifications yet.
          </div>
        ) : (
          <div className="ov-list">
            {notifications.slice(0, 10).map(n => (
              <div key={n.id} className="ov-row" style={{ opacity: n.isRead ? 0.6 : 1 }}>
                <div>
                  <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: 14 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-1)' }}>{n.message}</div>
                </div>
                {!n.isRead && <span className="ov-dot" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .ov-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .ov-stat {
          background: var(--dark-3); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 16px; display: flex; align-items: center; gap: 12px;
        }
        .ov-stat-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          background: rgba(230,57,70,0.12); color: var(--primary);
          display: flex; align-items: center; justify-content: center;
        }
        .ov-stat-value { font-size: 20px; font-weight: 800; color: var(--white); line-height: 1.1; }
        .ov-stat-label { font-size: 12px; color: var(--gray-1); margin-top: 2px; }
        .ov-list { display: flex; flex-direction: column; }
        .ov-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ov-row:last-child { border-bottom: none; }
        .ov-id { color: var(--gray-1); font-weight: 400; }
        .ov-badge { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .ov-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); flex-shrink: 0; }
        .ov-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        @media (max-width: 900px) {
          .ov-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .ov-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
