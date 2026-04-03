import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log('🌐 [API] Base URL:', API_BASE_URL);

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Don't force redirect, let the app handle auth state
        }
        return Promise.reject(error);
    }
);

export const products = {
    getAll: async (page = 1, limit = 20) => {
        const response = await apiClient.get(`/products?page=${page}&limit=${limit}`);
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    }
};
