import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Eye, X, Download, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusColors = {
  confirmed: { bg: 'rgba(46,160,67,0.15)', color: 'var(--success)', label: '● Confirmed' },
  upcoming: { bg: 'rgba(69,123,157,0.15)', color: 'var(--secondary-light)', label: '● Upcoming' },
  cancelled: { bg: 'rgba(139,148,158,0.12)', color: 'var(--gray-1)', label: '● Cancelled' },
  completed: { bg: 'rgba(244,162,97,0.15)', color: 'var(--accent)', label: '● Completed' },
};

export default function MyBookings() {
  const { bookings, cancelBooking, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [cancelId, setCancelId] = useState(null);

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchQuery = b.carName.toLowerCase().includes(query.toLowerCase()) || b.id.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  const handleCancel = (id) => {
    cancelBooking(id);
    setCancelId(null);
    addToast('Booking cancelled successfully.', 'info');
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">My Bookings</span></div>
          <h1>My Bookings</h1>
          <p>Manage and track all your car rental bookings.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Toolbar */}
        <div className="mb-toolbar">
          <div className="search-wrap" style={{ maxWidth: 320 }}>
            <Search size={15} />
            <input placeholder="Search bookings..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="mb-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`cat-tab${filter === t.key ? ' active' : ''}`} onClick={() => setFilter(t.key)}>
                {t.label} {t.key === 'all' && <span className="tab-count">{bookings.length}</span>}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📋</div>
            <h3>No bookings found</h3>
            <p>{filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings.`}</p>
            <Link to="/booking" className="btn btn-primary">Book a Car</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(b => {
              const sc = statusColors[b.status] || statusColors.confirmed;
              const canCancel = ['confirmed', 'upcoming'].includes(b.status);
              return (
                <div key={b.id} className="booking-item">
                  <div className="bi-img">
                    <img src={b.carImage} alt={b.carName} />
                  </div>
                  <div className="bi-main">
                    <div className="bi-top">
                      <div>
                        <div className="bi-id">#{b.id}</div>
                        <div className="bi-car">{b.carName}</div>
                      </div>
                      <span className="bi-status" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                    <div className="bi-details">
                      <div className="bi-detail"><Calendar size={14} /><span>{b.pickupDate} → {b.returnDate} ({b.days} days)</span></div>
                      <div className="bi-detail"><MapPin size={14} /><span>{b.location}</span></div>
                    </div>
                    <div className="bi-footer">
                      <div className="bi-price">GHS {b.total}</div>
                      <div className="bi-actions">
                        <Link to={`/cars/${b.carId}`} className="bi-action"><Eye size={15} /> View Car</Link>
                        <button className="bi-action"><Download size={15} /> Receipt</button>
                        {canCancel && <button className="bi-action danger" onClick={() => setCancelId(b.id)}><X size={15} /> Cancel</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelId && (
        <div className="modal-overlay" onClick={() => setCancelId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Booking?</h3>
            <p>Are you sure you want to cancel booking <strong>{cancelId}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setCancelId(null)}>Keep Booking</button>
              <button className="btn btn-primary" onClick={() => handleCancel(cancelId)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mb-toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .mb-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .tab-count {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.1); width: 20px; height: 20px;
          border-radius: 50%; font-size: 11px; margin-left: 4px;
        }
        .bookings-list { display: flex; flex-direction: column; gap: 16px; }
        .booking-item {
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); overflow: hidden;
          display: flex; transition: all var(--transition);
        }
        .booking-item:hover { border-color: rgba(255,255,255,0.15); }
        .bi-img { width: 180px; flex-shrink: 0; }
        .bi-img img { width: 100%; height: 100%; object-fit: cover; }
        .bi-main { flex: 1; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
        .bi-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .bi-id { font-size: 12px; color: var(--gray-1); margin-bottom: 4px; }
        .bi-car { font-size: 18px; font-weight: 700; }
        .bi-status { padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; }
        .bi-details { display: flex; gap: 20px; flex-wrap: wrap; }
        .bi-detail { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--gray-1); }
        .bi-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .bi-price { font-size: 22px; font-weight: 800; color: var(--primary); }
        .bi-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .bi-action {
          display: flex; align-items: center; gap: 6px;
          background: var(--dark-3); border: 1px solid var(--border);
          color: var(--gray-1); padding: 7px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; font-family: inherit; text-decoration: none;
        }
        .bi-action:hover { border-color: rgba(255,255,255,0.2); color: var(--white); }
        .bi-action.danger:hover { border-color: var(--primary); color: var(--primary); background: rgba(230,57,70,0.08); }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center; z-index: 9000;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 32px; max-width: 420px; width: 90%;
        }
        .modal h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .modal p { color: var(--gray-1); font-size: 15px; margin-bottom: 24px; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
        @media (max-width: 640px) {
          .booking-item { flex-direction: column; }
          .bi-img { width: 100%; height: 160px; }
          .bi-main { padding: 16px; }
        }
      `}</style>
    </main>
  );
}
