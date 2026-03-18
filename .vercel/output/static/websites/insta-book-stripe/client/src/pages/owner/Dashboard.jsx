import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  CogIcon, 
  ChartBarIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/index.js';
import { userApi } from '../../lib/api.js';

const navigation = [
  { name: 'Dashboard', href: '/owner', icon: ChartBarIcon },
  { name: 'Properties', href: '/owner/properties', icon: HomeIcon },
  { name: 'Bookings', href: '/owner/bookings', icon: CalendarIcon },
  { name: 'Calendar', href: '/owner/calendar', icon: CalendarIcon },
  { name: 'Earnings', href: '/owner/earnings', icon: CreditCardIcon },
  { name: 'Settings', href: '/owner/settings', icon: CogIcon },
];

export default function OwnerDashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-primary-600">Insta-Book</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r">
        <div className="flex items-center h-16 px-6 border-b">
          <Link to="/" className="text-xl font-bold text-primary-600">Insta-Book</Link>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 w-full text-left text-sm text-red-600 hover:text-red-800"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-semibold">Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <Link to="/owner/properties/new" className="btn-primary text-sm">
              + Add Property
            </Link>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card p-6">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatPrice(stats?.totalRevenue || 0)}</p>
                </div>
                
                <div className="card p-6">
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold mt-1">{stats?.totalBookings || 0}</p>
                </div>
                
                <div className="card p-6">
                  <p className="text-sm text-gray-500">Occupancy Rate</p>
                  <p className="text-2xl font-bold mt-1">{stats?.occupancyRate || 0}%</p>
                </div>
                
                <div className="card p-6">
                  <p className="text-sm text-gray-500">Upcoming (30 days)</p>
                  <p className="text-2xl font-bold mt-1">{stats?.upcomingBookings || 0}</p>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="card">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Bookings</h2>
                  <Link to="/owner/bookings" className="text-sm text-primary-600 hover:text-primary-700">
                    View all →
                  </Link>
                </div>
                
                <div className="divide-y">
                  {stats?.recentBookings?.length > 0 ? (
                    stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-gray-500">{booking.propertyName}</p>
                          <p className="text-sm text-gray-400">
                            {booking.checkIn} → {booking.checkOut}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(booking.amount)}</p>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No bookings yet. Add a property to get started!
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/owner/properties/new" className="card p-6 hover:shadow-md transition-shadow">
                  <HomeIcon className="h-8 w-8 text-primary-600 mb-4" />
                  <h3 className="font-semibold">Add Property</h3>
                  <p className="text-sm text-gray-500 mt-1">List a new vacation rental</p>
                </Link>
                
                <Link to="/owner/earnings" className="card p-6 hover:shadow-md transition-shadow">
                  <CreditCardIcon className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-semibold">View Earnings</h3>
                  <p className="text-sm text-gray-500 mt-1">Check your revenue and payouts</p>
                </Link>
                
                <Link to="/owner/stripe/onboarding" className="card p-6 hover:shadow-md transition-shadow">
                  <CogIcon className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold">Connect Stripe</h3>
                  <p className="text-sm text-gray-500 mt-1">Set up payments to receive earnings</p>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}