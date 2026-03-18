import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon, CalendarIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { bookingsApi } from '../lib/api.js';

function formatPrice(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const data = await bookingsApi.getById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCalendar = (type) => {
    // Generate calendar link
    const { checkIn, checkOut, guest } = booking;
    const title = `Stay at Vacation Rental`;
    const start = checkIn.replace(/-/g, '');
    const end = checkOut.replace(/-/g, '');
    
    let url;
    if (type === 'google') {
      url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}`;
    } else if (type === 'ical') {
      // Would generate .ics file
      alert('iCal download would start here');
      return;
    }
    
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your reservation has been confirmed. A confirmation email has been sent to {booking.guest?.email}.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
            <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmation #</span>
                <span className="font-medium">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium">{booking.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium">{booking.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium">{booking.guest?.adults + booking.guest?.children}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid</span>
                <span className="font-medium">{formatPrice(booking.pricing?.depositAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance Due</span>
                <span className="font-medium">{formatPrice(booking.pricing?.balanceAmount)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Add to Calendar</h3>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => addToCalendar('google')}
                className="btn-secondary"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Google
              </button>
              <button
                onClick={() => addToCalendar('ical')}
                className="btn-secondary"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                iCal
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <Link to="/" className="btn-primary">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}