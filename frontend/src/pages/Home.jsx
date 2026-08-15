import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, ArrowRight, Star, Shield, Clock, HeadphonesIcon, ChevronRight, Play, CheckCircle, Crown, Zap, Gauge, Car, Truck } from 'lucide-react';
import CarCard from '../components/CarCard';
import { testimonials } from '../data/testimonials';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { cars } = useApp();
  const [search, setSearch] = useState({ location: '', pickup: '', return: '', maxPrice: '' });

  const featured = cars.filter(c => c.available).slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.location) params.set('location', search.location);
    if (search.maxPrice) params.set('maxPrice', search.maxPrice);
    navigate(`/cars?${params.toString()}`);
  };

  const stats = [
    { value: '1000+', label: 'Vehicles in Stock' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '25+', label: 'Service Locations' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  const features = [
    { icon: Shield, title: 'Quality Assured Vehicles', desc: 'All cars are inspected and certified. Parts authentic and OEM verified.' },
    { icon: Clock, title: '24/7 Service & Support', desc: 'Round-the-clock support for rentals, sales, parts, and emergency towing.' },
    { icon: MapPin, title: 'Multiple Locations', desc: 'Service centers and pickup points across 25+ locations nationwide.' },
    { icon: HeadphonesIcon, title: 'Expert Assistance', desc: 'Professional staff ready to help with sales, rentals, parts, and roadside assistance.' },
  ];

  const categories = [
    { label: 'Luxury', count: 48, Icon: Crown, color: '#e63946' },
    { label: 'Electric', count: 32, Icon: Zap, color: '#2ea043' },
    { label: 'Sports', count: 24, Icon: Gauge, color: '#f4a261' },
    { label: 'SUV', count: 56, Icon: Car, color: '#457b9d' },
    { label: 'Economy', count: 88, Icon: Car, color: '#8b949e' },
    { label: 'Van', count: 18, Icon: Truck, color: '#d29922' },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80" alt="Hero" />
          <div className="hero-overlay" />
        </div>

        <div className="container hero-content">
          <div className="hero-text animate-fadeInUp">
            <div className="hero-badge">
              <span><Gauge size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /></span> Complete Automotive Solutions
            </div>
            <h1>
              Your Trusted Partner<br />
              <span className="hero-accent">For All Automotive Needs</span>
            </h1>
            <p>Buy quality vehicles, rent premium cars, find auto parts, or get reliable towing services. One-stop solution for all your automotive needs.</p>
            <div className="hero-actions">
              <Link to="/cars" className="btn btn-primary btn-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <button className="btn-play">
                <div className="play-circle"><Play size={14} fill="white" /></div>
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Search form */}
          <form className="search-form" onSubmit={handleSearch}>
            <h3>What Are You Looking For?</h3>
            <div className="search-grid">
              <div className="search-field">
                <label><MapPin size={14} /> Location</label>
                <select value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}>
                  <option value="">Any Location</option>
                  <option>Accra</option>
                  <option>Kumasi</option>
                  <option>Takoradi</option>
                  <option>Tema</option>
                  <option>Sekondi</option>
                  <option>Cape Coast</option>
                </select>
              </div>
              <div className="search-field">
                <label><Calendar size={14} /> Pick-up Date</label>
                <input type="date" value={search.pickup} onChange={e => setSearch(s => ({ ...s, pickup: e.target.value }))} />
              </div>
              <div className="search-field">
                <label><Calendar size={14} /> Return Date</label>
                <input type="date" value={search.return} onChange={e => setSearch(s => ({ ...s, return: e.target.value }))} />
              </div>
              <div className="search-field">
                <label><DollarSign size={14} /> Max Budget/Day</label>
                <select value={search.maxPrice} onChange={e => setSearch(s => ({ ...s, maxPrice: e.target.value }))}>
                  <option value="">Any Budget</option>
                  <option value="50">Up to GHS 50</option>
                  <option value="100">Up to GHS 100</option>
                  <option value="150">Up to GHS 150</option>
                  <option value="200">Up to GHS 200</option>
                  <option value="999">GHS 200+</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              <Search size={18} /> Search Available Cars
            </button>
          </form>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="container stats-inner">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="label">Browse by Type</div>
            <h2>Find Your Category</h2>
            <p>From nimble city cars to roaring supercars, we have the perfect vehicle for every occasion.</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link key={i} to={`/cars?category=${cat.label}`} className="cat-card">
                <div className="cat-emoji"><cat.Icon size={28} /></div>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-count">{cat.count} cars</div>
                <ChevronRight size={16} className="cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div className="label">Hand-Picked for You</div>
            <h2>Featured Vehicles</h2>
            <p>Our most sought-after cars, ready for your next adventure.</p>
          </div>
          <div className="grid grid-3">
            {featured.map(car => <CarCard key={car.id} car={car} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/cars" className="btn btn-outline btn-lg">
              View All Vehicles <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <div className="label">Why AMK Motors & AutoCare</div>
              <h2>The Premium Rental Experience</h2>
              <p>We go beyond just handing you keys. Every detail of your rental experience is crafted for excellence.</p>
              <ul className="why-list">
                {['No hidden fees — ever', 'Free cancellation on all plans', 'Sanitized & inspected vehicles', 'Instant booking confirmation'].map((item, i) => (
                  <li key={i}><CheckCircle size={18} color="var(--success)" />{item}</li>
                ))}
              </ul>
              <Link to="/about" className="btn btn-primary" style={{ marginTop: 24 }}>
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
            <div className="why-right">
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">
                    <f.icon size={22} />
                  </div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-card">
            <div className="promo-content">
              <div className="promo-label">Limited Time Offer</div>
              <h2>Get 20% Off Your First Booking</h2>
              <p>Use code <strong>ELITE20</strong> at checkout and enjoy a premium ride at an incredible price.</p>
              <Link to="/booking" className="btn btn-primary btn-lg">
                Claim Offer <ArrowRight size={18} />
              </Link>
            </div>
            <div className="promo-img">
              <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80" alt="Promo car" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="label">What Clients Say</div>
            <h2>Trusted by Thousands</h2>
            <p>Real stories from real customers who chose AMK Motors & AutoCare for their journeys.</p>
          </div>
          <div className="grid grid-2" style={{ gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card card">
                <div className="testi-header">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                  <div className="stars" style={{ marginLeft: 'auto' }}>
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                </div>
                <p className="testi-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Hit the Road?</h2>
          <p>Browse our full fleet and find the perfect car for your next trip.</p>
          <div className="cta-buttons">
            <Link to="/booking" className="btn btn-primary btn-lg">Book Now <ArrowRight size={18} /></Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero */
        .hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; }
        .hero-bg { position: absolute; inset: 0; }
        .hero-bg img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.65) 60%, rgba(13,17,23,0.3) 100%);
        }
        .hero-content {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 400px;
          gap: 60px; align-items: center;
          padding-top: 140px; padding-bottom: 80px; flex: 1;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(230,57,70,0.15); border: 1px solid rgba(230,57,70,0.3);
          color: var(--primary); padding: 8px 18px; border-radius: 100px;
          font-size: 13px; font-weight: 600; margin-bottom: 24px;
        }
        .hero-text h1 {
          font-size: clamp(40px, 6vw, 72px); font-weight: 900;
          line-height: 1.1; margin-bottom: 20px;
        }
        .hero-accent { color: var(--primary); }
        .hero-text p {
          font-size: 18px; color: rgba(255,255,255,0.75); margin-bottom: 36px; max-width: 500px;
        }
        .hero-actions { display: flex; align-items: center; gap: 20px; }
        .btn-play {
          display: flex; align-items: center; gap: 12px;
          background: none; border: none; color: #fff; font-size: 15px; cursor: pointer;
          font-family: inherit; font-weight: 600;
        }
        .play-circle {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .btn-play:hover .play-circle { background: var(--primary); border-color: var(--primary); }

        /* Search form */
        .search-form {
          background: rgba(22,27,34,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 28px;
        }
        .search-form h3 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .search-grid { display: grid; gap: 16px; margin-bottom: 20px; }
        .search-field label {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: var(--gray-1);
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
        }
        .search-field input, .search-field select {
          width: 100%; padding: 11px 14px;
          background: var(--dark-3); border: 1px solid var(--border);
          border-radius: 10px; color: #fff; font-size: 14px; outline: none;
          transition: border-color 0.2s;
          appearance: none;
        }
        .search-field select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
        }
        .search-field input:focus, .search-field select:focus { border-color: var(--primary); }
        .search-field input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }

        /* Stats bar */
        .stats-bar {
          position: relative; z-index: 1;
          background: rgba(22,27,34,0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .stats-inner {
          display: flex; justify-content: center;
          padding: 24px;
        }
        .stat-item {
          flex: 1; text-align: center;
          padding: 0 24px; max-width: 200px;
        }
        .stat-item + .stat-item { border-left: 1px solid var(--border); }
        .stat-value { font-size: 28px; font-weight: 800; color: var(--primary); }
        .stat-label { font-size: 13px; color: var(--gray-1); font-weight: 500; }

        /* Categories */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        .cat-card {
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px 16px;
          text-align: center; cursor: pointer;
          transition: all var(--transition); display: flex;
          flex-direction: column; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .cat-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: var(--shadow); }
        .cat-emoji { font-size: 28px; }
        .cat-label { font-size: 14px; font-weight: 700; color: var(--white); }
        .cat-count { font-size: 12px; color: var(--gray-1); }
        .cat-arrow { color: var(--gray-3); transition: color 0.2s; }
        .cat-card:hover .cat-arrow { color: var(--primary); }

        /* Why section */
        .why-section { background: var(--dark-2); }
        .why-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .why-left h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; }
        .why-left p { color: var(--gray-1); margin-bottom: 24px; font-size: 16px; }
        .why-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .why-list li { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
        .why-right { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .feature-card {
          background: var(--dark-3); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 20px;
          display: flex; flex-direction: column; gap: 12px;
          transition: all var(--transition);
        }
        .feature-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
        .feature-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(230,57,70,0.1); color: var(--primary);
          display: flex; align-items: center; justify-content: center;
        }
        .feature-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .feature-card p { font-size: 13px; color: var(--gray-1); line-height: 1.5; }

        /* Promo */
        .promo-section { padding: 80px 0; }
        .promo-card {
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, #ff8a65 100%);
          border-radius: 24px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 280px;
        }
        .promo-content { padding: 48px; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
        .promo-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; }
        .promo-content h2 { font-size: 32px; font-weight: 900; line-height: 1.2; }
        .promo-content p { opacity: 0.9; font-size: 15px; }
        .promo-img { overflow: hidden; }
        .promo-img img { width: 100%; height: 100%; object-fit: cover; }

        /* Testimonials */
        .testimonial-card { padding: 24px; }
        .testi-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .testi-header img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .testi-name { font-weight: 700; font-size: 15px; }
        .testi-role { font-size: 13px; color: var(--gray-1); }
        .testi-text { color: var(--gray-1); font-size: 14px; line-height: 1.7; font-style: italic; }

        /* CTA */
        .cta-section {
          background: linear-gradient(135deg, var(--dark-2), var(--dark));
          border-top: 1px solid var(--border);
          padding: 80px 0; text-align: center;
        }
        .cta-section h2 { font-size: 40px; font-weight: 800; margin-bottom: 12px; }
        .cta-section p { color: var(--gray-1); font-size: 18px; margin-bottom: 36px; }
        .cta-buttons { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

        @media (max-width: 1024px) {
          .hero-content { grid-template-columns: 1fr; padding-top: 120px; }
          .search-form { max-width: 560px; }
          .categories-grid { grid-template-columns: repeat(3, 1fr); }
          .why-inner { grid-template-columns: 1fr; gap: 40px; }
          .promo-card { grid-template-columns: 1fr; }
          .promo-img { height: 200px; }
        }
        @media (max-width: 640px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .why-right { grid-template-columns: 1fr; }
          .stats-inner { flex-wrap: wrap; gap: 16px; }
          .stat-item + .stat-item { border-left: none; }
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
