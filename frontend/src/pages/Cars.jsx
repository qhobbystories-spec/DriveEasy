import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Car } from 'lucide-react';
import CarCard from '../components/CarCard';
import { useApp } from '../context/AppContext';

export default function Cars() {
  const { cars } = useApp();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '999');
  const [transmission, setTransmission] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Luxury', 'Electric', 'Sports', 'SUV', 'Economy'];
  const transmissions = ['All', 'Automatic', 'Manual'];
  const fuels = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];

  const filtered = useMemo(() => {
    let result = [...cars];
    if (query) result = result.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.brand.toLowerCase().includes(query.toLowerCase()));
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (transmission !== 'All') result = result.filter(c => c.transmission === transmission);
    if (fuel !== 'All') result = result.filter(c => c.fuel === fuel);
    result = result.filter(c => c.price <= parseInt(maxPrice));
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'popular') result.sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [cars, query, category, sort, maxPrice, transmission, fuel]);

  const clearFilters = () => {
    setQuery(''); setCategory('All'); setMaxPrice('999');
    setTransmission('All'); setFuel('All'); setSort('popular');
  };

  const activeFilters = [query, category !== 'All', transmission !== 'All', fuel !== 'All', maxPrice !== '999'].filter(Boolean).length;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span>Home</span>
            <span>/</span>
            <span className="active">Our Fleet</span>
          </div>
          <h1>Our Premium Fleet</h1>
          <p>Choose from over 500 hand-picked vehicles across all categories.</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Toolbar */}
        <div className="fleet-toolbar">
          <div className="search-wrap">
            <Search size={16} />
            <input
              placeholder="Search by name or brand..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
          </div>
          <div className="toolbar-right">
            <button className={`filter-toggle${showFilters ? ' active' : ''}`} onClick={() => setShowFilters(f => !f)}>
              <SlidersHorizontal size={16} />
              Filters {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
              <ChevronDown size={14} />
            </button>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category tabs */}
        <div className="cat-tabs">
          {categories.map(cat => (
            <button key={cat} className={`cat-tab${category === cat ? ' active' : ''}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Transmission</label>
              <div className="filter-options">
                {transmissions.map(t => (
                  <button key={t} className={`filter-opt${transmission === t ? ' active' : ''}`} onClick={() => setTransmission(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Fuel Type</label>
              <div className="filter-options">
                {fuels.map(f => (
                  <button key={f} className={`filter-opt${fuel === f ? ' active' : ''}`} onClick={() => setFuel(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Max Price: <strong style={{ color: 'var(--primary)' }}>GHS {maxPrice}/day</strong></label>
              <input
                type="range" min="45" max="999" step="5"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="price-range"
              />
            </div>
            {activeFilters > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="results-header">
          <span>{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-3">{filtered.map(car => <CarCard key={car.id} car={car} />)}</div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon"><Car size={48} /></div>
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters or search term.</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </main>
  );
}
