import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';

export default function Home() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      setLoading(true);
      const data = await api.getStores();
      setStores(data.stores);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">Failed to load stores: {error}</p>
          <button onClick={loadStores} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fresh Groceries, Local & Convenient
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Order online from your favorite local stores and pick up when it's ready. 
              No account required—just your phone number.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 bg-primary-700 rounded-lg px-4 py-2">
                <Clock className="h-5 w-5" />
                <span>Order in minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-primary-700 rounded-lg px-4 py-2">
                <Star className="h-5 w-5" />
                <span>Support local businesses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="section-title text-center">Choose Your Store</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map(store => (
            <Link
              key={store.id}
              to={`/shop/${store.id}`}
              className="card hover:shadow-lg transition-shadow group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                      store.type === 'producer-hub' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {store.type === 'producer-hub' ? 'Local Food Hub' : 'Grocery Store'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {store.name}
                    </h3>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>
                
                <div className="flex items-start space-x-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{store.street}, {store.city}, OH {store.zip}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* How It Works */}
        <div className="mt-16">
          <h2 className="section-title text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Browse', desc: 'Shop curated staples from local stores' },
              { step: '2', title: 'Order', desc: 'Add items and choose pickup time' },
              { step: '3', title: 'Pay', desc: 'Secure checkout with card or cash' },
              { step: '4', title: 'Pick Up', desc: 'Grab your order when it\'s ready' }
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
