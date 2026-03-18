import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { bookingsApi, stripeApi } from '../lib/api.js';
import { useBookingStore } from '../store/index.js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ booking, pricing, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    createPaymentIntent();
  }, [booking]);

  const createPaymentIntent = async () => {
    try {
      const result = await stripeApi.createPaymentIntent({
        bookingId: booking.id,
        amount: pricing.depositAmount,
      });
      setClientSecret(result.clientSecret);
    } catch (error) {
      toast.error('Failed to initialize payment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${booking.guest.firstName} ${booking.guest.lastName}`,
            email: booking.guest.email,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full btn-primary py-3 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay Deposit ${formatPrice(pricing.depositAmount)}`}
      </button>
    </form>
  );
}

function formatPrice(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function CheckoutPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { currentBooking, pricing, clearBooking } = useBookingStore();
  const [booking, setBooking] = useState(currentBooking);
  const [isLoading, setIsLoading] = useState(!currentBooking);

  useEffect(() => {
    if (!currentBooking) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const data = await bookingsApi.getById(bookingId);
      setBooking(data);
    } catch (error) {
      toast.error('Failed to load booking');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearBooking();
    navigate(`/booking-confirmation/${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const displayBooking = booking || currentBooking;
  const displayPricing = pricing || displayBooking?.pricing;

  if (!displayBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Guest Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Guest Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-gray-900">{displayBooking.guest?.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-gray-900">{displayBooking.guest?.lastName}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{displayBooking.guest?.email}</p>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-gray-900">{displayBooking.guest?.phone}</p>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  booking={displayBooking} 
                  pricing={displayPricing}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            <div className="card p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in</span>
                  <span>{displayBooking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out</span>
                  <span>{displayBooking.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span>{displayBooking.guest?.adults + displayBooking.guest?.children} guests</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{formatPrice(displayPricing.nightlyRate || displayPricing.breakdown?.nightlyRate)} x {displayBooking.nights} nights</span>
                  <span>{formatPrice(displayPricing.subtotal || displayPricing.breakdown?.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>{formatPrice(displayPricing.cleaningFee || displayPricing.breakdown?.cleaningFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{formatPrice(displayPricing.taxes || displayPricing.breakdown?.taxes)}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(displayPricing.total || displayPricing.breakdown?.total)}</span>
              </div>

              <div className="mt-4 p-3 bg-primary-50 rounded-md">
                <p className="text-sm text-primary-800">
                  <strong>Deposit due now:</strong> {formatPrice(displayPricing.depositAmount)}
                </p>
                <p className="text-xs text-primary-600 mt-1">
                  Balance of {formatPrice(displayPricing.balanceAmount)} due on {displayBooking.checkIn}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>By completing this booking, you agree to our Terms of Service and Cancellation Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}