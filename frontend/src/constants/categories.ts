export interface ProductCategory {
    id?: number;
    name: string;
    label?: string; // Frontend might use label, backend uses name
    slug: string;
    description?: string;
    image?: string;
    _count?: {
        products: number;
    };
}
