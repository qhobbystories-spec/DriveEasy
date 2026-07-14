import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import RexAssistant from './components/RexAssistant';

import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Locations from './pages/Locations';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = window.location;
  React.useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTopWrapper />
      </BrowserRouter>
    </AppProvider>
  );
}

function ScrollToTopWrapper() {
  return (
    <>
      <RouteScrollReset />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toast />
      <RexAssistant />
    </>
  );
}

function RouteScrollReset() {
  const [loc, setLoc] = React.useState(window.location.pathname);
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== loc) {
        setLoc(window.location.pathname);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
    observer.observe(document, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, [loc]);
  return null;
}

function NotFound() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: 80 }}>🚗</div>
      <h1 style={{ fontSize: 48, fontWeight: 900 }}>404</h1>
      <p style={{ color: 'var(--gray-1)', fontSize: 18 }}>Looks like you've taken a wrong turn.</p>
      <a href="/" className="btn btn-primary btn-lg">Back to Home</a>
    </main>
  );
}
