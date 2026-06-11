import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Car, ChevronRight, Search } from 'lucide-react';
import { locations } from '../data/cars';

export default function Locations() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = locations.filter(l => l.city.toLowerCase().includes(query.toLowerCase()));

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">Locations</span></div>
          <h1>Our Locations</h1>
          <p>Pick up your dream car at one of our 25+ premium locations across North America.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Search */}
          <div style={{ maxWidth: 400, margin: '0 auto 48px' }}>
            <div className="search-wrap">
              <Search size={16} />
              <input placeholder="Search by city..." value={query} onChange={e => setQuery(e.target.value)} />
            </div>
          </div>

          {/* Locations grid */}
          <div className="grid grid-3">
            {filtered.map(loc => (
              <div
                key={loc.id}
                className={`loc-card card${selected === loc.id ? ' active' : ''}`}
                onClick={() => setSelected(selected === loc.id ? null : loc.id)}
              >
                <div className="loc-img">
                  <img src={loc.image} alt={loc.city} loading="lazy" />
                  <div className="loc-city-badge">{loc.city}</div>
                </div>
                <div className="loc-body">
                  <div className="loc-name">{loc.city}</div>
                  <div className="loc-addr"><MapPin size={13} />{loc.address}</div>
                  <div className="loc-cars"><Car size={13} /><span>{loc.cars} vehicles available</span></div>

                  {selected === loc.id && (
                    <div className="loc-details">
                      <div className="loc-detail-row"><Phone size={14} /><span>{loc.phone}</span></div>
                      <div className="loc-detail-row"><Clock size={14} /><span>{loc.hours}</span></div>
                      <Link to="/booking" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                        Book Here <ChevronRight size={14} />
                      </Link>
                    </div>
                  )}

                  <button className="loc-toggle">
                    {selected === loc.id ? 'Hide Details' : 'View Details'} <ChevronRight size={13} style={{ transform: selected === loc.id ? 'rotate(90deg)' : 'none' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">📍</div>
              <h3>No locations found</h3>
              <p>Try a different city name.</p>
            </div>
          )}

          {/* Coming soon */}
          <div className="coming-soon-section">
            <div className="coming-soon-card">
              <div className="coming-label">Expanding Soon</div>
              <h3>New Cities Coming in 2026</h3>
              <p>We're bringing DriveElite to Seattle, Denver, Austin, Boston, and more. Stay tuned!</p>
              <div className="coming-cities">
                {['Seattle', 'Denver', 'Austin', 'Boston', 'Atlanta', 'Phoenix'].map(c => (
                  <span key={c} className="coming-city">{c}</span>
                ))}
              </div>
              <Link to="/contact" className="btn btn-outline" style={{ marginTop: 24 }}>
                Request a City
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .loc-card { cursor: pointer; transition: all var(--transition); }
        .loc-card.active { border-color: var(--primary); }
        .loc-img { height: 180px; overflow: hidden; position: relative; }
        .loc-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .loc-card:hover .loc-img img { transform: scale(1.05); }
        .loc-city-badge {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(13,17,23,0.8); backdrop-filter: blur(8px);
          padding: 4px 12px; border-radius: 100px; font-size: 13px; font-weight: 700;
        }
        .loc-body { padding: 18px 20px; }
        .loc-name { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .loc-addr { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; color: var(--gray-1); margin-bottom: 6px; }
        .loc-cars { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--success); font-weight: 600; }
        .loc-details { border-top: 1px solid var(--border); margin-top: 12px; padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
        .loc-detail-row { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--gray-1); }
        .loc-toggle { display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--primary); font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 12px; font-family: inherit; padding: 0; }
        .coming-soon-section { margin-top: 64px; }
        .coming-soon-card { background: linear-gradient(135deg, var(--dark-2), var(--dark-3)); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 48px; text-align: center; }
        .coming-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--primary); margin-bottom: 12px; }
        .coming-soon-card h3 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
        .coming-soon-card p { color: var(--gray-1); max-width: 480px; margin: 0 auto 20px; }
        .coming-cities { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .coming-city { background: var(--dark-3); border: 1px solid var(--border); padding: 6px 16px; border-radius: 100px; font-size: 14px; font-weight: 600; }
      `}</style>
    </main>
  );
}
