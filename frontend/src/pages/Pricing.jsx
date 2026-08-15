import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, ChevronDown, ChevronUp, PartyPopper } from 'lucide-react';
import { pricingPlans, faqs } from '../data/cars';

export default function Pricing() {
  const [billing, setBilling] = useState('day');
  const [openFaq, setOpenFaq] = useState(null);

  const priceKey = { day: 'priceDay', week: 'priceWeek', month: 'priceMonth' };
  const billingLabel = { day: '/day', week: '/week', month: '/month' };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">Pricing</span></div>
          <h1>Simple, Transparent Pricing</h1>
          <p>No hidden fees. No surprises. Just premium vehicles at fair prices.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Billing toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div className="billing-toggle">
              {['day', 'week', 'month'].map(b => (
                <button key={b} className={`billing-btn${billing === b ? ' active' : ''}`} onClick={() => setBilling(b)}>
                  Per {b.charAt(0).toUpperCase() + b.slice(1)}
                  {b === 'week' && <span className="save-tag">Save 17%</span>}
                  {b === 'month' && <span className="save-tag">Save 30%</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div className="pricing-grid">
            {pricingPlans.map(plan => (
              <div key={plan.id} className={`pricing-card${plan.popular ? ' popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-header" style={{ borderBottom: `2px solid ${plan.color}` }}>
                  <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>
                  <p className="plan-desc">{plan.description}</p>
                  <div className="plan-price">
                    <span className="price-amount">GHS {plan[priceKey[billing]]}</span>
                    <span className="price-period">{billingLabel[billing]}</span>
                  </div>
                </div>

                <ul className="plan-features">
                  {plan.features.map(f => (
                    <li key={f} className="feature-yes">
                      <Check size={16} color="var(--success)" /> {f}
                    </li>
                  ))}
                  {plan.notIncluded.map(f => (
                    <li key={f} className="feature-no">
                      <X size={16} color="var(--gray-3)" /> {f}
                    </li>
                  ))}
                </ul>

                <Link to="/booking" className={`btn btn-block${plan.popular ? ' btn-primary' : ' btn-outline'}`} style={{ marginTop: 24 }}>
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison note */}
          <div className="pricing-note">
            <span><PartyPopper size={18} /></span>
            <p>All plans include <strong>free roadside assistance</strong>, <strong>sanitized vehicles</strong>, and access to our mobile app. Prices may vary by vehicle model and location.</p>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section" style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', paddingTop: 0 }}>
        <div className="container">
          <div className="section-header" style={{ paddingTop: 80 }}>
            <div className="label">Optional Add-ons</div>
            <h2>Customize Your Experience</h2>
          </div>
          <div className="grid grid-4">
            {[
              { name: 'GPS Navigation', price: 'GHS 8/day', desc: 'Never get lost with our premium in-car navigation.' },
              { name: 'Child Seat', price: 'GHS 10/day', desc: 'Safety-certified child seat for your little ones.' },
              { name: 'Extra Driver', price: 'GHS 15/day', desc: 'Add an additional authorized driver to your rental.' },
              { name: 'Full Coverage', price: 'GHS 25/day', desc: 'Zero-deductible insurance for total peace of mind.' },
              { name: 'Airport Delivery', price: 'GHS 45/trip', desc: 'Have your car waiting when you land.' },
              { name: 'Fuel Package', price: 'GHS 55/rental', desc: 'Return the car empty — we handle refueling.' },
              { name: 'Premium Sound', price: 'GHS 5/day', desc: 'Upgrade to a Bose or Harman Kardon system.' },
              { name: 'WiFi Hotspot', price: 'GHS 8/day', desc: 'Stay connected with portable 4G WiFi.' },
            ].map((addon, i) => (
              <div key={i} className="addon-card">
                <div className="addon-name">{addon.name}</div>
                <div className="addon-price">{addon.price}</div>
                <p className="addon-desc">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="section-header">
            <div className="label">FAQ</div>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && <div className="faq-answer">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .billing-toggle {
          display: flex; gap: 4px;
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 4px;
        }
        .billing-btn {
          position: relative; display: flex; align-items: center; gap: 8px;
          padding: 10px 24px; border-radius: var(--radius); border: none;
          background: none; color: var(--gray-1); font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .billing-btn.active { background: var(--primary); color: #fff; }
        .save-tag { font-size: 11px; background: rgba(46,160,67,0.2); color: var(--success); padding: 2px 7px; border-radius: 100px; font-weight: 700; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .pricing-card {
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 32px;
          display: flex; flex-direction: column; position: relative;
          transition: all var(--transition);
        }
        .pricing-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .pricing-card.popular { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
        .popular-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          background: var(--primary); color: #fff;
          padding: 4px 20px; border-radius: 100px; font-size: 12px; font-weight: 700;
          white-space: nowrap;
        }
        .plan-header { margin-bottom: 24px; padding-bottom: 20px; }
        .plan-name { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
        .plan-desc { font-size: 14px; color: var(--gray-1); margin-bottom: 16px; }
        .plan-price { display: flex; align-items: baseline; gap: 4px; }
        .price-amount { font-size: 40px; font-weight: 900; }
        .price-period { font-size: 15px; color: var(--gray-1); }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .plan-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; }
        .feature-yes { color: var(--white); }
        .feature-no { color: var(--gray-3); }
        .pricing-note {
          display: flex; align-items: center; gap: 16px;
          background: rgba(230,57,70,0.06); border: 1px solid rgba(230,57,70,0.15);
          border-radius: var(--radius-lg); padding: 16px 24px; margin-top: 40px;
          font-size: 14px; color: var(--gray-1);
        }
        .pricing-note span { font-size: 24px; }
        .addon-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: all var(--transition); }
        .addon-card:hover { border-color: rgba(255,255,255,0.2); }
        .addon-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .addon-price { font-size: 16px; font-weight: 800; color: var(--primary); margin-bottom: 8px; }
        .addon-desc { font-size: 13px; color: var(--gray-1); line-height: 1.5; }
        .faq-list { display: flex; flex-direction: column; gap: 0; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 0; background: none; border: none; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit; text-align: left; }
        .faq-question svg { flex-shrink: 0; color: var(--primary); }
        .faq-answer { padding-bottom: 20px; font-size: 15px; color: var(--gray-1); line-height: 1.7; }
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } }
      `}</style>
    </main>
  );
}
