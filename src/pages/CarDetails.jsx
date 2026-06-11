import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Users, Fuel, Settings2, Calendar, MapPin, Check, ChevronLeft, ChevronRight, Zap, Shield, Clock, ArrowRight } from 'lucide-react';
import { cars } from '../data/cars';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === parseInt(id));
  const [activeImg, setActiveImg] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  if (!car) return (
    <main style={{ padding: '160px 0', textAlign: 'center' }}>
      <h2>Vehicle not found</h2>
      <Link to="/cars" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Fleet</Link>
    </main>
  );

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000))
    : 1;

  const total = days * car.price;

  const handleBook = () => {
    if (!pickupDate || !returnDate) { alert('Please select pickup and return dates'); return; }
    navigate('/booking', { state: { car, pickupDate, returnDate, days, total } });
  };

  const related = cars.filter(c => c.id !== car.id && (c.category === car.category)).slice(0, 3);

  const specs = [
    { label: 'Engine', value: car.engine },
    { label: 'Power', value: car.power },
    { label: 'Top Speed', value: car.topSpeed },
    { label: '0–100 km/h', value: car.acceleration },
    { label: 'Year', value: car.year },
    { label: 'Transmission', value: car.transmission },
    { label: 'Fuel Type', value: car.fuel },
    { label: 'Mileage', value: car.mileage },
  ];

  // Simple availability calendar hint
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
    <main>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border)', padding: '16px 0', marginTop: 72 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-1)' }}>
          <Link to="/" style={{ color: 'var(--gray-1)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/cars" style={{ color: 'var(--gray-1)' }}>Fleet</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--white)' }}>{car.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="detail-layout">
          {/* Left: Images + Info */}
          <div className="detail-left">
            {/* Image Gallery */}
            <div className="gallery">
              <div className="gallery-main">
                <img src={car.images[activeImg]} alt={car.name} />
                {car.images.length > 1 && (
                  <>
                    <button className="gallery-arrow left" onClick={() => setActiveImg(i => (i - 1 + car.images.length) % car.images.length)}>
                      <ChevronLeft size={20} />
                    </button>
                    <button className="gallery-arrow right" onClick={() => setActiveImg(i => (i + 1) % car.images.length)}>
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                {!car.available && <div className="unavail-badge">Currently Unavailable</div>}
              </div>
              <div className="gallery-thumbs">
                {car.images.map((img, i) => (
                  <button key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car header */}
            <div className="car-header">
              <div>
                <div className="detail-brand">{car.brand} · {car.category}</div>
                <h1 className="detail-name">{car.name}</h1>
                <div className="detail-meta">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(car.rating) ? "#fbbf24" : "none"} color="#fbbf24" />
                    ))}
                  </div>
                  <span style={{ fontWeight: 600 }}>{car.rating}</span>
                  <span style={{ color: 'var(--gray-1)' }}>({car.reviews} reviews)</span>
                  <span className="dot" />
                  <MapPin size={14} color="var(--gray-1)" />
                  <span style={{ color: 'var(--gray-1)' }}>{car.location}</span>
                </div>
              </div>
              <div className="detail-price">
                <span className="amount">${car.price}</span>
                <span>/day</span>
              </div>
            </div>

            <p className="detail-desc">{car.description}</p>

            {/* Quick specs */}
            <div className="quick-specs">
              <div className="qs-item"><Users size={18} /><span>{car.seats} Seats</span></div>
              <div className="qs-item"><Settings2 size={18} /><span>{car.transmission}</span></div>
              <div className="qs-item"><Fuel size={18} /><span>{car.fuel}</span></div>
              <div className="qs-item"><Zap size={18} /><span>{car.power}</span></div>
            </div>

            {/* Specs Table */}
            <div className="detail-section">
              <h3>Technical Specifications</h3>
              <div className="specs-grid">
                {specs.map(s => (
                  <div key={s.label} className="spec-row">
                    <span className="spec-label">{s.label}</span>
                    <span className="spec-value">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="detail-section">
              <h3>Features & Amenities</h3>
              <div className="features-grid">
                {car.features.map(f => (
                  <div key={f} className="feature-item">
                    <Check size={16} color="var(--success)" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability calendar note */}
            <div className="detail-section">
              <h3>Availability</h3>
              <div className="avail-note">
                <div className={`avail-status ${car.available ? 'ok' : 'no'}`}>
                  {car.available ? '✅ Available for booking' : '❌ Currently unavailable'}
                </div>
                <p>Select your dates in the booking panel to confirm availability for your desired period.</p>
              </div>
            </div>
          </div>

          {/* Right: Booking panel */}
          <div className="detail-right">
            <div className="booking-panel">
              <div className="bp-header">
                <div>
                  <div className="bp-price">${car.price}<span>/day</span></div>
                  <div className="bp-week">${car.priceWeek}/week</div>
                </div>
                <div className={`avail-pill ${car.available ? 'green' : 'red'}`}>
                  {car.available ? '● Available' : '● Unavailable'}
                </div>
              </div>

              <div className="divider" />

              <div className="bp-form">
                <div className="form-group">
                  <label className="form-label"><Calendar size={14} /> Pick-up Date</label>
                  <input type="date" className="form-control" value={pickupDate} min={todayStr} onChange={e => setPickupDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label"><Calendar size={14} /> Return Date</label>
                  <input type="date" className="form-control" value={returnDate} min={pickupDate || todayStr} onChange={e => setReturnDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label"><MapPin size={14} /> Pickup Location</label>
                  <select className="form-control">
                    <option>{car.location}</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>Miami</option>
                  </select>
                </div>
              </div>

              {pickupDate && returnDate && (
                <div className="price-breakdown">
                  <div className="pb-row"><span>${car.price} × {days} day{days > 1 ? 's' : ''}</span><span>${car.price * days}</span></div>
                  <div className="pb-row"><span>Insurance & fees</span><span>$30</span></div>
                  <div className="pb-row"><span>Taxes (8%)</span><span>${Math.round((car.price * days + 30) * 0.08)}</span></div>
                  <div className="divider" />
                  <div className="pb-row total"><span>Total</span><span>${total + 30 + Math.round((total + 30) * 0.08)}</span></div>
                </div>
              )}

              <button className="btn btn-primary btn-block btn-lg" onClick={handleBook} disabled={!car.available} style={{ marginTop: 4 }}>
                {car.available ? 'Book This Car' : 'Not Available'} {car.available && <ArrowRight size={18} />}
              </button>

              <div className="bp-assurances">
                <div className="bpa"><Shield size={14} /><span>Free cancellation</span></div>
                <div className="bpa"><Clock size={14} /><span>Instant confirmation</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ marginBottom: 32 }}>Similar Vehicles</h2>
            <div className="grid grid-3">
              {related.map(c => (
                <div key={c.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/cars/${c.id}`)}>
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>{c.brand}</div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>{c.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 18 }}>${c.price}<span style={{ fontSize: 12, color: 'var(--gray-1)', fontWeight: 400 }}>/day</span></span>
                      <span className="btn btn-outline btn-sm">View</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .detail-layout { display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }
        .gallery { margin-bottom: 32px; }
        .gallery-main { position: relative; border-radius: var(--radius-lg); overflow: hidden; height: 380px; background: var(--dark-2); }
        .gallery-main img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(0,0,0,0.6); border: none; color: #fff;
          width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .gallery-arrow:hover { background: var(--primary); }
        .gallery-arrow.left { left: 14px; }
        .gallery-arrow.right { right: 14px; }
        .unavail-badge {
          position: absolute; top: 16px; left: 16px;
          background: rgba(0,0,0,0.75); color: var(--gray-1);
          padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600;
        }
        .gallery-thumbs { display: flex; gap: 10px; margin-top: 12px; }
        .thumb {
          flex: 1; height: 70px; border-radius: 10px; overflow: hidden;
          border: 2px solid transparent; cursor: pointer; transition: border-color 0.2s; background: none; padding: 0;
        }
        .thumb.active { border-color: var(--primary); }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .car-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 16px; }
        .detail-brand { font-size: 13px; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .detail-name { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
        .detail-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gray-3); }
        .detail-price .amount { font-size: 32px; font-weight: 800; color: var(--primary); }
        .detail-price span:last-child { font-size: 14px; color: var(--gray-1); }
        .detail-desc { color: var(--gray-1); line-height: 1.7; margin-bottom: 24px; }
        .quick-specs { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
        .qs-item {
          display: flex; align-items: center; gap: 8px;
          background: var(--dark-2); border: 1px solid var(--border);
          padding: 10px 16px; border-radius: 10px; font-size: 14px; font-weight: 500;
        }
        .detail-section { margin-bottom: 32px; }
        .detail-section h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .spec-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .spec-label { color: var(--gray-1); font-size: 14px; }
        .spec-value { font-size: 14px; font-weight: 600; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .feature-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .avail-note { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
        .avail-status { font-weight: 600; margin-bottom: 8px; font-size: 15px; }
        .avail-note p { color: var(--gray-1); font-size: 13px; }

        /* Booking panel */
        .booking-panel { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; position: sticky; top: 90px; }
        .bp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .bp-price { font-size: 28px; font-weight: 800; color: var(--primary); }
        .bp-price span { font-size: 14px; color: var(--gray-1); font-weight: 400; }
        .bp-week { font-size: 13px; color: var(--gray-1); margin-top: 2px; }
        .avail-pill { padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; }
        .avail-pill.green { background: rgba(46,160,67,0.15); color: var(--success); }
        .avail-pill.red { background: rgba(230,57,70,0.15); color: var(--primary); }
        .price-breakdown { background: var(--dark-3); border-radius: var(--radius); padding: 14px; margin-bottom: 16px; }
        .pb-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--gray-1); margin-bottom: 8px; }
        .pb-row.total { color: #fff; font-weight: 700; font-size: 16px; margin-bottom: 0; margin-top: 4px; }
        .bp-assurances { display: flex; gap: 16px; margin-top: 14px; justify-content: center; }
        .bpa { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--gray-1); }

        @media (max-width: 1024px) {
          .detail-layout { grid-template-columns: 1fr; }
          .booking-panel { position: static; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .specs-grid { grid-template-columns: 1fr; }
          .gallery-main { height: 240px; }
          .car-header { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
