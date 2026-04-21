'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { categoryService, Category } from "@/app/accounts/addCategories/lib/categoryService";

const TopCat: React.FC = () => {
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

    if (loading) {
        return (
            <div className="w-full md:py-5 lg:py-6">
                <div className="flex overflow-x-auto gap-3 md:gap-4 px-1 scrollbar-hide scroll-smooth justify-center">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-8 w-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return null; // Hide completely on error for cleaner UI
    }

    return (
        <div className="w-full md:py-5 lg:py-6">
            <div className="flex overflow-x-auto gap-3 md:gap-4 px-1 scrollbar-hide scroll-smooth justify-start md:justify-center">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/products/categories?category=${cat.id}`}
                        className="flex-shrink-0"
                    >
                        <div
                            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-amber-100 hover:text-amber-400 cursor-pointer transition-colors duration-200 whitespace-nowrap"
                        >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-amber-400 transition-colors duration-200">
                                {cat.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TopCat;
