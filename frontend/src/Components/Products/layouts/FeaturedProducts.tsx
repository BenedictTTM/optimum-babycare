'use client';

import React from 'react';
import Image from 'next/image';

const FEATURED_PRODUCTS = [
    { id: 1, title: 'The Linen Workwear Blue T-shirt', price: 24.00, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60' },
    { id: 2, title: 'The Organic Cotton Cutaway Tank', price: 29.00, image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60' },
    { id: 3, title: 'The Seersucker Midi Dress', price: 39.00, image: 'https://images.unsplash.com/photo-1549439602-43ebcb2327af?w=500&auto=format&fit=crop&q=60' },
    { id: 4, title: 'The Fatigue Barrel Black Pant', price: 31.00, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60', tag: 'HOT', discount: '-33%' },
];

const FeaturedProducts = () => {
    return (
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Heading with squiggles */}
            <div className="flex flex-col items-center mb-12">
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
                    Featured Product
                </h2>
            </div>

            {/* 4-column responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {FEATURED_PRODUCTS.map((product, index) => (
                    <div key={index} className="flex flex-col space-y-4 group">
                        {/* Thumbnail Area */}
                        <div className="relative aspect-[3/4] bg-[#f5f5f5] rounded-xl overflow-hidden group">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                loading="lazy"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />

                            {/* Qty Selector Overlay */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold shadow-md hover:bg-red-500 hover:text-white transition-all transform active:scale-90">
                                    +
                                </button>
                                <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold shadow-md hover:bg-red-500 hover:text-white transition-all transform active:scale-90">
                                    -
                                </button>
                            </div>

                            {/* Badges Overlay */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                {product.discount && (
                                    <div className="bg-[#fde2e4] text-[#ef4444] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm">
                                        {product.discount}
                                    </div>
                                )}
                                {product.tag && (
                                    <div className="bg-white text-gray-900 text-[10px] font-extrabold px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center gap-1 uppercase italic">
                                        {product.tag}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Area */}
                        <div className="flex flex-col space-y-1">
                            <h3 className="text-[13px] sm:text-[14px] text-gray-600 font-bold leading-tight group-hover:text-red-500 transition-colors cursor-pointer line-clamp-1">
                                {product.title}
                            </h3>
                            <p className="text-[16px] sm:text-[18px] font-extrabold text-gray-900">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
