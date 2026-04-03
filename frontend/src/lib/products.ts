
import { apiClient } from '@/api/clients';
import { Product } from '@/types/products';

export interface ProductsResponse {
    success: boolean;
    data?: Product[];
    message?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SingleProductResponse {
    success: boolean;
    data?: Product;
    message?: string;
}

export const fetchAllProducts = async (
    page = 1,
    limit = 20
): Promise<ProductsResponse> => {
    try {
        const response = await apiClient.get<any>(
            `/products?page=${page}&limit=${limit}`,
            {
                withCredentials: true,
            }
        );

        // API returns { data: [...], pagination: {...} } but we expect ProductsResponse with success: true
        if (response.data && response.data.data) {
            return {
                success: true,
                data: response.data.data,
                pagination: response.data.pagination,
                message: 'Products fetched successfully'
            };
        }

        return response.data;
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch products',
        };
    }
};

export const fetchProductById = async (
    id: number
): Promise<SingleProductResponse> => {
    try {
        const response = await apiClient.get<any>(`/products/${id}`, {
            withCredentials: true,
        });

        // API returns product object directly, normalize to SingleProductResponse
        if (response.data && (response.data.id || response.data.data)) {
            const productData = response.data.data || response.data;
            return {
                success: true,
                data: productData,
                message: 'Product fetched successfully'
            };
        }

        return response.data;
    } catch (error: any) {
        console.error(`Error fetching product ${id}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch product',
        };
    }
};

export const createProduct = async (
    productData: FormData
): Promise<SingleProductResponse> => {
    try {
        const response = await apiClient.post<SingleProductResponse>(
            '/products',
            productData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error creating product:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create product',
        };
    }
};

export const updateProduct = async (
    id: number,
    updates: Partial<Product>
): Promise<SingleProductResponse> => {
    try {
        const response = await apiClient.put<SingleProductResponse>(
            `/products/${id}`,
            updates,
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error(`Error updating product ${id}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update product',
        };
    }
};

export const deleteProduct = async (
    id: number
): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await apiClient.delete<{ success: boolean; message?: string }>(
            `/products/${id}`,
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error(`Error deleting product ${id}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete product',
        };
    }
};
