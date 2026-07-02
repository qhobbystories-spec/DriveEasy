import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ChevronRight, Car, Shield, Plus, Minus } from 'lucide-react';
import { cars } from '../data/cars';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [selectedCar, setSelectedCar] = useState(state?.car || cars[0]);
  const [pickupDate, setPickupDate] = useState(state?.pickupDate || '');
  const [returnDate, setReturnDate] = useState(state?.returnDate || '');
  const [pickupLocation, setPickupLocation] = useState(selectedCar.location);
  const [returnLocation, setReturnLocation] = useState(selectedCar.location);
  const [extras, setExtras] = useState({ gps: false, childSeat: false, extraDriver: false, insurance: false });
  const [step, setStep] = useState(1);
  const [driver, setDriver] = useState({ firstName: '', lastName: '', email: '', phone: '', license: '', dob: '' });

  const today = new Date().toISOString().split('T')[0];
  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000))
    : 1;

  const extrasMap = { gps: { label: 'GPS Navigation', price: 8 }, childSeat: { label: 'Child Seat', price: 10 }, extraDriver: { label: 'Extra Driver', price: 15 }, insurance: { label: 'Full Coverage Insurance', price: 25 } };
  const extrasTotal = Object.entries(extras).filter(([, v]) => v).reduce((sum, [k]) => sum + extrasMap[k].price * days, 0);
  const subtotal = selectedCar.price * days;
  const fees = 30;
  const taxes = Math.round((subtotal + extrasTotal + fees) * 0.08);
  const total = subtotal + extrasTotal + fees + taxes;

  const handleNextStep = () => {
    if (step === 1) {
      if (!pickupDate || !returnDate) { alert('Please select pickup and return dates.'); return; }
    }
    if (step === 2) {
      if (!driver.firstName || !driver.lastName || !driver.email || !driver.license) { alert('Please fill all required driver fields.'); return; }
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { car: selectedCar, pickupDate, returnDate, pickupLocation, returnLocation, days, extras, extrasTotal, subtotal, fees, taxes, total, driver } });
  };

  const locations = ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Las Vegas', 'San Francisco'];

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <span className="active">Book a Car</span>
          </div>
          <h1>Book Your Vehicle</h1>
          <p>Simple, fast booking in just a few steps.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Progress */}
        <div className="booking-steps">
          {['Select Vehicle & Dates', 'Driver Details', 'Review & Extras'].map((label, i) => (
            <div key={i} className={`step-item${step > i + 1 ? ' done' : step === i + 1 ? ' active' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{label}</span>
              {i < 2 && <ChevronRight size={14} className="step-arrow" />}
            </div>
          ))}
        </div>

        <div className="booking-layout">
          <div className="booking-main">
            {/* Step 1: Vehicle & Dates */}
            {step === 1 && (
              <div className="booking-card">
                <h2>Select Vehicle & Dates</h2>

                <div className="form-group" style={{ marginBottom: 28 }}>
                  <label className="form-label">Select Vehicle</label>
                  <div className="car-select-grid">
                    {cars.filter(c => c.available).map(c => (
                      <button key={c.id} className={`car-select-item${selectedCar.id === c.id ? ' active' : ''}`} onClick={() => setSelectedCar(c)}>
                        <img src={c.image} alt={c.name} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                          <div style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 700 }}>GHS {c.price}/day</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label"><MapPin size={13} /> Pickup Location</label>
                    <select className="form-control" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)}>
                      {locations.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><MapPin size={13} /> Return Location</label>
                    <select className="form-control" value={returnLocation} onChange={e => setReturnLocation(e.target.value)}>
                      {locations.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Calendar size={13} /> Pickup Date</label>
                    <input type="date" className="form-control" value={pickupDate} min={today} onChange={e => setPickupDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Calendar size={13} /> Return Date</label>
                    <input type="date" className="form-control" value={returnDate} min={pickupDate || today} onChange={e => setReturnDate(e.target.value)} />
                  </div>
                </div>

                {pickupDate && returnDate && (
                  <div className="date-summary">
                    <Calendar size={16} color="var(--primary)" />
                    <span>{days} day{days > 1 ? 's' : ''} rental · {pickupDate} → {returnDate}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Driver Details */}
            {step === 2 && (
              <div className="booking-card">
                <h2>Driver Details</h2>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input className="form-control" placeholder="John" value={driver.firstName} onChange={e => setDriver(d => ({ ...d, firstName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input className="form-control" placeholder="Doe" value={driver.lastName} onChange={e => setDriver(d => ({ ...d, lastName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-control" placeholder="john@example.com" value={driver.email} onChange={e => setDriver(d => ({ ...d, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" placeholder="+1 (555) 000-0000" value={driver.phone} onChange={e => setDriver(d => ({ ...d, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Driver's License # *</label>
                    <input className="form-control" placeholder="DL-XXXXXXXX" value={driver.license} onChange={e => setDriver(d => ({ ...d, license: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" value={driver.dob} onChange={e => setDriver(d => ({ ...d, dob: e.target.value }))} />
                  </div>
                </div>
                <div className="info-note">
                  <Shield size={15} color="var(--success)" />
                  <span>Your personal information is encrypted and secured. We'll never share it with third parties.</span>
                </div>
              </div>
            )}

            {/* Step 3: Extras & Review */}
            {step === 3 && (
              <div className="booking-card">
                <h2>Add Extras</h2>
                <div className="extras-list">
                  {Object.entries(extrasMap).map(([key, { label, price }]) => (
                    <div key={key} className={`extra-item${extras[key] ? ' active' : ''}`}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
                        <div style={{ color: 'var(--gray-1)', fontSize: 13 }}>GHS {price}/day · GHS {price * days} total</div>
                      </div>
                      <button className={`extra-toggle${extras[key] ? ' on' : ''}`} onClick={() => setExtras(e => ({ ...e, [key]: !e[key] }))}>
                        {extras[key] ? <Minus size={16} /> : <Plus size={16} />}
                        {extras[key] ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>

                <h3 style={{ marginTop: 32, marginBottom: 16, fontWeight: 700 }}>Booking Summary</h3>
                <div className="summary-box">
                  <div className="summary-car">
                    <img src={selectedCar.image} alt={selectedCar.name} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{selectedCar.name}</div>
                      <div style={{ color: 'var(--gray-1)', fontSize: 13 }}>{pickupLocation} · {days} day{days > 1 ? 's' : ''}</div>
                      <div style={{ color: 'var(--gray-1)', fontSize: 13 }}>{pickupDate} → {returnDate}</div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="summary-row"><span>Car rental ({days} days)</span><span>GHS {subtotal}</span></div>
                  {Object.entries(extras).filter(([, v]) => v).map(([k]) => (
                    <div key={k} className="summary-row"><span>{extrasMap[k].label}</span><span>GHS {extrasMap[k].price * days}</span></div>
                  ))}
                  <div className="summary-row"><span>Service fee</span><span>GHS {fees}</span></div>
                  <div className="summary-row"><span>Taxes (8%)</span><span>GHS {taxes}</span></div>
                  <div className="divider" />
                  <div className="summary-row total"><span>Total</span><span>GHS {total}</span></div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="step-nav">
              {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
              {step < 3 ? (
                <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={handleNextStep}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ marginLeft: 'auto' }} onClick={handleCheckout}>
                  Proceed to Checkout <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="booking-sidebar">
            <div className="sidebar-card">
              <h4>Selected Vehicle</h4>
              <img src={selectedCar.image} alt={selectedCar.name} className="sidebar-car-img" />
              <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedCar.name}</div>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 20, margin: '4px 0' }}>GHS {selectedCar.price}<span style={{ fontSize: 13, color: 'var(--gray-1)', fontWeight: 400 }}>/day</span></div>
              <div className="divider" />
              <div className="sidebar-row"><Car size={14} /><span>{selectedCar.category}</span></div>
              <div className="sidebar-row"><User size={14} /><span>{selectedCar.seats} seats</span></div>
              {pickupDate && <div className="sidebar-row"><Calendar size={14} /><span>{days} day{days > 1 ? 's' : ''}</span></div>}
              {pickupDate && <div className="divider" />}
              {pickupDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                  <span>Estimate</span><span style={{ color: 'var(--primary)' }}>GHS {total}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .booking-steps {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 36px; flex-wrap: wrap;
        }
        .step-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--gray-2); }
        .step-item.active { color: var(--white); font-weight: 600; }
        .step-item.done { color: var(--success); }
        .step-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--dark-3); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0;
        }
        .step-item.active .step-num { background: var(--primary); border-color: var(--primary); color: #fff; }
        .step-item.done .step-num { background: rgba(46,160,67,0.2); border-color: var(--success); color: var(--success); }
        .step-arrow { color: var(--gray-3); }
        .booking-layout { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: start; }
        .booking-card { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 20px; }
        .booking-card h2 { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
        .car-select-grid { display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto; }
        .car-select-item {
          display: flex; align-items: center; gap: 14px;
          background: var(--dark-3); border: 1.5px solid var(--border);
          border-radius: var(--radius); padding: 12px 16px; cursor: pointer;
          text-align: left; color: #fff; transition: all 0.2s; font-family: inherit;
        }
        .car-select-item.active { border-color: var(--primary); background: rgba(230,57,70,0.06); }
        .car-select-item:hover { border-color: rgba(255,255,255,0.2); }
        .car-select-item img { width: 60px; height: 40px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
        .date-summary {
          display: flex; align-items: center; gap: 10px;
          background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.2);
          border-radius: var(--radius); padding: 12px 16px; font-size: 14px; font-weight: 500;
          color: var(--primary); margin-top: 8px;
        }
        .info-note {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(46,160,67,0.06); border: 1px solid rgba(46,160,67,0.15);
          border-radius: var(--radius); padding: 12px 16px; font-size: 13px; color: var(--gray-1);
          margin-top: 8px;
        }
        .extras-list { display: flex; flex-direction: column; gap: 12px; }
        .extra-item {
          display: flex; align-items: center; justify-content: space-between;
          background: var(--dark-3); border: 1.5px solid var(--border);
          border-radius: var(--radius); padding: 16px 20px;
          transition: border-color 0.2s;
        }
        .extra-item.active { border-color: var(--primary); background: rgba(230,57,70,0.05); }
        .extra-toggle {
          display: flex; align-items: center; gap: 6px;
          background: var(--dark-2); border: 1px solid var(--border);
          color: var(--gray-1); padding: 7px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .extra-toggle.on { background: rgba(230,57,70,0.15); border-color: var(--primary); color: var(--primary); }
        .extra-toggle:hover { border-color: var(--primary); color: var(--primary); }
        .summary-box { background: var(--dark-3); border-radius: var(--radius-lg); padding: 20px; }
        .summary-car { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .summary-car img { width: 72px; height: 50px; object-fit: cover; border-radius: 8px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--gray-1); margin-bottom: 8px; }
        .summary-row.total { font-weight: 800; font-size: 17px; color: var(--white); margin-bottom: 0; }
        .step-nav { display: flex; align-items: center; gap: 12px; }
        .booking-sidebar { position: sticky; top: 90px; }
        .sidebar-card { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .sidebar-card h4 { font-size: 14px; font-weight: 700; color: var(--gray-1); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
        .sidebar-car-img { width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius); margin-bottom: 12px; }
        .sidebar-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray-1); margin-bottom: 8px; }
        @media (max-width: 900px) {
          .booking-layout { grid-template-columns: 1fr; }
          .booking-sidebar { position: static; }
        }
        @media (max-width: 600px) {
          .booking-card { padding: 20px; }
          .booking-steps { gap: 4px; }
          .step-item span { display: none; }
        }
      `}</style>
    </main>
  );
}
