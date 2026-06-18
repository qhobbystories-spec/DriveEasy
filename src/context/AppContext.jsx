import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [bookings, setBookings] = useState([
    {
      id: 'BK-001',
      carId: 1,
      carName: 'BMW 5 Series',
      carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      location: 'New York',
      pickupDate: '2026-06-15',
      returnDate: '2026-06-18',
      days: 3,
      pricePerDay: 120,
      total: 410,
      status: 'confirmed',
      createdAt: '2026-06-01',
    },
    {
      id: 'BK-002',
      carId: 3,
      carName: 'Porsche 911',
      carImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      location: 'Miami',
      pickupDate: '2026-07-04',
      returnDate: '2026-07-07',
      days: 3,
      pricePerDay: 250,
      total: 815,
      status: 'upcoming',
      createdAt: '2026-06-05',
    },
  ]);

  const [user, setUser] = useState({
    name: 'Qhobby Stories',
    email: 'qhobbystories@gmail.com',
    phone: '0547129448',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    joinDate: 'January 2025',
    licenseNumber: 'DL-2847362',
    totalTrips: 12,
    totalSpent: 4250,
    loyaltyPoints: 2800,
    tier: 'Gold',
  });

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const addBooking = useCallback((booking) => {
    const id = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const newBooking = { ...booking, id, status: 'confirmed', createdAt: new Date().toISOString().split('T')[0] };
    setBookings(prev => [newBooking, ...prev]);
    return id;
  }, [bookings.length]);

  const cancelBooking = useCallback((bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider value={{ bookings, user, toasts, addToast, addBooking, cancelBooking, updateUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
