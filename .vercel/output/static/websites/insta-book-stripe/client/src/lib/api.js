const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  getMe: () => fetchWithAuth('/api/auth/me'),
  updateMe: (data) => fetchWithAuth('/api/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
  register: (data) => fetchWithAuth('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

// Properties API
export const propertiesApi = {
  getAll: (params) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchWithAuth(`/api/properties${query}`);
  },
  getBySlug: (slug) => fetchWithAuth(`/api/properties/${slug}`),
  getAvailability: (id, month) => fetchWithAuth(`/api/properties/${id}/availability?month=${month}`),
  create: (data) => fetchWithAuth('/api/properties', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`/api/properties/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getMyProperties: () => fetchWithAuth('/api/properties/owner/my-properties'),
};

// Bookings API
export const bookingsApi = {
  calculate: (data) => fetchWithAuth('/api/bookings/calculate', { method: 'POST', body: JSON.stringify(data) }),
  createInquiry: (data) => fetchWithAuth('/api/bookings/inquiry', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id) => fetchWithAuth(`/api/bookings/${id}`),
  getMyBookings: (params) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchWithAuth(`/api/bookings/owner/my-bookings${query}`);
  },
  cancel: (id, reason) => fetchWithAuth(`/api/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
};

// Stripe API
export const stripeApi = {
  createPaymentIntent: (data) => fetchWithAuth('/api/stripe/create-payment-intent', { method: 'POST', body: JSON.stringify(data) }),
  getConnectStatus: () => fetchWithAuth('/api/stripe/connect/status'),
  createConnectOnboarding: (data) => fetchWithAuth('/api/stripe/connect/onboard', { method: 'POST', body: JSON.stringify(data) }),
};

// User API
export const userApi = {
  getDashboardStats: () => fetchWithAuth('/api/users/dashboard-stats'),
  getEarnings: (period) => fetchWithAuth(`/api/users/earnings?period=${period || 'month'}`),
};