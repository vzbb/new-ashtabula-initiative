const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Mock data for demo mode when backend is unavailable
const MOCK_STORES = {
  stores: [
    {
      id: 1,
      name: "Johnson's Market",
      description: "Family-owned market with fresh local produce and baked goods",
      address: "456 Bridge St, Ashtabula, OH",
      phone: "(440) 555-0101"
    },
    {
      id: 2,
      name: "Lakeview Grocery",
      description: "Convenient downtown location with organic selections",
      address: "123 Main Ave, Ashtabula, OH",
      phone: "(440) 555-0102"
    },
    {
      id: 3,
      name: "Harbor Fresh Foods",
      description: "Specializing in Lake Erie fresh catch and local specialties",
      address: "789 Lake Rd, Ashtabula, OH",
      phone: "(440) 555-0103"
    }
  ]
};

const MOCK_PRODUCTS = {
  grouped: {
    eggs: [
      { id: 1, name: "Farm Fresh Eggs", description: "Dozen large brown eggs", price_cents: 499, unit: "dozen", is_local: true },
      { id: 2, name: "Organic Eggs", description: "Free-range organic", price_cents: 699, unit: "dozen", is_local: false }
    ],
    dairy: [
      { id: 3, name: "Whole Milk", description: "Local dairy, gallon", price_cents: 389, unit: "gallon", is_local: true },
      { id: 4, name: "Sharp Cheddar", description: "Aged 2 years", price_cents: 549, unit: "lb", is_local: true }
    ],
    bread: [
      { id: 5, name: "Sourdough Loaf", description: "Baked fresh daily", price_cents: 599, unit: "loaf", is_local: true },
      { id: 6, name: "Whole Wheat", description: "Stone ground", price_cents: 449, unit: "loaf", is_local: false }
    ],
    meat: [
      { id: 7, name: "Ground Beef", description: "85% lean, local farm", price_cents: 699, unit: "lb", is_local: true },
      { id: 8, name: "Chicken Breast", description: "Boneless, skinless", price_cents: 549, unit: "lb", is_local: false }
    ],
    produce: [
      { id: 9, name: "Roma Tomatoes", description: "Vine ripened", price_cents: 299, unit: "lb", is_local: true },
      { id: 10, name: "Sweet Corn", description: "Ashtabula County grown", price_cents: 199, unit: "ear", is_local: true },
      { id: 11, name: "Honeycrisp Apples", description: "Local orchard", price_cents: 249, unit: "lb", is_local: true }
    ],
    pantry: [
      { id: 12, name: "Pure Maple Syrup", description: "Ohio maple", price_cents: 899, unit: "bottle", is_local: true },
      { id: 13, name: "Honey", description: "Raw local honey", price_cents: 799, unit: "jar", is_local: true }
    ],
    "local-specialty": [
      { id: 14, name: "Lake Erie Walleye", description: "Fresh catch", price_cents: 1299, unit: "lb", is_local: true },
      { id: 15, name: "Pierogi", description: "Homemade potato & cheese", price_cents: 699, unit: "dozen", is_local: true }
    ]
  }
};

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    // Return mock data for demo purposes
    console.log('API unavailable, using mock data for:', endpoint);
    
    if (endpoint === '/api/v1/stores') {
      return MOCK_STORES;
    }
    if (endpoint.startsWith('/api/v1/stores/')) {
      const id = parseInt(endpoint.split('/').pop());
      const store = MOCK_STORES.stores.find(s => s.id === id) || MOCK_STORES.stores[0];
      return { store };
    }
    if (endpoint.startsWith('/api/v1/products/store/')) {
      return MOCK_PRODUCTS;
    }
    
    // For other endpoints, return empty data
    return { error: 'Demo mode - feature unavailable' };
  }
}

export const api = {
  // Stores
  getStores: () => fetchAPI('/api/v1/stores'),
  getStore: (id) => fetchAPI(`/api/v1/stores/${id}`),
  
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/v1/products?${query}`);
  },
  getStoreProducts: (storeId) => fetchAPI(`/api/v1/products/store/${storeId}`),
  
  // Slots
  getSlots: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/v1/slots?${query}`);
  },
  
  // Orders
  getOrders: (phone) => fetchAPI(`/api/v1/orders?phone=${encodeURIComponent(phone)}`),
  getOrder: (id) => fetchAPI(`/api/v1/orders/${id}`),
  createOrder: (data) => fetchAPI('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  cancelOrder: (id, reason) => fetchAPI(`/api/v1/orders/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ reason })
  }),
  
  // SMS
  sendVerification: (phone) => fetchAPI('/api/v1/sms/send-verification', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),
  verifyCode: (phone, code) => fetchAPI('/api/v1/sms/verify-code', {
    method: 'POST',
    body: JSON.stringify({ phone, code })
  })
};
