export interface Product {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string[];
    originalPrice: number;
    discountedPrice?: number;
    rating?: number;
    averageRating?: number;
    views?: number;
    category?: string;
    categoryId?: number;
    userId?: number; // owner
    locationLat?: number;
    locationLng?: number;
    tags?: string[];
    stock?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        totalCount: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
