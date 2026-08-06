import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, MapPin, Car, ArrowRight, CheckCircle, Linkedin, Twitter } from 'lucide-react';

const team = [
  { name: 'Jonathan Pierce', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80', linkedin: '#', twitter: '#' },
  { name: 'Amanda Chen', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80', linkedin: '#', twitter: '#' },
  { name: 'Marcus Rivera', role: 'Fleet Director', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80', linkedin: '#', twitter: '#' },
  { name: 'Sofia Williams', role: 'Customer Experience', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80', linkedin: '#', twitter: '#' },
];

const milestones = [
    { year: '2015', title: 'Founded in Accra', desc: 'AMK Motors & AutoCare started with just 12 premium vehicles and a vision for quality car rentals.' },
  { year: '2017', title: 'Expanded to 5 Cities', desc: 'Rapid growth took us to Kumasi, Takoradi, Tema and Sekondi.' },
  { year: '2019', title: 'Launched Electric Fleet', desc: 'Pioneered EV rentals on the East Coast with our Tesla lineup.' },
  { year: '2021', title: '50,000 Happy Customers', desc: 'Reached our first major milestone and launched our loyalty program.' },
  { year: '2024', title: 'Best Rental Service Award', desc: 'Recognized as the #1 premium car rental service in North America.' },
];

export default function About() {
  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">About Us</span></div>
                <h1>About AMK Motors & AutoCare</h1>
          <p>Our story, our values, and the team behind the wheel.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="about-mission">
            <div className="mission-text">
              <div className="label">Our Mission</div>
              <h2>Redefining Premium Car Rental</h2>
              <p>At AMK Motors & AutoCare, we believe every journey should be extraordinary. We're not just renting cars — we're curating experiences that match the ambition and lifestyle of our clients.</p>
              <p style={{ marginTop: 16, color: 'var(--gray-1)' }}>From the moment you browse our fleet to the second you return the keys, every touchpoint is designed to deliver seamless luxury and peace of mind.</p>
              <ul className="about-list">
                {['Hand-inspected, showroom-ready vehicles', 'Transparent pricing with no hidden fees', 'Award-winning 24/7 customer support', 'Flexible booking & free cancellation policies'].map(i => (
                  <li key={i}><CheckCircle size={17} color="var(--success)" />{i}</li>
                ))}
              </ul>
              <Link to="/booking" className="btn btn-primary" style={{ marginTop: 28 }}>Book Your Ride <ArrowRight size={16} /></Link>
            </div>
            <div className="mission-img">
                  <img src="https://images.unsplash.com/photo-1583267746897-2cf415887172?w=700&q=80" alt="About AMK Motors & AutoCare" />
              <div className="mission-badge">
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)' }}>10+</div>
                <div style={{ fontSize: 13, color: 'var(--gray-1)', fontWeight: 500 }}>Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="about-stats">
            {[
              { icon: Car, value: '500+', label: 'Premium Vehicles' },
              { icon: Users, value: '50K+', label: 'Happy Customers' },
              { icon: MapPin, value: '25+', label: 'Locations' },
              { icon: Award, value: '#1', label: 'Rental Service 2024' },
            ].map((s, i) => (
              <div key={i} className="about-stat">
                <div className="about-stat-icon"><s.icon size={24} /></div>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="label">Our Journey</div>
            <h2>From Startup to Industry Leader</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`timeline-item${i % 2 === 0 ? ' left' : ' right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{m.year}</div>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
                <div className="timeline-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="label">The Team</div>
            <h2>Meet the People Behind AMK Motors & AutoCare</h2>
            <p>Passionate individuals dedicated to delivering exceptional experiences.</p>
          </div>
          <div className="grid grid-4">
            {team.map((m, i) => (
              <div key={i} className="team-card card">
                <div className="team-img"><img src={m.img} alt={m.name} /></div>
                <div className="team-info">
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                  <div className="team-socials">
                    <a href={m.linkedin}><Linkedin size={16} /></a>
                    <a href={m.twitter}><Twitter size={16} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .about-mission { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .mission-text h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; }
        .mission-text p { color: var(--gray-1); font-size: 16px; line-height: 1.7; }
        .about-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
        .about-list li { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
        .mission-img { position: relative; border-radius: var(--radius-lg); overflow: visible; }
        .mission-img img { width: 100%; border-radius: var(--radius-lg); height: 420px; object-fit: cover; }
        .mission-badge {
          position: absolute; bottom: -20px; right: -20px;
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 20px 24px;
          text-align: center; box-shadow: var(--shadow-lg);
        }
        .about-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .about-stat { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px 24px; text-align: center; }
        .about-stat-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(230,57,70,0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .about-stat-value { font-size: 32px; font-weight: 800; color: var(--primary); }
        .about-stat-label { font-size: 14px; color: var(--gray-1); }
        .timeline { position: relative; max-width: 800px; margin: 0 auto; }
        .timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: var(--border); transform: translateX(-50%); }
        .timeline-item { display: flex; justify-content: flex-end; padding-right: calc(50% + 30px); margin-bottom: 32px; position: relative; }
        .timeline-item.right { justify-content: flex-start; padding-right: 0; padding-left: calc(50% + 30px); }
        .timeline-content { background: var(--dark-3); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; max-width: 300px; }
        .timeline-year { font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
        .timeline-content h4 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
        .timeline-content p { font-size: 13px; color: var(--gray-1); line-height: 1.5; }
        .timeline-dot { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 14px; height: 14px; background: var(--primary); border-radius: 50%; border: 3px solid var(--dark-2); }
        .team-card { text-align: center; }
        .team-img { height: 200px; overflow: hidden; }
        .team-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .team-card:hover .team-img img { transform: scale(1.05); }
        .team-info { padding: 16px; }
        .team-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .team-role { font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 12px; }
        .team-socials { display: flex; justify-content: center; gap: 8px; }
        .team-socials a { width: 30px; height: 30px; border-radius: 8px; background: var(--dark-3); display: flex; align-items: center; justify-content: center; color: var(--gray-1); transition: all 0.2s; }
        .team-socials a:hover { background: var(--primary); color: #fff; }
        @media (max-width: 900px) {
          .about-mission { grid-template-columns: 1fr; gap: 40px; }
          .mission-badge { right: 0; bottom: -16px; }
          .about-stats { grid-template-columns: repeat(2, 1fr); }
          .timeline::before { left: 20px; }
          .timeline-item, .timeline-item.right { padding: 0 0 0 56px; justify-content: flex-start; }
          .timeline-dot { left: 20px; }
        }
      `}</style>
    </main>
  );
}
