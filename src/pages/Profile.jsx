import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, Star, Car, DollarSign, Award, Edit2, Save, X, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { user, updateUser, bookings, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, licenseNumber: user.licenseNumber });

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const tierColors = { Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#fbbf24', Platinum: '#e5e4e2' };
  const completedBookings = bookings.filter(b => ['confirmed', 'upcoming', 'completed'].includes(b.status)).length;

  const stats = [
    { icon: Car, label: 'Total Trips', value: user.totalTrips },
    { icon: DollarSign, label: 'Total Spent', value: `$${user.totalSpent.toLocaleString()}` },
    { icon: Star, label: 'Loyalty Points', value: user.loyaltyPoints.toLocaleString() },
    { icon: Award, label: 'Member Tier', value: user.tier },
  ];

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">My Profile</span></div>
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="avatar-wrap">
                <img src={user.avatar} alt={user.name} />
                <button className="avatar-edit"><Camera size={14} /></button>
              </div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
              <div className="tier-badge" style={{ color: tierColors[user.tier] }}>
                <Award size={14} /> {user.tier} Member
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-1)', marginTop: 6 }}>Member since {user.joinDate}</div>
            </div>

            {/* Stats */}
            <div className="stats-cards">
              {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon"><s.icon size={18} /></div>
                  <div>
                    <div className="stat-card-value">{s.value}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="profile-main">
            {/* Personal Info */}
            <div className="profile-section">
              <div className="section-head">
                <h3>Personal Information</h3>
                {!editing ? (
                  <button className="edit-btn" onClick={() => setEditing(true)}><Edit2 size={15} /> Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="edit-btn save" onClick={handleSave}><Save size={15} /> Save</button>
                    <button className="edit-btn" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
                  </div>
                )}
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label"><User size={13} /> Full Name</label>
                  {editing ? (
                    <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  ) : (
                    <div className="info-value">{user.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label"><Mail size={13} /> Email Address</label>
                  {editing ? (
                    <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  ) : (
                    <div className="info-value">{user.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label"><Phone size={13} /> Phone Number</label>
                  {editing ? (
                    <input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  ) : (
                    <div className="info-value">{user.phone}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label"><Shield size={13} /> License Number</label>
                  {editing ? (
                    <input className="form-control" value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} />
                  ) : (
                    <div className="info-value">{user.licenseNumber}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Loyalty */}
            <div className="profile-section">
              <div className="section-head"><h3>Loyalty Program</h3></div>
              <div className="loyalty-card">
                <div className="loyalty-header">
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: tierColors[user.tier] }}>{user.loyaltyPoints.toLocaleString()}</div>
                    <div style={{ color: 'var(--gray-1)', fontSize: 14 }}>Loyalty Points</div>
                  </div>
                  <div className="loyalty-tier" style={{ borderColor: tierColors[user.tier], color: tierColors[user.tier] }}>
                    <Award size={20} /> {user.tier}
                  </div>
                </div>
                <div className="loyalty-bar-wrap">
                  <div className="loyalty-bar-label">
                    <span>{user.tier}</span><span>Platinum</span>
                  </div>
                  <div className="loyalty-bar">
                    <div className="loyalty-fill" style={{ width: `${Math.min(100, (user.loyaltyPoints / 5000) * 100)}%`, background: tierColors[user.tier] }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-1)', marginTop: 6 }}>{5000 - user.loyaltyPoints} points to Platinum</div>
                </div>
                <div className="loyalty-perks">
                  {['Priority booking', 'Exclusive discounts', 'Free upgrades', 'VIP support'].map(p => (
                    <div key={p} className="perk-item">✓ {p}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="profile-section">
              <div className="section-head">
                <h3>Recent Bookings</h3>
                <Link to="/my-bookings" className="edit-btn">View All</Link>
              </div>
              {bookings.slice(0, 3).map(b => (
                <div key={b.id} className="recent-booking">
                  <img src={b.carImage} alt={b.carName} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{b.carName}</div>
                    <div style={{ color: 'var(--gray-1)', fontSize: 13 }}>{b.pickupDate} · {b.location}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 800 }}>${b.total}</div>
                    <span className={`status-dot ${b.status}`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
        .profile-sidebar { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 20px; }
        .profile-card { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; text-align: center; }
        .avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
        .avatar-wrap img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); }
        .avatar-edit {
          position: absolute; bottom: 0; right: 0;
          background: var(--primary); border: none; color: #fff;
          width: 26px; height: 26px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .profile-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .profile-email { font-size: 13px; color: var(--gray-1); margin-bottom: 12px; }
        .tier-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; }
        .stats-cards { display: flex; flex-direction: column; gap: 10px; }
        .stat-card { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
        .stat-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(230,57,70,0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-card-value { font-size: 16px; font-weight: 800; }
        .stat-card-label { font-size: 12px; color: var(--gray-1); }
        .profile-main { display: flex; flex-direction: column; gap: 24px; }
        .profile-section { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .section-head h3 { font-size: 18px; font-weight: 700; }
        .edit-btn { display: flex; align-items: center; gap: 6px; background: var(--dark-3); border: 1px solid var(--border); color: var(--gray-1); padding: 7px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: inherit; text-decoration: none; }
        .edit-btn:hover { border-color: var(--primary); color: var(--primary); }
        .edit-btn.save { background: rgba(46,160,67,0.1); border-color: var(--success); color: var(--success); }
        .info-value { background: var(--dark-3); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 16px; font-size: 15px; color: var(--white); }
        .loyalty-card { background: var(--dark-3); border-radius: var(--radius-lg); padding: 20px; }
        .loyalty-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .loyalty-tier { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 800; border: 2px solid; padding: 8px 16px; border-radius: 100px; }
        .loyalty-bar-wrap { margin-bottom: 16px; }
        .loyalty-bar-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--gray-1); margin-bottom: 6px; }
        .loyalty-bar { height: 8px; background: var(--dark-2); border-radius: 100px; overflow: hidden; }
        .loyalty-fill { height: 100%; border-radius: 100px; transition: width 0.8s ease; }
        .loyalty-perks { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .perk-item { font-size: 13px; color: var(--success); font-weight: 500; }
        .recent-booking { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
        .recent-booking:last-child { border-bottom: none; padding-bottom: 0; }
        .recent-booking img { width: 60px; height: 40px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .status-dot { font-size: 11px; font-weight: 600; text-transform: capitalize; padding: 2px 8px; border-radius: 100px; background: rgba(255,255,255,0.06); color: var(--gray-1); }
        .status-dot.confirmed { color: var(--success); background: rgba(46,160,67,0.1); }
        .status-dot.upcoming { color: var(--secondary-light); background: rgba(69,123,157,0.1); }
        @media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr; } .profile-sidebar { position: static; } }
      `}</style>
    </main>
  );
}
