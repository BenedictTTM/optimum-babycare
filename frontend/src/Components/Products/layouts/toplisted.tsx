"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductsCard from '../cards/ProductsCard';
import { Product } from '@/types/products';
import { products as productsApi } from '@/api/clients';

const TopListedItems = () => {
    const [topProducts, setTopProducts] = useState<Product[]>([]);

    useEffect(() => {
        productsApi.getAll(1, 2).then((data) => {
            const items = Array.isArray(data) ? data : data?.data ?? data?.products ?? [];
            setTopProducts(items.slice(0, 2));
        }).catch(() => {});
    }, []);

    return (
        <section className="w-full py-5 sm:py-8  sm:px-3 lg:px-8 max-w-7xl mx-auto">
            <div className="flex bg-white rounded-lg border border-gray-100 shadow-xs overflow-hidden flex-col lg:flex-row">
                {/* Left side: Product Grid */}
                <div className="flex-1 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
                            Top Listed Items
                        </h2>
                        <Link href="/products" className="text-sm font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1 transition-colors">
                            View All
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {topProducts.map((product) => (
                            <ProductsCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Right side: Promotional Banner */}
                <div className="lg:w-[320px] bg-amber-50 relative overflow-hidden flex flex-col items-center pt-12">
                    {/* Header text */}
                    <div className="relative z-10 text-center px-8">
                        <span className="text-[10px] font-extrabold text-gray-800 tracking-[0.2em] mb-4 block uppercase leading-none">
                            Hot Monthly Deal
                        </span>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-[1.1] mb-6">
                            Save an extra $25 <br /> per order
                        </h3>

                        <button className="bg-[#ef4444] text-white px-8 py-3 rounded-full text-sm font-extrabold hover:bg-red-600 transition-all shadow-xs hover:shadow-sm active:scale-95">
                            Shop Now
                        </button>
                    </div>

                    {/* Model Image - Bottom Aligned (increase height so image isn't cut) */}
                    <div className="mt-8 relative w-full h-[420px] sm:h-[250px] md:h-[300px] lg:h-[420px]">
                        <Image
                            src="/womanbabymilk.png"
                            alt="Woman Baby Milk"
                            fill
                            loading="lazy"
                            className="object-cover"
                            style={{ objectPosition: 'center 15%' }}
                            sizes="320px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopListedItems;
