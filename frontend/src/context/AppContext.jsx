import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cars as initialCars } from '../data/cars';
import { spareParts as initialSpareParts } from '../data/spareParts';
import { towingVehicles as initialTowingVehicles } from '../data/towingVehicles';
import { api, getToken, setToken } from '../api/client';
import { connectSocket, disconnectSocket, joinAdminRoom } from '../api/socket';

const AppContext = createContext();

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';

const DEMO_BOOKINGS = [
  {
    id: 'BK-001',
    carId: 1,
    carName: 'BMW 5 Series',
    carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    location: 'Accra',
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
    location: 'Takoradi',
    pickupDate: '2026-07-04',
    returnDate: '2026-07-07',
    days: 3,
    pricePerDay: 250,
    total: 815,
    status: 'upcoming',
    createdAt: '2026-06-05',
  },
];

const toFrontendUser = (u) => ({
  ...u,
  id: u.id,
  name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
  email: u.email,
  phone: u.phone || '',
  avatar: u.avatar || u.profileImage || DEFAULT_AVATAR,
  joinDate: u.joinDate || '',
  licenseNumber: u.licenseNumber || '',
  totalTrips: u.totalTrips || 0,
  totalSpent: u.totalSpent || 0,
  loyaltyPoints: u.loyaltyPoints || 0,
  tier: u.tier || 'Silver',
});

const CATEGORY_LABELS = {
  SUV: 'SUV', LUXURY: 'Luxury', SEDAN: 'Sedan', CONVERTIBLE: 'Convertible',
  PICKUP: 'Pickup', HATCHBACK: 'Hatchback', VAN: 'Van', ELECTRIC: 'Electric', HYBRID: 'Hybrid',
};

const titleCase = (s) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '');

const toFrontendCar = (c) => {
  const features = [];
  if (c.airConditioning) features.push('Air Conditioning');
  if (c.gps) features.push('GPS Navigation');
  if (c.bluetooth) features.push('Bluetooth');
  return {
    ...c,
    id: c.id,
    name: `${c.brand} ${c.model}`.trim(),
    brand: c.brand,
    category: CATEGORY_LABELS[c.category] || titleCase(c.category) || 'SUV',
    image: c.mainImage,
    images: c.mainImage ? [c.mainImage] : [],
    price: c.dailyPrice,
    priceWeek: c.weeklyPrice || (c.dailyPrice ? Math.round(c.dailyPrice * 7) : 0),
    rating: c.rating ?? 4.5,
    reviews: c.totalReviews ?? 0,
    seats: c.seats,
    doors: c.doors,
    transmission: titleCase(c.transmission),
    fuel: titleCase(c.fuelType),
    mileage: c.mileage,
    year: c.year,
    engine: c.engine || '',
    power: c.power || '',
    topSpeed: c.topSpeed || '',
    acceleration: c.acceleration || '',
    features,
    description: c.description || '',
    available: c.status === 'AVAILABLE',
    location: c.location,
    tag: '',
    isApi: true,
  };
};

const BOOKING_STATUS_MAP = {
  PENDING: 'upcoming',
  CONFIRMED: 'confirmed',
  ACTIVE: 'confirmed',
  COMPLETED: 'completed',
  RETURNED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'cancelled',
};

const toFrontendBooking = (b) => {
  const dateOnly = (d) => (d ? String(d).slice(0, 10) : '');
  const start = dateOnly(b.pickupDate);
  const end = dateOnly(b.returnDate);
  const days = start && end
    ? Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000))
    : 1;
  return {
    id: b.id,
    bookingNumber: b.bookingNumber,
    carId: b.car?.id,
    carName: b.car ? `${b.car.brand} ${b.car.model}`.trim() : 'Vehicle',
    carImage: b.car?.mainImage || '',
    location: b.pickupLocation,
    pickupDate: start,
    returnDate: end,
    days,
    pricePerDay: b.car?.dailyPrice || b.totalPrice,
    total: b.totalPrice,
    status: BOOKING_STATUS_MAP[b.bookingStatus] || 'upcoming',
    createdAt: dateOnly(b.createdAt),
    backend: true,
  };
};

