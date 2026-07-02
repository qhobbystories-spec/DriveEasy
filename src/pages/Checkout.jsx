import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, Shield, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cars } from '../data/cars';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking, addToast } = useApp();

  const state = location.state || {
    car: cars[0], pickupDate: '2026-07-01', returnDate: '2026-07-04',
    pickupLocation: 'New York', days: 3, total: 410, subtotal: 360, fees: 30, taxes: 31,
  };

  const [payment, setPayment] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const discount = promoApplied ? Math.round(state.total * 0.2) : 0;
  const finalTotal = state.total - discount;

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  const handleApplyPromo = () => {
    if (promo.toUpperCase() === 'ELITE20') { setPromoApplied(true); addToast('Promo code applied! 20% off', 'success'); }
    else addToast('Invalid promo code', 'error');
  };

  const handlePay = async () => {
    if (!payment.name || !payment.number || !payment.expiry || !payment.cvv) { addToast('Please fill all payment fields', 'error'); return; }
    if (!agreed) { addToast('Please accept the terms to continue', 'error'); return; }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    const id = addBooking({
      carId: state.car.id, carName: state.car.name, carImage: state.car.image,
      location: state.pickupLocation, pickupDate: state.pickupDate, returnDate: state.returnDate,
      days: state.days, pricePerDay: state.car.price, total: finalTotal,
    });
    setProcessing(false);
    setDone(true);
    setTimeout(() => navigate('/my-bookings'), 3000);
  };

  if (done) return (
    <main>
      <div className="success-screen">
        <div className="success-icon"><CheckCircle size={64} color="var(--success)" /></div>
        <h1>Booking Confirmed!</h1>
        <p>Your vehicle has been successfully booked. A confirmation email has been sent.</p>
        <div className="success-car">
          <img src={state.car.image} alt={state.car.name} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{state.car.name}</div>
            <div style={{ color: 'var(--gray-1)' }}>{state.pickupDate} → {state.returnDate}</div>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 20, marginTop: 4 }}>GHS {finalTotal} total</div>
          </div>
        </div>
        <p style={{ color: 'var(--gray-1)', fontSize: 14 }}>Redirecting to My Bookings...</p>
        <Link to="/my-bookings" className="btn btn-primary btn-lg">View My Bookings</Link>
      </div>
      <style>{`
        .success-screen { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; text-align: center; padding: 40px 24px; }
        .success-icon { animation: pulse 0.6s ease; }
        .success-screen h1 { font-size: 36px; font-weight: 800; }
        .success-car { display: flex; align-items: center; gap: 20px; background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 28px; text-align: left; margin: 8px 0; }
        .success-car img { width: 100px; height: 70px; object-fit: cover; border-radius: var(--radius); }
      `}</style>
    </main>
  );

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/booking">Booking</Link><span>/</span>
            <span className="active">Checkout</span>
          </div>
          <h1>Secure Checkout</h1>
          <p>Complete your booking with our secure payment system.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Payment */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <CreditCard size={20} color="var(--primary)" />
                <h3>Payment Details</h3>
                <div className="secure-badge"><Lock size={12} /> Secure 256-bit SSL</div>
              </div>

              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input className="form-control" placeholder="John Doe" value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-control" placeholder="1234 5678 9012 3456" value={payment.number} onChange={e => setPayment(p => ({ ...p, number: formatCard(e.target.value) }))} maxLength={19} />
                  <div className="card-logos">💳</div>
                </div>
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input className="form-control" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} maxLength={5} />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-control" placeholder="•••" type="password" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.slice(0, 4) }))} />
                </div>
              </div>
            </div>

            {/* Promo code */}
            <div className="checkout-card">
              <h3>Promo Code</h3>
              <div className="promo-row">
                <input className="form-control" placeholder="Enter promo code" value={promo} onChange={e => setPromo(e.target.value)} disabled={promoApplied} />
                <button className="btn btn-outline" onClick={handleApplyPromo} disabled={promoApplied}>
                  {promoApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-1)', marginTop: 8 }}>Try <strong style={{ color: 'var(--primary)' }}>ELITE20</strong> for 20% off your first booking.</div>
            </div>

            {/* Terms */}
            <div className="checkout-card">
              <label className="terms-check">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span>I agree to the <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms & Conditions</Link> and <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>. I confirm all details are correct.</span>
              </label>
            </div>

            <button
              className={`btn btn-primary btn-block btn-lg pay-btn${processing ? ' loading' : ''}`}
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? (
                <><span className="spinner" /> Processing Payment...</>
              ) : (
                <><Lock size={18} /> Pay GHS {finalTotal} Securely</>
              )}
            </button>
          </div>

          {/* Order summary */}
          <div className="checkout-summary">
            <div className="checkout-card">
              <h3>Order Summary</h3>
              <div className="order-car">
                <img src={state.car.image} alt={state.car.name} />
                <div>
                  <div style={{ fontWeight: 700 }}>{state.car.name}</div>
                  <div style={{ color: 'var(--gray-1)', fontSize: 13 }}>{state.car.category}</div>
                </div>
              </div>
              <div className="divider" />
              <div className="order-row"><span>Pickup</span><span style={{ fontWeight: 600 }}>{state.pickupLocation}</span></div>
              <div className="order-row"><span>Return</span><span style={{ fontWeight: 600 }}>{state.returnLocation || state.pickupLocation}</span></div>
              <div className="order-row"><span>Dates</span><span style={{ fontWeight: 600, fontSize: 12 }}>{state.pickupDate} → {state.returnDate}</span></div>
              <div className="order-row"><span>Duration</span><span style={{ fontWeight: 600 }}>{state.days} day{state.days > 1 ? 's' : ''}</span></div>
              <div className="divider" />
              <div className="order-row"><span>Subtotal</span><span>GHS {state.subtotal}</span></div>
              {state.extrasTotal > 0 && <div className="order-row"><span>Extras</span><span>GHS {state.extrasTotal}</span></div>}
              <div className="order-row"><span>Service fee</span><span>GHS {state.fees}</span></div>
              <div className="order-row"><span>Taxes</span><span>GHS {state.taxes}</span></div>
              {promoApplied && <div className="order-row" style={{ color: 'var(--success)' }}><span>Promo (ELITE20)</span><span>-GHS {discount}</span></div>}
              <div className="divider" />
              <div className="order-row order-total"><span>Total</span><span>GHS {finalTotal}</span></div>
            </div>

            <div className="checkout-card assurances">
              <div className="assurance"><Shield size={16} color="var(--success)" /><span>Free cancellation within 24h</span></div>
              <div className="assurance"><Lock size={16} color="var(--secondary-light)" /><span>Encrypted & secure payment</span></div>
              <div className="assurance"><CheckCircle size={16} color="var(--primary)" /><span>Instant email confirmation</span></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }
        .checkout-card { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px; }
        .checkout-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .checkout-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .checkout-card-header h3 { margin-bottom: 0; }
        .secure-badge {
          display: flex; align-items: center; gap: 5px;
          margin-left: auto; background: rgba(46,160,67,0.1); border: 1px solid rgba(46,160,67,0.2);
          color: var(--success); font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 100px;
        }
        .card-logos { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; }
        .promo-row { display: flex; gap: 10px; }
        .terms-check { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 14px; color: var(--gray-1); }
        .terms-check input { margin-top: 2px; accent-color: var(--primary); flex-shrink: 0; }
        .pay-btn { margin-top: 4px; }
        .pay-btn.loading { opacity: 0.8; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        .order-car { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .order-car img { width: 64px; height: 44px; object-fit: cover; border-radius: 8px; }
        .order-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--gray-1); margin-bottom: 8px; }
        .order-total { font-weight: 800; font-size: 18px; color: var(--white); margin-bottom: 0; }
        .assurances { display: flex; flex-direction: column; gap: 12px; }
        .assurance { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--gray-1); }
        @media (max-width: 900px) {
          .checkout-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
