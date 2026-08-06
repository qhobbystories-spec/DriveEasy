import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CarCard from '../components/CarCard';

export default function Rentals() {
  const { cars } = useApp();
  const [filters, setFilters] = useState({ category: '', maxPrice: 300, passengers: 0, search: '' });

  const filtered = cars.filter(car => {
    if (filters.category && car.category !== filters.category) return false;
    if (car.price > filters.maxPrice) return false;
    if (filters.passengers && car.seats < filters.passengers) return false;
    if (filters.search && !car.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>🚗 Car Rentals</h1>
          <p style={{ fontSize: '18px', color: 'var(--gray-1)', marginBottom: '40px' }}>
            Choose from our extensive fleet of premium vehicles for short-term or long-term rentals
          </p>

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
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Max Price: GHS {filters.maxPrice}/day</label>
              <input
                type="range"
                min="30"
                max="300"
                value={filters.maxPrice}
                onChange={(e) => setFilters(s => ({ ...s, maxPrice: parseInt(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Passengers</label>
              <select
                value={filters.passengers}
                onChange={(e) => setFilters(s => ({ ...s, passengers: parseInt(e.target.value) }))}
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
                <option value="0">Any</option>
                <option value="2">2+ Passengers</option>
                <option value="5">5+ Passengers</option>
                <option value="7">7+ Passengers</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700' }}>{filtered.length} Vehicles Available</h2>
            <div style={{ color: 'var(--gray-1)', fontSize: '14px' }}>
              Showing {filtered.length} of {cars.length} vehicles
            </div>
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filtered.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No Vehicles Found</h3>
              <p style={{ color: 'var(--gray-1)' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