const CATEGORY_TO_ENUM = {
  Luxury: 'LUXURY', Electric: 'ELECTRIC', Sports: 'SEDAN', SUV: 'SUV',
  Economy: 'HATCHBACK', Van: 'VAN', Sedan: 'SEDAN', Convertible: 'CONVERTIBLE',
  Pickup: 'PICKUP', Hybrid: 'HYBRID', Hatchback: 'HATCHBACK',
};

const buildCarPayload = (car) => {
  const name = car.name || '';
  const model = car.model || name.replace(new RegExp(`^${car.brand || ''}\\s*`, 'i'), '').trim() || name;
  const price = Number(car.price) || 0;
  return {
    brand: car.brand || name.split(' ')[0] || 'Unknown',
    model: model || 'Model',
    year: Number(car.year) || new Date().getFullYear(),
    fuelType: String(car.fuel || 'Petrol').toUpperCase(),
    transmission: String(car.transmission || 'Automatic').toUpperCase(),
    color: car.color || 'Black',
    plateNumber: car.plateNumber || `AMK-${String(Date.now()).slice(-6)}`,
    vin: car.vin || `VIN${String(Date.now()).slice(-8)}${Math.floor(Math.random() * 90 + 10)}`,
    seats: Number(car.seats) || 5,
    doors: Number(car.doors) || 4,
    airConditioning: true,
    gps: true,
    bluetooth: true,
    dailyPrice: price,
    weeklyPrice: Number(car.priceWeek) || price * 7,
    monthlyPrice: price * 30,
    deposit: Number(car.deposit) || Math.max(1, Math.round(price)),
    mileage: car.mileage || 'Unlimited',
    description: car.description || '',
    location: car.location || 'Accra',
    status: 'AVAILABLE',
    category: CATEGORY_TO_ENUM[car.category] || 'SEDAN',
    mainImage: car.image || car.mainImage || '',
    rating: Number(car.rating) || 4.5,
  };
};

const toFrontendPart = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  brand: p.brand || '',
  image: p.image,
  priceGHS: Number(p.price) || 0,
  price: Math.round((Number(p.price) || 0) / 10),
  description: p.description || '',
  quantity: Number(p.quantity) || 0,
  inStock: Boolean(p.inStock),
  rating: Number(p.rating) || 0,
  reviews: Number(p.totalReviews) || 0,
});

const buildPartPayload = (part) => ({
  name: part.name,
  category: part.category || 'Engine',
  brand: part.brand || '',
  price: Number(part.priceGHS || part.price) || 0,
  image: part.image || '',
  description: part.description || '',
  quantity: Number(part.quantity) || 0,
  inStock: part.inStock !== undefined ? Boolean(part.inStock) : (Number(part.quantity) || 0) > 0,
  rating: Number(part.rating) || 4.5,
  totalReviews: Number(part.reviews) || 0,
});

const toFrontendTowing = (v) => ({
  id: v.id,
  name: v.name,
  brand: v.brand,
  category: 'Towing',
  image: v.image,
  images: v.image ? [v.image] : [],
  towCapacity: v.towCapacity || '5 Tons',
  priceGHS: Number(v.price) || 0,
  price: Math.round((Number(v.price) || 0) / 10),
  description: v.description || '',
  operator: v.operator || '',
  phone: v.phone || '',
  experience: v.experience || '',
  tag: v.tag || 'Economy',
  rating: Number(v.rating) || 0,
  reviews: Number(v.totalReviews) || 0,
  available: v.available !== undefined ? Boolean(v.available) : true,
  location: v.location || 'Accra',
});

