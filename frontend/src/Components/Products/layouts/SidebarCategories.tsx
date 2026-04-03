'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categoryService, Category } from "@/app/accounts/addCategories/lib/categoryService";

// Fallback categories when the backend is unavailable
const FALLBACK_CATEGORIES: Category[] = [
    { id: 1, name: 'Women', description: 'Women\'s collection' },
    { id: 2, name: 'Man', description: 'Men\'s collection' },
    { id: 3, name: 'Kids', description: 'Kids\' collection' },
    { id: 4, name: 'Baby', description: 'Baby collection' },
    { id: 5, name: 'Shoes', description: 'Shoes collection' },
    { id: 6, name: 'Watches', description: 'Watches collection' },
    { id: 7, name: 'Sunglass', description: 'Sunglasses collection' },
];

const SidebarCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryService.fetchCategories();
                setCategories(data);
            } catch (err: any) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Use backend categories if available, otherwise use fallback
    const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

    if (loading) {
        return (
            <div className="w-[260px] bg-white rounded-bl-md rounded-br-md shadow-sm border border-gray-100 flex-shrink-0 hidden lg:flex flex-col h-full overflow-y-auto scrollbar-hide">
                <div className="flex flex-col py-2">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="px-6 py-3 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && displayCategories.length === 0) {
        return null;
    }

    return (
        <div className="w-[260px] bg-white rounded-bl-md rounded-br-md shadow-[2px_0_10px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0 hidden lg:flex flex-col h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col">
                {displayCategories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/main/products/categories?category=${cat.id}`}
                        className="group flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#f59e0b] transition-colors">
                            {cat.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#f59e0b] transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SidebarCategories;
