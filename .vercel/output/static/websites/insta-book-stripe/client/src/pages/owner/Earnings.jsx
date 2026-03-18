import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BanknotesIcon, ArrowTrendingUpIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { userApi, stripeApi } from '../../lib/api.js';

export default function OwnerEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [stripeStatus, setStripeStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [earningsData, statusData] = await Promise.all([
        userApi.getEarnings(),
        stripeApi.getConnectStatus(),
      ]);
      setEarnings(earningsData);
      setStripeStatus(statusData);
    } catch (error) {
      toast.error('Failed to load earnings data');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Earnings</h1>

        {!stripeStatus?.connected && (
          <div className="card p-6 mb-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Connect Stripe to receive payouts</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You need to connect your Stripe account to receive payments from bookings
                </p>
              </div>
              <Link to="/owner/stripe/onboarding" className="btn-primary">
                Connect Stripe
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <BanknotesIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">{formatPrice(earnings?.totalEarnings || 0)}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <CreditCardIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed Payouts</p>
                <p className="text-2xl font-bold">{formatPrice(earnings?.completedPayouts || 0)}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Platform Fees (0.5%)</p>
                <p className="text-2xl font-bold">{formatPrice(earnings?.platformFees || 0)}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <BanknotesIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Payouts</p>
                <p className="text-2xl font-bold">{formatPrice(earnings?.pendingPayouts || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="card">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Monthly Breakdown</h2>
          </div>
          
          <div className="divide-y">
            {earnings?.earningsByMonth?.length > 0 ? (
              earnings.earningsByMonth.map((month) => (
                <div key={month.month} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-500">{month.bookings} bookings</p>
                  </div>
                  <p className="font-semibold">{formatPrice(month.earnings)}</p>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No earnings data yet
              </div>
            )}
          </div>
        </div>

        {/* Platform Fee Comparison */}
        <div className="mt-8 card p-6">
          <h2 className="text-lg font-semibold mb-4">Why 0.5% Platform Fee?</h2>
          <p className="text-gray-600 mb-4">
            We believe property owners should keep more of what they earn. 
            Compare our fees to other platforms:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Platform</th>
                  <th className="text-right py-2">Host Fee</th>
                  <th className="text-right py-2">Guest Fee</th>
                  <th className="text-right py-2">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-green-50">
                  <td className="py-3 font-medium">Insta-Book</td>
                  <td className="text-right py-3">0.5%</td>
                  <td className="text-right py-3">0%</td>
                  <td className="text-right py-3 font-semibold text-green-600">0.5%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Airbnb</td>
                  <td className="text-right py-3">3%</td>
                  <td className="text-right py-3">~14%</td>
                  <td className="text-right py-3">~17%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">VRBO</td>
                  <td className="text-right py-3">8%</td>
                  <td className="text-right py-3">6-12%</td>
                  <td className="text-right py-3">14-20%</td>
                </tr>
                <tr>
                  <td className="py-3">Booking.com</td>
                  <td className="text-right py-3">15%</td>
                  <td className="text-right py-3">0%</td>
                  <td className="text-right py-3">15%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}