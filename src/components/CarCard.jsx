import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings2, MapPin } from 'lucide-react';

export default function CarCard({ car }) {
  return (
    <div className="car-card card">
      {car.tag && <div className="car-tag">{car.tag}</div>}
      {!car.available && <div className="car-unavailable">Unavailable</div>}

      <div className="car-img-wrap">
        <img src={car.image} alt={car.name} loading="lazy" />
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
            <span className="amount">${car.price}</span>
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
