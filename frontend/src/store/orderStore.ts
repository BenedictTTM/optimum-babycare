import { create } from 'zustand';
import { apiClient } from '@/api/clients';

interface OrderState {
  orderCount: number;
  isLoading: boolean;
  setOrderCount: (count: number) => void;
  decrementCount: () => void;
  fetchOrderCount: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderCount: 0,
  isLoading: false,
  setOrderCount: (count) => set({ orderCount: count }),
  decrementCount: () => set((state) => ({ orderCount: Math.max(0, state.orderCount - 1) })),
  fetchOrderCount: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // We fetch the basic orders array to determine the count
        const response = await apiClient.get('/orders');
        if (response.data && Array.isArray(response.data)) {
          set({ orderCount: response.data.length });
        } else {
          set({ orderCount: 0 });
        }
      } else {
        set({ orderCount: 0 });
      }
    } catch (error: any) {
      // 401 means no valid token; ignore error spam and set count 0
      if (error?.response?.status !== 401) {
        console.error('Failed to fetch order count', error);
      }
      set({ orderCount: 0 });
    } finally {
      set({ isLoading: false });
    }
  },
}));
