import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, HomeIcon, CalendarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { propertiesApi } from '../lib/api.js';
import { usePropertyStore } from '../store/index.js';

export default function HomePage() {
  const [searchCity, setSearchCity] = useState('');
  const [guests, setGuests] = useState(2);
  const { properties, setProperties, isLoading, setLoading } = usePropertyStore();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertiesApi.getAll();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await propertiesApi.getAll({ city: searchCity, guests });
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <HomeIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Insta-Book</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">Explore</Link>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium">How it Works</a>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary">List Your Property</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-primary-600">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1920"
            alt="Lake house"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 mix-blend-multiply"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find your perfect
            <br />
            <span className="text-primary-200">lake getaway</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-primary-100">
            Book beautiful vacation rentals in Ashtabula County. 
            Direct from local owners with no hidden fees.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-10 max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center px-4 py-2">
                <label className="text-gray-500 mr-2">Guests:</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="outline-none text-gray-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="btn-primary py-3 px-8"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Properties</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.slug}`}
                className="group card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={property.photos?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
                    alt={property.name}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{property.location?.city}, {property.location?.state}</p>
                    <span className="flex items-center text-sm font-medium text-gray-900">
                      [Star] 4.9
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{property.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.bathrooms} baths
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(property.pricing?.baseRate)}</span>
                    <span className="ml-1 text-gray-500">/night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div id="how-it-works" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Book Direct?</h2>
            <p className="mt-4 text-lg text-gray-500">
              Skip the middleman and support local property owners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Local Properties</h3>
              <p className="mt-2 text-gray-500">
                Curated selection of quality vacation rentals in Ashtabula County
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Instant Booking</h3>
              <p className="mt-2 text-gray-500">
                Secure your dates instantly with our streamlined booking process
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-gray-500">
                Stripe-powered payments with just 0.5% platform fee vs 17% on Airbnb
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Insta-Book</h3>
              <p className="text-gray-400 text-sm">
                The local-first vacation rental platform for Ashtabula County.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Guests</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">Search Properties</Link></li>
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Owners</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/register" className="hover:text-white">List Your Property</Link></li>
                <li><Link to="/owner" className="hover:text-white">Owner Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2026 Insta-Book. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}