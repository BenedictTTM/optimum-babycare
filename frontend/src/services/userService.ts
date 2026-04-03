
import { apiClient } from '@/api/clients';

export interface UserProfile {
    id: number;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profilePic?: string;
    phone?: string;
    storeName?: string;
    role: string;
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await apiClient.patch('/users/profile', data);
        return response.data;
    },

    getStoreDetails: async (userId: number) => {
        const response = await apiClient.get(`/users/${userId}/store`);
        return response.data;
    }
};
