import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, MessageSquare, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../store/cartStore';

export default function Confirmation() {
  const currentOrder = useOrderStore((state) => state.currentOrder);

  useEffect(() => {
    if (!currentOrder) {
      // If no order in state, user landed here directly
    }
  }, [currentOrder]);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h2>
        <p className="text-gray-600 mb-6">Looks like you don't have a recent order.</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          We've sent a confirmation to {currentOrder.customer_phone}
        </p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Order Code</p>
            <p className="text-2xl font-bold text-primary-600">{currentOrder.order_code}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Confirmed
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Package className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Pickup Time</p>
              <p className="text-gray-600">
                {new Date(currentOrder.pickup_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-600">
                {currentOrder.pickup_time_start?.slice(0, 5)} - {currentOrder.pickup_time_end?.slice(0, 5)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">SMS Updates</p>
              <p className="text-gray-600">
                We'll text you when your order is being prepared and when it's ready for pickup.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        
        <div className="space-y-2 mb-4">
          {currentOrder.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.quantity}× {item.product_name}</span>
              <span>{formatPrice(item.subtotal_cents)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(currentOrder.subtotal_cents)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(currentOrder.tax_cents)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">{formatPrice(currentOrder.total_cents)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to={`/track?phone=${encodeURIComponent(currentOrder.customer_phone)}`} className="btn-primary flex-1 text-center">
          Track Your Order
          <ArrowRight className="h-4 w-4 ml-2 inline" />
        </Link>
        
        <Link to="/" className="btn-secondary flex-1 text-center">
          Place Another Order
        </Link>
      </div>
    </div>
  );
}
