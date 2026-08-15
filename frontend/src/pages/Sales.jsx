import React, { useState } from 'react';
import { Mail, Star, MapPin, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sales() {
  const { cars } = useApp();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: '', maxPrice: 500, search: '' });

  const saleItems = cars.map(car => ({
    ...car,
    salePrice: Math.floor(car.price * 1200) // Convert daily rental to sale price (GHS)
  })).filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (item.salePrice > filters.maxPrice * 1000) return false;
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleEnquire = (car) => {
    navigate('/contact', { state: { subject: `Enquiry about ${car.name}`, message: `Hi, I'm interested in purchasing the ${car.name} listed for GHS ${(car.price * 1200).toLocaleString()}. Please share more details.` } });
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <span className="active">Car Sales</span>
          </div>
          <h1>Car Sales</h1>
          <p>Browse our selection of quality vehicles available for purchase.</p>
        </div>
      </div>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          {/* Filters */}
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Search Vehicle</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => setFilters(s => ({ ...s, search: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--dark-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(s => ({ ...s, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--dark-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              >
                <option value="">All Categories</option>
                <option value="Luxury">Luxury</option>
                <option value="Sports">Sports</option>
                <option value="SUV">SUV</option>
                <option value="Economy">Economy</option>
                <option value="Van">Van</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Max Price: GHS {Math.floor(filters.maxPrice * 1000)},000</label>
              <input
                type="range"
                min="50"
                max="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters(s => ({ ...s, maxPrice: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px' }}>{saleItems.length} Vehicles for Sale</h2>

          {saleItems.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {saleItems.map(item => (
                <div key={item.id} style={{
                  background: 'var(--dark-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(230, 57, 70, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                      {item.category}
                    </div>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{item.name}</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.round(item.rating || 0) ? '#f4a261' : 'transparent'} color="#f4a261" />
                        ))}
                      </div>
                      <span style={{ color: 'var(--gray-1)', fontSize: '12px' }}>{item.rating ? `${item.rating.toFixed(1)} (${item.reviews || 0} reviews)` : 'No reviews yet'}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ color: 'var(--gray-1)', fontSize: '12px' }}>Transmission</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.transmission}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--gray-1)', fontSize: '12px' }}>Fuel Type</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.fuel}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--gray-1)', fontSize: '12px' }}>Passengers</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.seats ?? item.passengers ?? '—'}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--gray-1)', fontSize: '12px' }}>Luggage</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.luggage ?? '—'}{item.luggage ? ' bags' : ''}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: 'var(--gray-1)', fontSize: '12px' }}>Price</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                          GHS {item.salePrice.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEnquire(item)}
                        aria-label={`Enquire about ${item.name}`}
                        style={{
                          background: 'var(--primary)',
                          border: 'none',
                          color: '#fff',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(230, 57, 70, 0.9)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                      >
                        <Mail size={16} />
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ marginBottom: '16px', color: 'var(--primary)' }}><Car size={48} /></div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No Vehicles Found</h3>
              <p style={{ color: 'var(--gray-1)' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
