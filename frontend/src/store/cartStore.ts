import { create } from 'zustand';
import { apiClient } from '@/api/clients';
import { getLocalCart } from '@/lib/localCart';

interface CartState {
  itemCount: number;
  isLoading: boolean;
  setItemCount: (count: number) => void;
  incrementCount: (amount?: number) => void;
  fetchItemCount: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  isLoading: false,
  setItemCount: (count) => set({ itemCount: count }),
  incrementCount: (amount = 1) => set((state) => ({ itemCount: state.itemCount + amount })),
  fetchItemCount: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Fetch from server
        const response = await apiClient.get('/cart/count');
        set({ itemCount: response.data.count || 0 });
      } else {
        // Fetch from local storage
        const localCart = getLocalCart();
        const count = localCart.reduce((acc, item) => acc + item.quantity, 0);
        set({ itemCount: count });
      }
    } catch (error) {
      console.error('Failed to fetch cart count', error);
      // Fallback to local cart if server fails or user not logged in (401 handled in interceptor usually)
      const localCart = getLocalCart();
      const count = localCart.reduce((acc, item) => acc + item.quantity, 0);
      set({ itemCount: count });
    } finally {
      set({ isLoading: false });
    }
  },
}));
