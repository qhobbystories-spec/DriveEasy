import React, { useState } from 'react';
import { Phone, MapPin, Clock, AlertCircle, CheckCircle, Truck, Navigation, Shield, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Towing() {
  const { addToast, towingVehicles } = useApp();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    serviceType: 'roadside',
    issue: ''
  });

  const services = [
    {
      icon: Truck,
      title: 'Vehicle Towing',
      desc: 'Safe and professional towing services for all vehicle types',
      price: 'GHS 150-500',
      response: '15-30 mins'
    },
    {
      icon: Navigation,
      title: 'Roadside Assistance',
      desc: 'Jump start, tire change, lockout services and more',
      price: 'GHS 50-150',
      response: '10-20 mins'
    },
    {
      icon: Shield,
      title: 'Accident Recovery',
      desc: 'Professional vehicle recovery after accidents',
      price: 'GHS 300-800',
      response: '20-40 mins'
    }
  ];

  const handleRequestService = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    addToast(`Service request received! We'll contact you shortly at ${formData.phone}`, 'success');
    setShowRequestForm(false);
    setFormData({ name: '', phone: '', location: '', serviceType: 'roadside', issue: '' });
  };

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>🚙 Towing & Roadside Services</h1>
            <p style={{ fontSize: '18px', color: 'var(--gray-1)', marginBottom: '24px' }}>
              24/7 professional towing and roadside assistance available across all regions
            </p>
            <button
              onClick={() => setShowRequestForm(true)}
              style={{
                background: 'var(--primary)',
                border: 'none',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(230, 57, 70, 0.9)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--primary)'}
            >
              <Phone size={18} />
              Request Service Now
            </button>
          </div>

          {/* Emergency Contact */}
          <div style={{
            background: 'rgba(230, 57, 70, 0.1)',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <AlertCircle size={32} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', color: 'var(--gray-1)', marginBottom: '4px' }}>Emergency Hotline</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>0800 123 456</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '60px', textAlign: 'center' }}>Our Services</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '80px' }}>
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} style={{
                  background: 'var(--dark-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(230, 57, 70, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}>
                  <div style={{
                    background: 'rgba(230, 57, 70, 0.1)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: 'var(--primary)'
                  }}>
                    <Icon size={32} />
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{service.title}</h3>
                  <p style={{ color: 'var(--gray-1)', marginBottom: '24px', lineHeight: 1.6 }}>{service.desc}</p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '12px', marginBottom: '4px' }}>Starting From</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>{service.price}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '12px', marginBottom: '4px' }}>Response Time</div>
                      <div style={{ fontSize: '18px', fontWeight: '700' }}>{service.response}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Available Towing Vehicles */}
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '40px', textAlign: 'center' }}>Our Towing Fleet</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '80px' }}>
            {towingVehicles.map(vehicle => (
              <div key={vehicle.id} style={{
                background: 'var(--dark-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(230, 57, 70, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                  <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    {vehicle.tag}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{vehicle.name}</h3>
                      <p style={{ color: 'var(--gray-1)', fontSize: '13px' }}>{vehicle.brand}</p>
                    </div>
                  </div>

                  <p style={{ color: 'var(--gray-1)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>{vehicle.description}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '11px', fontWeight: '600' }}>Tow Capacity</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}>{vehicle.towCapacity}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '11px', fontWeight: '600' }}>Price</div>
                      <div style={{ fontSize: '15px', fontWeight: '700' }}>GHS {vehicle.priceGHS}/hr</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '11px', fontWeight: '600' }}>Experience</div>
                      <div style={{ fontSize: '15px', fontWeight: '700' }}>{vehicle.experience}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '11px', fontWeight: '600' }}>Location</div>
                      <div style={{ fontSize: '15px', fontWeight: '700' }}>{vehicle.location}</div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--dark-3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Operator: {vehicle.operator}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {vehicle.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(vehicle.rating) ? '#f4a261' : 'transparent'} color="#f4a261" />
                      ))}
                    </div>
                    <span style={{ color: 'var(--gray-1)', fontSize: '12px' }}>({vehicle.reviews} services)</span>
                  </div>

                  <button
                    onClick={() => {
                      setFormData(s => ({ ...s, serviceType: 'towing' }));
                      setShowRequestForm(true);
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--primary)',
                      border: 'none',
                      color: '#fff',
                      padding: '11px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(230, 57, 70, 0.9)'}
                    onMouseLeave={(e) => e.target.style.background = 'var(--primary)'}
                  >
                    Request This Vehicle
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, rgba(230, 57, 70, 0) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 32px'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px', textAlign: 'center' }}>How It Works</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {[
                { num: '1', title: 'Call or Request', desc: 'Contact us via phone or online form with your location and issue' },
                { num: '2', title: 'Dispatch', desc: 'We dispatch the nearest available tow truck to your location' },
                { num: '3', title: 'Assistance', desc: 'Our professionals arrive and provide the required service' },
                { num: '4', title: 'Resolution', desc: 'Vehicle safely towed or issue resolved with professional care' }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{step.title}</div>
                    <div style={{ color: 'var(--gray-1)', fontSize: '14px' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setShowRequestForm(false)}>
          <div style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            animation: 'slideUp 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Request Towing Service</h2>

            <form onSubmit={handleRequestService}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(s => ({ ...s, name: e.target.value }))}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(s => ({ ...s, phone: e.target.value }))}
                  placeholder="0547129448"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Your Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(s => ({ ...s, location: e.target.value }))}
                  placeholder="City or street address"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData(s => ({ ...s, serviceType: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="roadside">Roadside Assistance</option>
                  <option value="towing">Vehicle Towing</option>
                  <option value="recovery">Accident Recovery</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Describe the Issue</label>
                <textarea
                  value={formData.issue}
                  onChange={(e) => setFormData(s => ({ ...s, issue: e.target.value }))}
                  placeholder="Brief description of your situation..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--primary)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(230, 57, 70, 0.9)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--primary)'}
                >
                  Request Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    fontFamily: 'inherit'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <style>{`
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
