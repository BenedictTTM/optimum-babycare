
import { Product } from '@/types/products';

export interface CartItem {
    id: number;
    quantity: number;
    product: Product & {
        stockStatus?: {
            available: number;
            inStock: boolean;
            exceedsStock: boolean;
            maxAvailable: number | null;
        };
    };
    itemTotal: number;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    subtotal: number;
    totalItems: number;
    hasStockIssues: boolean;
    createdAt: string;
    updatedAt: string;
}
