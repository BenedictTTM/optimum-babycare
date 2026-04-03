
import { apiClient } from '@/api/clients';
import { SearchResult, SearchParams } from '@/types/search';
import { Product, PaginatedResponse } from '@/api/types';

export const searchProducts = async (params: SearchParams): Promise<SearchResult> => {
    const { q, category, sortBy, page = 1, limit = 20 } = params;

    // Map frontend sort options to backend sort fields if necessary
    const sortMap: Record<string, string> = {
        'relevance': 'relevance',
        'price_asc': 'price_asc',
        'price_desc': 'price_desc',
        'newest': 'newest',
        'rating': 'rating'
    };

    try {
        // Use the dedicated search endpoint
        const response = await apiClient.get<any>('/products/search', {
            params: {
                q: q, // Changed from 'search' to 'q' to match backend
                category: category !== 'All Categories' ? category : undefined,
                sortBy: sortMap[sortBy || 'relevance'] || sortBy, // Changed from 'sort' to 'sortBy'
                page,
                limit
            }
        });

        const data = response.data;

        return {
            products: data.products || [],
            total: data.total || 0,
            page: data.page || 1,
            totalPages: data.totalPages || 0,
            filters: data.filters || { categories: [] }
        };
    } catch (error) {
        console.error('Search service error:', error);
        // Return empty result on error to prevent page crash
        return {
            products: [],
            total: 0,
            page: 1,
            totalPages: 0,
            filters: { categories: [] }
        };
    }
};
