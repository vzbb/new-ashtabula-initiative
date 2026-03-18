import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
        localStorage.removeItem('auth_token');
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export const useBookingStore = create(
  persist(
    (set, get) => ({
      currentBooking: null,
      pricing: null,
      
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      setPricing: (pricing) => set({ pricing }),
      clearBooking: () => set({ currentBooking: null, pricing: null }),
      
      updateBookingDates: (checkIn, checkOut) => {
        const { currentBooking } = get();
        if (currentBooking) {
          set({
            currentBooking: { ...currentBooking, checkIn, checkOut },
          });
        }
      },
      
      updateGuestInfo: (guest) => {
        const { currentBooking } = get();
        if (currentBooking) {
          set({
            currentBooking: { ...currentBooking, guest: { ...currentBooking.guest, ...guest } },
          });
        }
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);

export const usePropertyStore = create((set) => ({
  properties: [],
  selectedProperty: null,
  availability: {},
  isLoading: false,
  
  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setAvailability: (propertyId, availability) => set((state) => ({
    availability: { ...state.availability, [propertyId]: availability },
  })),
  setLoading: (loading) => set({ isLoading: loading }),
}));