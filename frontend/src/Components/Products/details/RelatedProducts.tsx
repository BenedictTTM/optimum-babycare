import React from 'react';
import Link from 'next/link';
import { ProductsGrid } from '../cards/ProductCard';
import { Product } from '@/types/products';

interface RelatedProductsProps {
    category?: string;
    currentProductId: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

async function getRelatedProducts(category: string, currentProductId: number): Promise<Product[]> {
    if (!category) return [];

    try {
        // Fetch a few more items than needed to account for filtering the current product
        const res = await fetch(`${API_URL}/products/category/${encodeURIComponent(category)}?limit=2&cacheable=true`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            console.error('Failed to fetch related products', res.status);
            return [];
        }

        const data = await res.json();
        const products = data.data || []; // Handle { data: [], pagination: ... } structure

        // Filter out current product and limit to 4
        return products
            .filter((p: Product) => p.id !== currentProductId)
            .slice(0, 4);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
}

export default async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
    if (!category) return null;

    const products = await getRelatedProducts(category, currentProductId);

    if (products.length === 0) return null;

    return (
        <div className="mt-12 md:mt-16 border-t border-gray-100 pt-8 sm:pt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    More from <span className="capitalize text-amber-900">{category}</span>
                </h2>
            </div>

            <div className="w-full">
                <ProductsGrid products={products} />
            </div>
        </div>
    );
}
