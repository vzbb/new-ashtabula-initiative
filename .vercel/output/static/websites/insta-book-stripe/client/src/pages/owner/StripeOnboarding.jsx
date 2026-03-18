import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { stripeApi } from '../../lib/api.js';

export default function StripeOnboarding() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await stripeApi.getConnectStatus();
      setStatus(data);
    } catch (error) {
      toast.error('Failed to load Stripe status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const { url } = await stripeApi.createConnectOnboarding({
        refreshUrl: window.location.href,
        returnUrl: window.location.href + '?success=true',
      });
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to start onboarding');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/owner" className="text-primary-600 hover:text-primary-700">← Back to Dashboard</Link>
        </div>

        <div className="card">
          <div className="px-6 py-8 text-center">
            {status?.connected ? (
              <>
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Stripe Connected!</h1>
                <p className="text-gray-600 mt-2">
                  Your Stripe account is active and ready to receive payments.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <ExclamationCircleIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Connect Stripe</h1>
                <p className="text-gray-600 mt-2">
                  Connect your Stripe account to start receiving payments from bookings.
                </p>
              </>
            )}
          </div>

          <div className="px-6 pb-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">What you'll need:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Personal/business information
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Bank account for payouts
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  ID verification
                </li>
              </ul>
            </div>

            {!status?.connected && (
              <button
                onClick={handleConnect}
                className="w-full btn-primary py-3"
              >
                Connect with Stripe
              </button>
            )}

            {status?.status === 'restricted' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">
                  Your account has restrictions. Please complete all requirements in your Stripe dashboard.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 card p-6">
          <h3 className="font-semibold mb-4">How payouts work</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>1. Guest books your property</strong> - Guest pays a deposit to secure their reservation.
            </p>
            <p>
              <strong>2. Balance charged automatically</strong> - The remaining balance is charged 14 days before check-in.
            </p>
            <p>
              <strong>3. You receive payout</strong> - Funds are transferred to your bank account (minus 0.5% platform fee).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}