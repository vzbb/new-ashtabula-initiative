import { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, 
  RefreshCw, Phone, Car, ChevronDown, ChevronUp,
  LogIn, Search
} from 'lucide-react';

// Mock data for store dashboard (in real app, this would come from API)
const mockOrders = [
  {
    id: '1',
    order_code: 'GG-A7B9C2',
    customer_name: 'Sarah Johnson',
    customer_phone: '+14405551234',
    car_description: 'Red Toyota Camry',
    status: 'confirmed',
    pickup_time_start: '14:00',
    pickup_time_end: '15:00',
    pickup_date: new Date().toISOString().split('T')[0],
    total_cents: 4850,
    items: [
      { product_name: 'Large Eggs', quantity: 1 },
      { product_name: 'Whole Milk', quantity: 2 },
      { product_name: 'Ground Beef', quantity: 1 }
    ]
  },
  {
    id: '2',
    order_code: 'GG-X3K8M1',
    customer_name: 'Mike Thompson',
    customer_phone: '+14405555678',
    car_description: 'Blue Ford F-150',
    status: 'preparing',
    pickup_time_start: '15:00',
    pickup_time_end: '16:00',
    pickup_date: new Date().toISOString().split('T')[0],
    total_cents: 7235,
    items: [
      { product_name: 'Boneless Chicken Breast', quantity: 2 },
      { product_name: 'Fresh Greens Mix', quantity: 1 },
      { product_name: 'Artisan Sourdough', quantity: 1 }
    ]
  },
  {
    id: '3',
    order_code: 'GG-P9Q2R5',
    customer_name: 'Emily Davis',
    customer_phone: '+14405559012',
    car_description: 'Silver Honda Civic',
    status: 'ready',
    pickup_time_start: '13:00',
    pickup_time_end: '14:00',
    pickup_date: new Date().toISOString().split('T')[0],
    total_cents: 3240,
    items: [
      { product_name: 'Roma Tomatoes', quantity: 3 },
      { product_name: 'Shredded Cheddar Cheese', quantity: 1 }
    ]
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  'picked-up': 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  'picked-up': 'Picked Up',
  cancelled: 'Cancelled'
};

const nextStatuses = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'picked-up'
};

export default function StoreDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    setIsLoggedIn(true);
  }

  function updateOrderStatus(orderId, newStatus) {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  }

  function getNextStatusButton(currentStatus) {
    const next = nextStatuses[currentStatus];
    if (!next) return null;

    const labels = {
      confirmed: 'Confirm Order',
      preparing: 'Start Preparing',
      ready: 'Mark Ready',
      'picked-up': 'Complete Pickup'
    };

    return (
      <button
        onClick={() => updateOrderStatus(selectedOrder.id, next)}
        className="btn-primary w-full"
      >
        {labels[next]}
      </button>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold">Store Dashboard</h1>
            <p className="text-gray-600">Sign in to manage orders</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="input-field" placeholder="store@example.com" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="input-field" placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Demo mode: Click Sign In to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Sander's Market Dashboard</h1>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setOrders([...orders])}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Orders</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="picked-up">Completed</option>
              </select>
            </div>

            {/* Orders Grid */}
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full card p-4 text-left hover:shadow-md transition-shadow ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-bold text-lg text-primary-600">{order.order_code}</p>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                      </div>
                      
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${(order.total_cents / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.pickup_time_start?.slice(0, 5)}</p>
                    </div>
                  </div>
                </button>
              ))}
              
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Detail */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{selectedOrder.order_code}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.customer_phone}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.car_description}</span>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">Items</p>
                    <ul className="space-y-1">
                      {selectedOrder.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}× {item.product_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">${(selectedOrder.total_cents / 100).toFixed(2)}</span>
                  </div>
                </div>

                {getNextStatusButton(selectedOrder.status)}
              </div>
            ) : (
              <div className="card p-6 text-center text-gray-500 sticky top-24">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
