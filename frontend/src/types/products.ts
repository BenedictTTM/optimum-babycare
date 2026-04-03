
export interface Product {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string[];
    images?: string[];
    originalPrice: number;
    discountedPrice?: number;
    stock?: number;
    isActive?: boolean;
    isSold?: boolean;
    condition?: string;
    tags?: string[];
    category?: string;
    user?: {
        storeName: string;
        [key: string]: any;
    };
    _count?: {
        reviews: number;
    };
    reviews?: any[]; // Using any[] for now as Review type is not confirmed, can be refined later if needed
    views?: number;
    createdAt?: string;
    updatedAt?: string;
    averageRating?: number;
    totalReviews?: number;
}
