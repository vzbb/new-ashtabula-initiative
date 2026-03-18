import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged, getIdToken } from './lib/firebase.js';
import { useAuthStore } from './store/index.js';
import { authApi } from './lib/api.js';

// Pages
import HomePage from './pages/HomePage.jsx';
import PropertyPage from './pages/PropertyPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import BookingConfirmationPage from './pages/BookingConfirmationPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OwnerDashboard from './pages/owner/Dashboard.jsx';
import OwnerProperties from './pages/owner/Properties.jsx';
import OwnerBookings from './pages/owner/Bookings.jsx';
import OwnerCalendar from './pages/owner/Calendar.jsx';
import OwnerEarnings from './pages/owner/Earnings.jsx';
import OwnerSettings from './pages/owner/Settings.jsx';
import StripeOnboarding from './pages/owner/StripeOnboarding.jsx';

function App() {
  const { setUser, setToken, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await getIdToken();
          setToken(token);
          
          // Fetch user profile from our API
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Auth sync error:', error);
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, [setUser, setToken, logout, setLoading]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:slug" element={<PropertyPage />} />
        <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Owner Routes */}
        <Route path="/owner" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
        <Route path="/owner/properties" element={<OwnerRoute><OwnerProperties /></OwnerRoute>} />
        <Route path="/owner/bookings" element={<OwnerRoute><OwnerBookings /></OwnerRoute>} />
        <Route path="/owner/calendar" element={<OwnerRoute><OwnerCalendar /></OwnerRoute>} />
        <Route path="/owner/earnings" element={<OwnerRoute><OwnerEarnings /></OwnerRoute>} />
        <Route path="/owner/settings" element={<OwnerRoute><OwnerSettings /></OwnerRoute>} />
        <Route path="/owner/stripe/onboarding" element={<OwnerRoute><StripeOnboarding /></OwnerRoute>} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Protected route component
function OwnerRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow both owner and admin roles
  if (user?.role !== 'owner' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default App;