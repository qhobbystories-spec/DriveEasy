import React, { useState } from 'react';
import { Mail, Star, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Parts() {
  const { spareParts } = useApp();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: '', search: '' });

  const partsCategories = [
    'Engine',
    'Brakes',
    'Suspension',
    'Electrical',
    'Cooling'
  ];

  const filtered = spareParts.filter(part => {
    if (filters.category && part.category !== filters.category) return false;
    if (filters.search && !part.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleEnquire = (part) => {
    navigate('/contact', { state: { subject: `Part enquiry: ${part.name}`, message: `Hi, I'm interested in buying the ${part.name} (GHS ${part.priceGHS}). Is it available?` } });
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <span className="active">Auto Parts</span>
          </div>
          <h1>Auto Parts</h1>
          <p>Quality OEM and aftermarket auto parts for all vehicle types.</p>
        </div>
      </div>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Search Parts</label>
              <input
                type="text"
                placeholder="Search by part name..."
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
                {partsCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px' }}>{filtered.length} Parts Available</h2>

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filtered.map(part => (
                <div key={part.id} style={{
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
                  <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
                    <img src={part.image} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                      {part.category}
                    </div>
                    {!part.inStock && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>Out of Stock</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{part.name}</h3>
                        <div style={{ color: 'var(--gray-1)', fontSize: '12px' }}>{part.brand}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < part.rating ? '#f4a261' : 'transparent'} color="#f4a261" />
                        ))}
                      </div>
                      <span style={{ color: 'var(--gray-1)', fontSize: '11px' }}>({part.reviews})</span>
                      <span style={{ color: 'var(--gray-1)', fontSize: '11px' }}>•</span>
                      <span style={{ color: 'var(--gray-1)', fontSize: '11px' }}>Stock: {part.quantity}</span>
                    </div>

                    <p style={{ color: 'var(--gray-1)', fontSize: '12px', marginBottom: '16px', lineHeight: 1.4 }}>{part.description}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ color: 'var(--gray-1)', fontSize: '11px', marginBottom: '2px' }}>Price</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>GHS {part.priceGHS}</div>
                      </div>
                      <button
                        onClick={() => handleEnquire(part)}
                        disabled={!part.inStock}
                        aria-label={part.inStock ? `Enquire about ${part.name}` : `${part.name} out of stock`}
                        style={{
                          background: part.inStock ? 'var(--primary)' : '#666',
                          border: 'none',
                          color: '#fff',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: part.inStock ? 'pointer' : 'not-allowed',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => part.inStock && (e.target.style.background = 'rgba(230, 57, 70, 0.9)')}
                        onMouseLeave={(e) => part.inStock && (e.target.style.background = 'var(--primary)')}
                      >
                        <Mail size={14} />
                        {part.inStock ? 'Enquire' : 'Out'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No Parts Found</h3>
              <p style={{ color: 'var(--gray-1)' }}>Try adjusting your search</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
