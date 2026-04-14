import { create } from 'zustand';
import { apiClient } from '@/api/clients';

export interface User {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
    role?: string;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user }),

    fetchUser: async () => {
        // Skip if already loaded — prevents duplicate /auth/me calls
        // when multiple components (Navbar + Sidebar) call this simultaneously.
        const { user, isLoading } = useUserStore.getState();
        if (user || isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/auth/me');
            set({ user: response.data, isLoading: false });
        } catch (error: any) {
            console.error('Failed to fetch user:', error);
            set({
                user: null,
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch user'
            });
        }
    },

    logout: () => {
        set({ user: null, error: null });
    },
}));
