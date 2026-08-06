import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, ChevronDown, User, BookOpen, LogOut, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, isAuthenticated, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropOpen(false);
  }, [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Cars for Sale' },
    { to: '/rentals', label: 'Car Rentals' },
    { to: '/parts', label: 'Auto Parts' },
    { to: '/towing', label: 'Towing Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"><Car size={20} /></div>
          <span>AMK <strong>Motors & AutoCare</strong></span>
        </Link>

        {/* Desktop nav */}
        <ul className="navbar-links">
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <div className="user-drop" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
                <button className="user-btn" aria-label={`Account menu for ${user.name}`} aria-expanded={dropOpen} aria-haspopup="true">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropOpen && (
                  <div className="user-dropdown">
                    <div className="drop-header">
                      <img src={user.avatar} alt={user.name} />
                      <div>
                        <div className="drop-name">{user.name}</div>
                        <div className="drop-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="drop-divider" />
                    <Link to="/profile" className="drop-item"><User size={15} /> My Profile</Link>
                    <Link to="/my-bookings" className="drop-item"><BookOpen size={15} /> My Bookings</Link>
                    <Link to="/admin" className="drop-item"><Settings size={15} /> Admin Dashboard</Link>
                    <div className="drop-divider" />
                    <button className="drop-item danger" onClick={handleLogout}><LogOut size={15} /> Sign Out</button>
                  </div>
                )}
              </div>
              <Link to="/booking" className="btn btn-primary btn-sm">Book Now</Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="menu-toggle" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="mobile-divider" />
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="mobile-link">My Profile</Link>
              <Link to="/my-bookings" className="mobile-link">My Bookings</Link>
              <Link to="/admin" className="mobile-link">Admin Dashboard</Link>
              <button onClick={handleLogout} style={{ width: '100%', padding: '14px 24px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '15px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
              <Link to="/booking" className="btn btn-primary btn-block" style={{ margin: '12px 20px 0', width: 'calc(100% - 40px)' }}>Book Now</Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-outline btn-block" style={{ margin: '12px 20px', width: 'calc(100% - 40px)' }}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-block" style={{ margin: '12px 20px', width: 'calc(100% - 40px)' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 16px 0;
          background: transparent;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(13,17,23,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 12px 0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .navbar-inner {
          display: flex; align-items: center; gap: 32px;
        }
        .navbar-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 20px; font-weight: 700; color: #fff;
          text-decoration: none; flex-shrink: 0;
        }
        .logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--primary);
          display: flex; align-items: center; justify-content: center;
        }
        .navbar-links {
          display: flex; align-items: center; gap: 4px;
          list-style: none; margin: 0; flex: 1;
        }
        .navbar-links a {
          padding: 8px 14px; border-radius: 8px;
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.7);
          transition: all 0.2s ease; text-decoration: none;
          display: block;
        }
        .navbar-links a:hover, .navbar-links a.active {
          color: #fff; background: rgba(255,255,255,0.06);
        }
        .navbar-links a.active { color: var(--primary); }
        .navbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .btn-outline {
          background: transparent;
          border: 1px solid var(--primary) !important;
          color: var(--primary) !important;
        }
        .btn-outline:hover {
          background: rgba(230, 57, 70, 0.1) !important;
        }
        .user-drop { position: relative; }
        .user-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; border-radius: 100px; padding: 6px 14px 6px 6px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: all 0.2s;
        }
        .user-btn:hover { background: rgba(255,255,255,0.1); }
        .user-btn img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
        .user-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 8px;
          min-width: 220px; box-shadow: var(--shadow-lg);
          animation: fadeInUp 0.2s ease;
        }
        .drop-header {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 8px 12px;
        }
        .drop-header img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .drop-name { font-weight: 600; font-size: 14px; }
        .drop-email { font-size: 12px; color: var(--gray-1); }
        .drop-divider { height: 1px; background: var(--border); margin: 4px 0; }
        .drop-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 8px;
          font-size: 14px; color: rgba(255,255,255,0.8);
          cursor: pointer; transition: all 0.2s;
          width: 100%; border: none; background: none; text-align: left;
          font-family: inherit; text-decoration: none;
        }
        .drop-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .drop-item.danger { color: var(--primary); }
        .drop-item.danger:hover { background: rgba(230,57,70,0.1); }
        .menu-toggle {
          display: none; background: none; border: none; color: #fff; padding: 4px;
        }
        .mobile-menu {
          display: flex; flex-direction: column;
          background: rgba(13,17,23,0.98);
          border-top: 1px solid var(--border);
          padding-bottom: 20px;
        }
        .mobile-link {
          padding: 14px 24px; font-size: 15px; font-weight: 500;
          color: rgba(255,255,255,0.8); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s;
        }
        .mobile-link.active, .mobile-link:hover { color: var(--primary); }
        .mobile-divider { height: 1px; background: var(--border); margin: 8px 0; }
        @media (max-width: 768px) {
          .navbar-links, .navbar-right { display: none; }
          .menu-toggle { display: flex; }
          .mobile-menu { display: flex; }
        }
      `}</style>
    </nav>
  );
}
