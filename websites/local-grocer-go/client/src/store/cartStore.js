import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      storeId: null,
      
      addItem: (product, quantity = 1) => {
        const { items, storeId } = get();
        
        // If cart has items from different store, clear it
        if (storeId && storeId !== product.store_id) {
          set({ items: [], storeId: product.store_id });
        }
        
        const existingItem = items.find(item => item.product_id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            storeId: product.store_id
          });
        } else {
          set({
            items: [
              ...items,
              {
                product_id: product.id,
                name: product.name,
                price_cents: product.price_cents,
                unit: product.unit,
                quantity,
                image_url: product.image_url
              }
            ],
            storeId: product.store_id
          });
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product_id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.product_id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [], storeId: null }),
      
      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          return sum + (item.price_cents * item.quantity);
        }, 0);
      },
      
      getTax: () => {
        return Math.round(get().getSubtotal() * 0.0575);
      },
      
      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: 'local-grocer-cart'
    }
  )
);

export const useOrderStore = create((set) => ({
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
  clearCurrentOrder: () => set({ currentOrder: null })
}));
