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
    /**
     * Fetch all categories
     */
    async fetchCategories(): Promise<Category[]> {
        try {
            const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
            return response.data.data || [];
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
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
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete category');
        }
    }
}

// Export a singleton instance
export const categoryService = new CategoryService();

