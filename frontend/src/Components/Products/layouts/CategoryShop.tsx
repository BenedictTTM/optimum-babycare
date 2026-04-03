'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
    {
        title: 'Womens Wear',
        image: 'https://images.unsplash.com/photo-1549439602-43ebcb2327af?w=400&auto=format&fit=crop&q=60',
        stats: [
            { name: 'T-shirt', count: 185 },
            { name: 'Jeans', count: 324 },
            { name: 'Shoes', count: 690 }
        ]
    },
    {
        title: 'Kids Wear',
        image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400&auto=format&fit=crop&q=60',
        stats: [
            { name: 'T-shirt', count: 185 },
            { name: 'Jeans', count: 324 },
            { name: 'Shoes', count: 690 }
        ]
    },
    {
        title: 'Mens Wear',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60',
        stats: [
            { name: 'T-shirt', count: 185 },
            { name: 'Jeans', count: 324 },
            { name: 'Shoes', count: 690 }
        ]
    }
];

const CategoryShop = () => {
    return (
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header with Nav Controls */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-red-500">
                            <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-gray-500 font-bold text-[11px] uppercase tracking-[0.2em] italic">Featured</span>
                        <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-red-500">
                            <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                        Shop By Catagories
                    </h2>
                </div>

                {/* Nav Controls */}
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2 border border-gray-200 rounded text-[11px] font-extrabold text-gray-900 hover:bg-gray-50 transition-colors uppercase tracking-widest">
                        ← Prev
                    </button>
                    <button className="px-6 py-2 border border-gray-200 rounded text-[11px] font-extrabold text-gray-900 hover:bg-gray-50 transition-colors uppercase tracking-widest">
                        Next →
                    </button>
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {CATEGORIES.map((cat, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow group">
                        {/* Circular Image Wrap */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                            <div className="absolute inset-0 bg-neutral-100 rounded-full" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm ring-1 ring-gray-100">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    loading="lazy"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="150px"
                                />
                            </div>
                        </div>

                        {/* Text & Stats */}
                        <div className="flex-1 flex flex-col items-start space-y-3">
                            <h3 className="text-[16px] sm:text-[18px] font-extrabold text-gray-900 leading-tight">
                                {cat.title}
                            </h3>

                            <div className="space-y-1.5 w-full">
                                {cat.stats.map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between text-[11px] sm:text-[12px] group/stat">
                                        <span className="text-gray-500 font-medium group-hover/stat:text-red-500 transition-colors">{stat.name}</span>
                                        <span className="text-gray-400">({stat.count})</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/main/products" className="pt-2 text-[11px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-1 group/link">
                                View All
                                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryShop;