const buildTowingPayload = (vehicle) => ({
  name: vehicle.name,
  brand: vehicle.brand,
  tag: vehicle.tag || 'Economy',
  towCapacity: vehicle.towCapacity || '5 Tons',
  price: Number(vehicle.priceGHS || vehicle.price) || 0,
  image: vehicle.image || '',
  description: vehicle.description || '',
  operator: vehicle.operator || '',
  phone: vehicle.phone || '',
  experience: vehicle.experience || '',
  rating: Number(vehicle.rating) || 4.7,
  totalReviews: Number(vehicle.reviews) || 0,
  available: vehicle.available !== undefined ? Boolean(vehicle.available) : true,
  location: vehicle.location || 'Accra',
});

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  // Load auth state from localStorage on mount, then validate with the API
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = getToken();
      if (!token) return;

      let storedUser = null;
      try {
        storedUser = JSON.parse(localStorage.getItem('amk_auth') || 'null');
      } catch (e) {
        // ignore
      }

      try {
        const res = await api.me();
        if (cancelled) return;
        const fresh = toFrontendUser(res.data);
        setAuthUser(fresh);
        setUser(fresh);
        setIsAuthenticated(true);
        localStorage.setItem('amk_auth', JSON.stringify(fresh));
      } catch (err) {
        if (err.status === 401) {
          // Session expired/invalid — sign out
          setToken(null);
          localStorage.removeItem('amk_auth');
        } else if (storedUser && !cancelled) {
          // Backend unreachable — keep the cached session so the app stays usable
          const cached = toFrontendUser(storedUser);
          setAuthUser(cached);
          setUser(cached);
          setIsAuthenticated(true);
        }
      }
    };

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  const [bookings, setBookings] = useState(DEMO_BOOKINGS);

  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('amk_auth') || 'null');
      if (stored) return toFrontendUser(stored);
    } catch (e) { /* ignore */ }
    return {
      name: 'Guest',
      email: 'guest@amkmotors.com',
      phone: '0547129448',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      joinDate: 'January 2025',
      licenseNumber: 'DL-2847362',
      totalTrips: 12,
      totalSpent: 4250,
      loyaltyPoints: 2800,
      tier: 'Gold',
    };
  });

  const [toasts, setToasts] = useState([]);
  const toastIdRef = React.useRef(0);

  // cars state (persisted to localStorage)
  const [cars, setCars] = useState(() => {
    try {
      const raw = localStorage.getItem('amk_cars');
      return raw ? JSON.parse(raw) : initialCars;
    } catch (e) {
      return initialCars;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('amk_cars', JSON.stringify(cars));
    } catch (e) {
      // ignore
    }
  }, [cars]);

  // Load the live catalog from the backend when available; fall back to local data
  const refreshCars = useCallback(async () => {
    try {
      const res = await api.cars.list();
      const items = Array.isArray(res.data) ? res.data.map(toFrontendCar) : null;
      if (items && items.length) setCars(items);
    } catch (e) {
      // Backend unreachable — keep the current catalog
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCars = async () => {
      try {
        const res = await api.cars.list();
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data.map(toFrontendCar) : null;
        if (items && items.length) setCars(items);
      } catch (e) {
        // Backend unreachable — keep the local catalog
      }
    };

    loadCars();
    return () => { cancelled = true; };
  }, []);

  // Load the signed-in user's bookings from the backend when available
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const loadBookings = async () => {
      try {
        const res = await api.bookings.list();
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data.map(toFrontendBooking) : [];
        setBookings(items);
      } catch (e) {
        // Backend unreachable — keep the local demo bookings
      }
    };

    loadBookings();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Socket.IO — connect when authenticated, listen for real-time events
  useEffect(() => {
    if (!isAuthenticated || !authUser) return;
    let cancelled = false;

    const socket = connectSocket(authUser.id, {
      onNotification: (notification) => {
        if (!cancelled) addToast(notification.title || 'New notification', 'info');
      },
      onBookingUpdate: (data) => {
        // Refresh bookings from backend when a real-time update arrives
        api.bookings.list().then(res => {
          if (cancelled) return;
          const items = Array.isArray(res.data) ? res.data.map(toFrontendBooking) : [];
          if (items.length) setBookings(items);
        }).catch(() => {});
      },
    });

    if (authUser.role === 'ADMIN' || authUser.role === 'EMPLOYEE') {
      joinAdminRoom();
    }

    return () => { cancelled = true; disconnectSocket(); };
  }, [isAuthenticated, authUser?.id, authUser?.role]);

  // spare parts state (persisted to localStorage)
  const [spareParts, setSpareParts] = useState(() => {
    try {
      const raw = localStorage.getItem('amk_spare_parts');
      return raw ? JSON.parse(raw) : initialSpareParts;
    } catch (e) {
      return initialSpareParts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('amk_spare_parts', JSON.stringify(spareParts));
    } catch (e) {
      // ignore
    }
  }, [spareParts]);

  // towing vehicles state (persisted to localStorage)
  const [towingVehicles, setTowingVehicles] = useState(() => {
    try {
      const raw = localStorage.getItem('amk_towing_vehicles');
      return raw ? JSON.parse(raw) : initialTowingVehicles;
    } catch (e) {
      return initialTowingVehicles;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('amk_towing_vehicles', JSON.stringify(towingVehicles));
    } catch (e) {
      // ignore
    }
  }, [towingVehicles]);

  // Load live spare parts from the backend when available; fall back to local data
  const refreshParts = useCallback(async () => {
    try {
      const res = await api.parts.list();
      const items = Array.isArray(res.data) ? res.data.map(toFrontendPart) : null;
      if (items && items.length) setSpareParts(items);
    } catch (e) {
      // Backend unreachable — keep the current catalog
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadParts = async () => {
      try {
        const res = await api.parts.list();
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data.map(toFrontendPart) : null;
        if (items && items.length) setSpareParts(items);
      } catch (e) {
        // Backend unreachable — keep the local catalog
      }
    };

    loadParts();
    return () => { cancelled = true; };
  }, []);

  // Load live towing fleet from the backend when available; fall back to local data
  const refreshTowing = useCallback(async () => {
    try {
      const res = await api.towing.list();
      const items = Array.isArray(res.data) ? res.data.map(toFrontendTowing) : null;
      if (items && items.length) setTowingVehicles(items);
    } catch (e) {
      // Backend unreachable — keep the current fleet
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTowing = async () => {
      try {
        const res = await api.towing.list();
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data.map(toFrontendTowing) : null;
        if (items && items.length) setTowingVehicles(items);
      } catch (e) {
        // Backend unreachable — keep the local fleet
      }
    };

    loadTowing();
    return () => { cancelled = true; };
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const addBooking = useCallback(async ({ booking, payload }) => {
    try {
      const res = await api.bookings.create(payload);
      const mapped = toFrontendBooking(res.data);
      setBookings(prev => [mapped, ...prev]);
      return { id: mapped.id, bookingNumber: mapped.bookingNumber, backend: true };
    } catch (err) {
      if (err.status === 401) {
        addToast('Sign in to save your booking. Your booking was kept on this device.', 'info');
      }
      const id = `BK-${String(Date.now()).slice(-6)}`;
      const newBooking = {
        ...booking,
        id,
        status: 'confirmed',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBookings(prev => [newBooking, ...prev]);
      return { id, bookingNumber: id, backend: false };
    }
  }, [addToast]);

  const addCar = useCallback(async (car) => {
    try {
      await api.cars.create(buildCarPayload(car));
      addToast('Car added to fleet', 'success');
      refreshCars();
      return true;
    } catch (err) {
      setCars(prev => {
        const numeric = prev.map(c => Number(c.id)).filter(n => Number.isFinite(n));
        const id = numeric.length ? Math.max(...numeric) + 1 : Date.now();
        const newCar = { id, ...car };
        return [newCar, ...prev];
      });
      addToast(err.status === 403 ? 'Sign in as admin to add to the live fleet' : 'Car added locally (backend unavailable)', err.status === 403 ? 'error' : 'info');
      return false;
    }
  }, [addToast, refreshCars]);

  const cancelBooking = useCallback(async (bookingId) => {
    setBookings(prev => {
      const target = prev.find(b => b.id === bookingId);
      if (target?.backend) {
        api.bookings.cancel(bookingId).catch(() => {});
      }
      return prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
    });
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const deleteCar = useCallback(async (carId) => {
    try {
      await api.cars.remove(carId);
      addToast('Car removed from fleet', 'success');
      refreshCars();
    } catch (err) {
      setCars(prev => prev.filter(c => c.id !== carId));
      addToast(err.status === 403 ? 'Sign in as admin to modify the live fleet' : 'Car removed locally (backend unavailable)', err.status === 403 ? 'error' : 'info');
    }
  }, [addToast, refreshCars]);

  // Spare Parts Management
  const addSparePart = useCallback(async (part) => {
    try {
      await api.parts.create(buildPartPayload(part));
      addToast('Spare part added to catalog', 'success');
      refreshParts();
      return true;
    } catch (err) {
      setSpareParts(prev => {
        const numeric = prev.map(p => Number(p.id)).filter(n => Number.isFinite(n));
        const id = numeric.length ? Math.max(...numeric) + 1 : Date.now();
        const newPart = { id, ...part };
        return [newPart, ...prev];
      });
      addToast(err.status === 403 ? 'Sign in as admin to add to the live catalog' : 'Spare part added locally (backend unavailable)', err.status === 403 ? 'error' : 'info');
      return false;
    }
  }, [addToast, refreshParts]);

  const deleteSparePart = useCallback(async (partId) => {
    try {
      await api.parts.remove(partId);
      addToast('Spare part removed from catalog', 'success');
      refreshParts();
    } catch (err) {
      setSpareParts(prev => prev.filter(p => p.id !== partId));
      addToast(err.status === 403 ? 'Sign in as admin to modify the live catalog' : 'Spare part removed locally (backend unavailable)', err.status === 403 ? 'error' : 'info');
    }
  }, [addToast, refreshParts]);

  // Towing Vehicles Management
  const addTowingVehicle = useCallback(async (vehicle) => {
    try {
      await api.towing.create(buildTowingPayload(vehicle));
      addToast('Towing vehicle added to fleet', 'success');
      refreshTowing();
      return true;
    } catch (err) {
      setTowingVehicles(prev => {
        const numeric = prev.map(v => Number(v.id)).filter(n => Number.isFinite(n));
        const id = numeric.length ? Math.max(...numeric) + 1 : Date.now();
        const newVehicle = { id, ...vehicle };
        return [newVehicle, ...prev];
      });
      addToast(err.status === 403 ? 'Sign in as admin to add to the live fleet' : 'Towing vehicle added locally (backend unavailable)', err.status === 403 ? 'error' : 'info');
      return false;
    }
  }, [addToast, refreshTowing]);

  const deleteTowingVehicle = useCallback(async (vehicleId) => {
    try {
      await api.towing.remove(vehicleId);
      addToast('Towing vehicle removed from fleet', 'success');
      refreshTowing();
    } catch (err) {
      setTowingVehicles(prev => prev.filter(v => v.id !== vehicleId));
      addToast(err.status === 403 ? 'Sign in as admin to modify the live fleet' : 'Towing vehicle removed locally (backend unavailable)', err.status === 403 ? 'error' : 'info');
    }
  }, [addToast, refreshTowing]);

  // Authentication functions
  const register = useCallback(async (email, password, name, phone) => {
    const parts = name.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');
    try {
      const res = await api.register({ email, password, firstName, lastName, phone });
      const { user: rawUser, accessToken } = res.data;
      const newUser = toFrontendUser(rawUser);

      setToken(accessToken);
      setAuthUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('amk_auth', JSON.stringify(newUser));
      setUser(newUser);

      addToast('Account created successfully! Welcome to AMK Motors & AutoCare!', 'success');
      return true;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      return false;
    }
  }, [addToast]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      const { user: rawUser, accessToken } = res.data;
      const foundUser = toFrontendUser(rawUser);

      setToken(accessToken);
      setAuthUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('amk_auth', JSON.stringify(foundUser));
      setUser(foundUser);

      addToast(`Welcome back, ${foundUser.name || 'there'}!`, 'success');
      return true;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return false;
    }
  }, [addToast]);

  const logout = useCallback(async () => {
    setToken(null);
    setAuthUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('amk_auth');
    setBookings(DEMO_BOOKINGS);
    setUser({
      name: 'Guest',
      email: 'guest@amkmotors.com',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      joinDate: '',
      licenseNumber: '',
      totalTrips: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      tier: 'Guest',
    });
    addToast('You have been logged out', 'success');
    try {
      await api.logout();
    } catch (e) {
      // Best-effort server logout; local session is already cleared
    }
  }, [addToast]);

  return (
    <AppContext.Provider value={{ 
      bookings, user, toasts, cars, addCar, addToast, addBooking, cancelBooking, 
      updateUser, deleteCar, isAuthenticated, authUser, register, login, logout,
      spareParts, addSparePart, deleteSparePart,
      towingVehicles, addTowingVehicle, deleteTowingVehicle
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
