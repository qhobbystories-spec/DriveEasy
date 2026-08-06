import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import RexAssistant from './components/RexAssistant';

const Home = lazy(() => import('./pages/Home'));
const Cars = lazy(() => import('./pages/Cars'));
const Rentals = lazy(() => import('./pages/Rentals'));
const Sales = lazy(() => import('./pages/Sales'));
const Parts = lazy(() => import('./pages/Parts'));
const Towing = lazy(() => import('./pages/Towing'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const Booking = lazy(() => import('./pages/Booking'));
const Checkout = lazy(() => import('./pages/Checkout'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Locations = lazy(() => import('./pages/Locations'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Admin = lazy(() => import('./pages/Admin'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/towing" element={<Towing />} />
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
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toast />
      <RexAssistant />
    </>
  );
}

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
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
