import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings2, MapPin } from 'lucide-react';

const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect fill="%23161b22" width="400" height="200"/%3E%3Ccircle cx="100" cy="140" r="20" fill="%23457b9d"/%3E%3Ccircle cx="300" cy="140" r="20" fill="%23457b9d"/%3E%3Cpath d="M 60 120 L 80 60 Q 200 40 320 60 L 340 120 Z" fill="%23e63946" stroke="%23c1121f" stroke-width="2"/%3E%3Crect x="100" y="70" width="80" height="30" fill="%2390cdf4" opacity="0.3"/%3E%3Crect x="220" y="70" width="60" height="25" fill="%2390cdf4" opacity="0.3"/%3E%3Ctext x="200" y="180" font-size="12" fill="%238b949e" text-anchor="middle"%3ECar Image%3C/text%3E%3C/svg%3E';

export default function CarCard({ car }) {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className="car-card card">
      {car.tag && <div className="car-tag">{car.tag}</div>}
      {!car.available && <div className="car-unavailable">Unavailable</div>}

      <div className="car-img-wrap">
        <img 
          src={imgError ? PLACEHOLDER_IMG : car.image} 
          alt={car.name} 
          loading="lazy"
          onError={handleImageError}
        />
      </div>

      <div className="car-body">
        <div className="car-meta-top">
          <span className="car-brand">{car.brand}</span>
          <div className="car-rating">
            <Star size={13} fill="#fbbf24" color="#fbbf24" />
            <span>{car.rating}</span>
            <span className="rev">({car.reviews})</span>
          </div>
        </div>

        <h3 className="car-name">{car.name}</h3>

        <div className="car-location">
          <MapPin size={13} />
          <span>{car.location}</span>
        </div>

        <div className="car-specs">
          <div className="spec"><Users size={14} /><span>{car.seats} seats</span></div>
          <div className="spec"><Settings2 size={14} /><span>{car.transmission}</span></div>
          <div className="spec"><Fuel size={14} /><span>{car.fuel}</span></div>
        </div>

        <div className="car-footer">
          <div className="car-price">
            <span className="amount">GHS {car.price}</span>
            <span className="per">/day</span>
          </div>
          <Link to={`/cars/${car.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>

      <style>{`
        .car-card { position: relative; }
        .car-tag {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          background: var(--primary); color: #fff;
          padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .car-unavailable {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          background: rgba(0,0,0,0.6); color: var(--gray-1);
          padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600;
        }
        .car-img-wrap {
          height: 200px; overflow: hidden;
          background: var(--dark-3);
        }
        .car-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
        }
        .car-card:hover .car-img-wrap img { transform: scale(1.05); }
        .car-body { padding: 20px; }
        .car-meta-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 6px;
        }
        .car-brand { font-size: 12px; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .car-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; }
        .car-rating .rev { color: var(--gray-1); font-weight: 400; font-size: 12px; }
        .car-name { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .car-location { display: flex; align-items: center; gap: 5px; color: var(--gray-1); font-size: 13px; margin-bottom: 14px; }
        .car-specs {
          display: flex; gap: 12px; margin-bottom: 18px;
          padding: 12px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .spec { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--gray-1); flex: 1; }
        .car-footer { display: flex; align-items: center; justify-content: space-between; }
        .car-price .amount { font-size: 22px; font-weight: 800; color: var(--primary); }
        .car-price .per { font-size: 13px; color: var(--gray-1); }
      `}</style>
    </div>
  );
}
