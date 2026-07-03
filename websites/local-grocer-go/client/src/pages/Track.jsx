import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: Truck,
  'picked-up': CheckCircle,
  cancelled: XCircle
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  'picked-up': 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  'picked-up': 'Completed',
  cancelled: 'Cancelled'
};

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPhone = searchParams.get('phone') || '';
  
  const [phone, setPhone] = useState(initialPhone);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!phone) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders(phone);
      setOrders(data.orders);
      setSearched(true);
      setSearchParams({ phone });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={!phone || loading}
            className="btn-primary px-8"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Enter the phone number you used to place your order.
        </p>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {searched && orders.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600">We couldn't find any orders for {phone}.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => {
          const StatusIcon = statusIcons[order.status] || Clock;
          
          return (
            <div key={order.id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Code</p>
                  <p className="text-2xl font-bold text-primary-600">{order.order_code}</p>
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pickup Date</p>
                  <p className="font-medium">
                    {new Date(order.pickup_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Pickup Time</p>
                  <p className="font-medium">
                    {order.pickup_time_start?.slice(0, 5)} - {order.pickup_time_end?.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold">{formatPrice(order.total_cents)}</p>
                  </div>
                  
                  <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
