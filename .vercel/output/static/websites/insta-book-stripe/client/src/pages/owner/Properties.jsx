import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, HomeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { propertiesApi } from '../../lib/api.js';

export default function OwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertiesApi.getMyProperties();
      setProperties(data.properties || []);
    } catch (error) {
      toast.error('Failed to load properties');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <Link to="/owner/properties/new" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="card p-12 text-center">
            <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h2>
            <p className="text-gray-500 mb-6">Get started by adding your first vacation rental</p>
            <Link to="/owner/properties/new" className="btn-primary">
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.slug}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={property.photos?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-500">
                        {property.location?.city}, {property.location?.state}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      property.publicSettings?.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.publicSettings?.isActive ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {property.maxGuests} guests · {property.bedrooms} beds
                    </span>
                    <span className="font-semibold">{formatPrice(property.pricing?.baseRate)}/night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}