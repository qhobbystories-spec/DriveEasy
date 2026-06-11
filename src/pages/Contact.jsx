import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const { addToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { addToast('Please fill all required fields.', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    addToast('Message sent! We\'ll be in touch shortly.', 'success');
  };

  const contacts = [
    { icon: Phone, label: 'Phone', value: '+1 (800) 555-0100', sub: 'Mon–Sun, 8am–10pm', href: 'tel:+18005550100' },
    { icon: Mail, label: 'Email', value: 'hello@driveelite.com', sub: 'We reply within 2 hours', href: 'mailto:hello@driveelite.com' },
    { icon: MapPin, label: 'Headquarters', value: '150 W 51st St, New York', sub: 'NY 10019, USA', href: '#' },
    { icon: Clock, label: 'Support Hours', value: '24/7 Roadside Assistance', sub: 'Office: Mon–Fri 8am–6pm', href: '#' },
  ];

  const subjects = ['General Inquiry', 'Booking Support', 'Billing & Payments', 'Fleet Inquiry', 'Partnership', 'Media & Press', 'Other'];

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">Contact Us</span></div>
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our friendly team is always here to help.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Contact info cards */}
          <div className="grid grid-4" style={{ marginBottom: 64 }}>
            {contacts.map((c, i) => (
              <a key={i} href={c.href} className="contact-card">
                <div className="contact-icon"><c.icon size={22} /></div>
                <div className="contact-label">{c.label}</div>
                <div className="contact-value">{c.value}</div>
                <div className="contact-sub">{c.sub}</div>
              </a>
            ))}
          </div>

          <div className="contact-layout">
            {/* Form */}
            <div className="contact-form-wrap">
              <div className="contact-form-header">
                <MessageSquare size={22} color="var(--primary)" />
                <div>
                  <h2>Send Us a Message</h2>
                  <p style={{ color: 'var(--gray-1)', fontSize: 14, marginTop: 2 }}>We typically respond within 2 business hours.</p>
                </div>
              </div>

              {sent ? (
                <div className="sent-success">
                  <CheckCircle size={48} color="var(--success)" />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will get back to you shortly at <strong>{form.email}</strong>.</p>
                  <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input className="form-control" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-control" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select className="form-control" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                        <option value="">Select a subject</option>
                        {subjects.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-control" rows={5} placeholder="How can we help you?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className={`btn btn-primary btn-block${loading ? ' loading' : ''}`} disabled={loading}>
                    {loading ? <><span className="spinner" /> Sending...</> : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* Map placeholder + FAQ */}
            <div className="contact-right">
              <div className="map-placeholder">
                <div className="map-pin-center">
                  <MapPin size={40} color="var(--primary)" />
                  <div style={{ fontWeight: 700, marginTop: 12 }}>DriveElite HQ</div>
                  <div style={{ color: 'var(--gray-1)', fontSize: 13 }}>150 W 51st St, New York, NY</div>
                </div>
                <div className="map-bg" />
              </div>

              <div className="contact-hours">
                <h4>Office Hours</h4>
                <div className="hours-row"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM</span></div>
                <div className="hours-row"><span>Saturday</span><span>9:00 AM – 4:00 PM</span></div>
                <div className="hours-row"><span>Sunday</span><span>Closed</span></div>
                <div className="hours-note">🚗 Roadside assistance available 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-card {
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px 20px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 8px; text-decoration: none;
          transition: all var(--transition);
        }
        .contact-card:hover { border-color: var(--primary); transform: translateY(-4px); }
        .contact-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(230,57,70,0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; }
        .contact-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-1); }
        .contact-value { font-size: 15px; font-weight: 700; color: var(--white); }
        .contact-sub { font-size: 12px; color: var(--gray-2); }
        .contact-layout { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
        .contact-form-wrap { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; }
        .contact-form-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 28px; }
        .contact-form-header h2 { font-size: 22px; font-weight: 700; }
        .sent-success { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .sent-success h3 { font-size: 24px; font-weight: 700; }
        .sent-success p { color: var(--gray-1); }
        .spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.7s linear infinite; display: inline-block; }
        .map-placeholder {
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); height: 240px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; margin-bottom: 20px;
        }
        .map-bg {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
        }
        .map-pin-center { position: relative; z-index: 1; text-align: center; }
        .contact-hours { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .contact-hours h4 { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
        .hours-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--gray-1); margin-bottom: 8px; }
        .hours-note { font-size: 13px; color: var(--accent); margin-top: 12px; border-top: 1px solid var(--border); padding-top: 12px; }
        @media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
