import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  StarIcon, 
  MapPinIcon, 
  UsersIcon, 
  HomeIcon,
  WifiIcon,
  TvIcon,
  FireIcon,
  TruckIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { propertiesApi, bookingsApi } from '../lib/api.js';
import { usePropertyStore, useBookingStore, useAuthStore } from '../store/index.js';

const amenityIcons = {
  wifi: WifiIcon,
  tv: TvIcon,
  ac: FireIcon,
  heating: FireIcon,
  kitchen: HomeIcon,
  parking: TruckIcon,
};

export default function PropertyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { selectedProperty, setSelectedProperty, availability, setAvailability } = usePropertyStore();
  const { setCurrentBooking, setPricing } = useBookingStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [pricing, setLocalPricing] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [slug]);

  useEffect(() => {
    if (checkIn && checkOut && selectedProperty) {
      calculatePricing();
    }
  }, [checkIn, checkOut, guests, selectedProperty]);

  const loadProperty = async () => {
    setIsLoading(true);
    try {
      const property = await propertiesApi.getBySlug(slug);
      setSelectedProperty(property);
      
      // Load availability for current month and next month
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 7);
      
      const [avail1, avail2] = await Promise.all([
        propertiesApi.getAvailability(property.id, currentMonth),
        propertiesApi.getAvailability(property.id, nextMonth),
      ]);
      
      setAvailability(property.id, { [currentMonth]: avail1, [nextMonth]: avail2 });
    } catch (error) {
      toast.error('Failed to load property');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!checkIn || !checkOut) return;
    
    setIsCalculating(true);
    try {
      const result = await bookingsApi.calculate({
        propertyId: selectedProperty.id,
        checkIn,
        checkOut,
        guests: guests.adults + guests.children,
      });
      setLocalPricing(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (!isAuthenticated) {
      // Store booking intent and redirect to login
      toast('Please sign in to continue', { icon: 'Key' });
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      const booking = await bookingsApi.createInquiry({
        propertyId: selectedProperty.id,
        checkIn,
        checkOut,
        guest: {
          firstName: user?.displayName?.split(' ')[0] || '',
          lastName: user?.displayName?.split(' ')[1] || '',
          email: user?.email || '',
          phone: user?.phone || '',
          adults: guests.adults,
          children: guests.children,
        },
      });

      setCurrentBooking(booking);
      setPricing(pricing);
      
      navigate(`/checkout/${booking.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatPrice = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev < (selectedProperty?.photos?.length || 1) - 1 ? prev + 1 : 0
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev > 0 ? prev - 1 : (selectedProperty?.photos?.length || 1) - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  const photos = selectedProperty.photos?.length > 0 
    ? selectedProperty.photos 
    : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200' }];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to properties
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{selectedProperty.name}</h1>
          <div className="mt-2 flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              4.9 · 12 reviews
            </span>
            <span className="flex items-center text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {selectedProperty.location?.city}, {selectedProperty.location?.state}
            </span>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              src={photos[currentPhotoIndex]?.url}
              alt={selectedProperty.name}
              className="w-full h-96 object-cover"
            />
          </div>
          
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedProperty.type?.charAt(0).toUpperCase() + selectedProperty.type?.slice(1)} 
                    hosted by Local Owner
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {selectedProperty.maxGuests} guests · {selectedProperty.bedrooms} bedrooms · {selectedProperty.bathrooms} bathrooms
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">About this place</h3>
              <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
            </div>

            {/* Amenities */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedProperty.amenities?.map((amenity) => {
                  const Icon = amenityIcons[amenity] || CheckCircleIcon;
                  return (
                    <div key={amenity} className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="capitalize">{amenity.replace('_', ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">House Rules</h3>
              <ul className="space-y-2">
                {selectedProperty.houseRules?.map((rule, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
              <p className="text-gray-600 capitalize">
                {selectedProperty.bookingRules?.cancellationPolicy} cancellation policy
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Review the full cancellation policy before booking.
              </p>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 card p-6">
              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-bold">{formatPrice(selectedProperty.pricing?.baseRate)}</span>
                <span className="text-gray-500 ml-1">/night</span>
              </div>

              {/* Date Selection */}
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        value={guests.adults}
                        onChange={(e) => setGuests({ ...guests, adults: Number(e.target.value) })}
                        className="input-field"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={guests.children}
                        onChange={(e) => setGuests({ ...guests, children: Number(e.target.value) })}
                        className="input-field"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n} child{ n !== 1 ? 'ren' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              {pricing && (
                <div className="border-t pt-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{formatPrice(pricing.breakdown.nightlyRate)} x {pricing.breakdown.nights} nights</span>
                    <span>{formatPrice(pricing.breakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>{formatPrice(pricing.breakdown.cleaningFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (8%)</span>
                    <span>{formatPrice(pricing.breakdown.taxes)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(pricing.breakdown.total)}</span>
                  </div>
                  <div className="flex justify-between text-primary-600">
                    <span>Deposit due now ({selectedProperty.bookingRules?.depositPercent || 50}%)</span>
                    <span>{formatPrice(pricing.depositAmount)}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!checkIn || !checkOut || isCalculating}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? 'Calculating...' : 'Reserve'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                You won't be charged yet
              </p>

              {selectedProperty.bookingRules?.instantBook && (
                <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  Instant Book available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}