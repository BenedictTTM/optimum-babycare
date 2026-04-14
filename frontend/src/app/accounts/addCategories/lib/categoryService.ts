import { apiClient } from '@/api/clients';

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    products?: any[];
    _count?: {
        products: number;
    };
}

const CATEGORY_CACHE_KEY = 'optimum_categories_cache';
const CATEGORY_FETCH_TIME_KEY = 'optimum_categories_last_fetch';


export interface CreateCategoryData {
    name: string;
    description: string;
}

export interface UpdateCategoryData {
    name?: string;
    description?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    count?: number;
}

/**
 * Category Service
 * Handles all category-related API calls
 */
class CategoryService {
    private cache: Category[] | null = null;
    private lastFetch: number = 0;
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

    /**
     * Fetch all categories
     */
    async fetchCategories(): Promise<Category[]> {
        const now = Date.now();
        
        // 1. Try In-memory cache first
        if (this.cache && (now - this.lastFetch < this.CACHE_TTL)) {
            return this.cache;
        }

        // 2. Try LocalStorage fallback
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(CATEGORY_CACHE_KEY);
            const storedTime = localStorage.getItem(CATEGORY_FETCH_TIME_KEY);
            
            if (stored && storedTime) {
                const parsedTime = parseInt(storedTime, 10);
                if (now - parsedTime < this.CACHE_TTL) {
                    this.cache = JSON.parse(stored);
                    this.lastFetch = parsedTime;
                    return this.cache!;
                }
            }
        }

        try {
            const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
            const categories = response.data.data || [];
            
            // Update internal and external cache
            this.cache = categories;
            this.lastFetch = now;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(categories));
                localStorage.setItem(CATEGORY_FETCH_TIME_KEY, now.toString());
            }
            
            return categories;
        } catch (error: any) {
            // Return stale cache if available
            if (this.cache) return this.cache;
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    }

    /**
     * Force refresh the categories list
     */
    async refreshCategories(): Promise<Category[]> {
        this.clearCache();
        return this.fetchCategories();
    }

    /**
     * Clear the local category cache
     */
    clearCache(): void {
        this.cache = null;
        this.lastFetch = 0;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CATEGORY_CACHE_KEY);
            localStorage.removeItem(CATEGORY_FETCH_TIME_KEY);
        }
    }

    /**
     * Fetch a single category by ID
     */
    async fetchCategory(id: number): Promise<Category> {
        try {
            const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch category');
        }
    }

    /**
     * Create a new category
     */
    async createCategory(data: CreateCategoryData): Promise<Category> {
        try {
            const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
            this.clearCache(); // Invalidate cache after modification
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create category');
        }
    }

    /**
     * Update an existing category
     */
    async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
        try {
            const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
            this.clearCache(); // Invalidate cache after modification
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update category');
        }
    }

    /**
     * Delete a category
     */
    async deleteCategory(id: number): Promise<void> {
        try {
            await apiClient.delete(`/categories/${id}`);
            this.clearCache(); // Invalidate cache after modification
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete category');
        }
    }
}

// Export a singleton instance
export const categoryService = new CategoryService();

