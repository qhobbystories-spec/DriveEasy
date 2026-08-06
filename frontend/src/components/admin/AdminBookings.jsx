import React, { useEffect, useState, useCallback } from 'react';
import { Check, X, RefreshCw, Calendar, MapPin, PlayCircle, CheckCircle, RotateCcw } from 'lucide-react';
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
const money = (n) => `GHS ${Number(n || 0).toLocaleString()}`;

export default function AdminBookings() {
  const { authUser, addToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const isAdmin = authUser?.role === 'ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.bookings.list();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      addToast('Could not load bookings (admin access required).', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, action) => {
    setBusyId(id);
    try {
      if (action === 'approve') await api.bookings.approve(id);
      if (action === 'reject') await api.bookings.reject(id);
      if (action === 'activate') await api.bookings.activate(id);
      if (action === 'complete') await api.bookings.complete(id);
      if (action === 'return') await api.bookings.return(id);
      addToast(`Booking ${action}d`, 'success');
      load();
    } catch (err) {
      addToast(`Could not ${action} booking: ${err.message}`, 'error');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-1)' }}>Loading bookings...</div>;
  }

  return (
    <>
      <div className="ov-head" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>All Bookings</h3>
          <span style={{ fontSize: 13, color: 'var(--gray-1)' }}>{bookings.length} total</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{ color: 'var(--gray-1)', fontSize: 14, padding: '16px 0' }}>No bookings yet.</div>
      ) : (
        <div className="bk-wrap">
          {bookings.map(b => (
            <div key={b.id} className="bk-row">
              <div className="bk-car">
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {b.car ? `${b.car.brand} ${b.car.model}` : 'Vehicle'}
                  <span className="ov-id"> #{b.bookingNumber}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-1)' }}>
                  {b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : '—'} · {b.customer?.phone || '—'}
                </div>
              </div>
              <div className="bk-dates">
                <div style={{ fontSize: 12, color: 'var(--gray-1)' }}>
                  <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {dateOnly(b.pickupDate)} → {dateOnly(b.returnDate)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-1)', marginTop: 2 }}>
                  <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {b.pickupLocation} → {b.returnLocation}
                </div>
              </div>
              <div className="bk-total">{money(b.totalPrice)}</div>
              <span className="ov-badge" style={{ background: STATUS_COLORS[b.bookingStatus] || STATUS_COLORS.PENDING, color: 'var(--white)' }}>
                {b.bookingStatus}
              </span>
              {isAdmin && (b.bookingStatus === 'PENDING') && (
                <div className="bk-actions">
                  <button
                    className="btn btn-sm bk-approve"
                    disabled={busyId === b.id}
                    onClick={() => updateStatus(b.id, 'approve')}
                    title="Approve"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="btn btn-sm bk-reject"
                    disabled={busyId === b.id}
                    onClick={() => updateStatus(b.id, 'reject')}
                    title="Reject"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {isAdmin && b.bookingStatus === 'CONFIRMED' && (
                <div className="bk-actions">
                  <button
                    className="btn btn-sm bk-activate"
                    disabled={busyId === b.id}
                    onClick={() => updateStatus(b.id, 'activate')}
                    title="Activate (Mark as Picked Up)"
                  >
                    <PlayCircle size={14} />
                  </button>
                </div>
              )}
              {isAdmin && b.bookingStatus === 'ACTIVE' && (
                <div className="bk-actions">
                  <button
                    className="btn btn-sm bk-complete"
                    disabled={busyId === b.id}
                    onClick={() => updateStatus(b.id, 'complete')}
                    title="Mark as Completed"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button
                    className="btn btn-sm bk-return"
                    disabled={busyId === b.id}
                    onClick={() => updateStatus(b.id, 'return')}
                    title="Mark as Returned"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .bk-wrap { display: flex; flex-direction: column; }
        .bk-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .bk-row:last-child { border-bottom: none; }
        .bk-car { flex: 1 1 220px; min-width: 200px; }
        .bk-dates { flex: 1 1 240px; }
        .bk-total { font-weight: 800; font-size: 14px; color: var(--white); white-space: nowrap; }
        .bk-actions { display: flex; gap: 8px; }
        .bk-approve, .bk-reject {
          width: 30px; height: 30px; padding: 0; display: inline-flex;
          align-items: center; justify-content: center; border-radius: 8px;
        }
        .bk-approve { background: rgba(46,160,67,0.18); color: #3fb96f; border: 1px solid rgba(46,160,67,0.4); }
        .bk-approve:hover { background: #2ea043; color: #fff; }
        .bk-reject { background: rgba(230,57,70,0.18); color: #ff6b6b; border: 1px solid rgba(230,57,70,0.4); }
        .bk-reject:hover { background: var(--primary); color: #fff; }
        .bk-activate { background: rgba(69,123,157,0.18); color: #7fb3d8; border: 1px solid rgba(69,123,157,0.4); }
        .bk-activate:hover { background: #457b9d; color: #fff; }
        .bk-complete { background: rgba(46,160,67,0.18); color: #3fb96f; border: 1px solid rgba(46,160,67,0.4); }
        .bk-complete:hover { background: #2ea043; color: #fff; }
        .bk-return { background: rgba(244,162,97,0.18); color: #f4a261; border: 1px solid rgba(244,162,97,0.4); }
        .bk-return:hover { background: #e09f3e; color: #fff; }
      `}</style>
    </>
  );
}
