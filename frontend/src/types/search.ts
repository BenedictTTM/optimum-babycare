import { Product } from '@/api/types';

export interface SearchFilters {
    categories?: { name: string; count: number }[];
    priceRange?: { min: number; max: number };
}

export interface SearchResult {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    filters?: SearchFilters;
}

export interface SearchParams {
    q: string;
    category?: string;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
    page?: number;
    limit?: number;
}
