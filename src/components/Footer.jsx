import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon"><Car size={18} /></div>
              <span>Drive<strong>Elite</strong></span>
            </Link>
            <p>Premium car rentals for every occasion. Experience luxury, comfort, and reliability wherever your journey takes you.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Our Fleet</Link></li>
              <li><Link to="/pricing">Pricing Plans</Link></li>
              <li><Link to="/locations">Locations</Link></li>
              <li><Link to="/booking">Book Now</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li><Mail size={15} /><a href="mailto:hello@driveelite.com">hello@driveelite.com</a></li>
              <li><Phone size={15} /><a href="tel:+18005550100">+1 (800) 555-0100</a></li>
              <li><MapPin size={15} /><span>150 W 51st St, New York, NY 10019</span></li>
            </ul>
            <div className="footer-badge">
              <span>🏆 Best Rental Service 2024</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DriveElite. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--dark-2);
          border-top: 1px solid var(--border);
          padding: 64px 0 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          padding-bottom: 48px;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 20px; font-weight: 700; color: #fff;
          text-decoration: none; margin-bottom: 16px;
        }
        .logo-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: var(--primary);
          display: flex; align-items: center; justify-content: center;
        }
        .footer-brand p {
          color: var(--gray-1); font-size: 14px; line-height: 1.7; margin-bottom: 20px;
        }
        .footer-socials {
          display: flex; gap: 10px;
        }
        .footer-socials a {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--gray-1); transition: all 0.2s;
        }
        .footer-socials a:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
        .footer-col h4 {
          font-size: 14px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: var(--white); margin-bottom: 20px;
        }
        .footer-col ul { list-style: none; }
        .footer-col ul li { margin-bottom: 10px; }
        .footer-col ul a {
          color: var(--gray-1); font-size: 14px;
          text-decoration: none; transition: color 0.2s;
        }
        .footer-col ul a:hover { color: var(--primary); }
        .contact-list li {
          display: flex !important; align-items: flex-start; gap: 10px;
          color: var(--gray-1); font-size: 14px;
        }
        .contact-list li svg { flex-shrink: 0; margin-top: 2px; color: var(--primary); }
        .contact-list a { color: var(--gray-1); transition: color 0.2s; }
        .contact-list a:hover { color: var(--primary); }
        .footer-badge {
          margin-top: 20px; display: inline-block;
          padding: 8px 14px; background: rgba(244,162,97,0.1);
          border: 1px solid rgba(244,162,97,0.2); border-radius: 10px;
          font-size: 13px; color: var(--accent); font-weight: 600;
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 20px 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-bottom p { color: var(--gray-2); font-size: 13px; }
        .footer-bottom-links { display: flex; gap: 24px; }
        .footer-bottom-links a {
          color: var(--gray-2); font-size: 13px;
          text-decoration: none; transition: color 0.2s;
        }
        .footer-bottom-links a:hover { color: var(--primary); }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
