'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TOP_PRODUCTS = [
    { id: 1, title: 'The Linen T-shirt', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop&q=60' },
    { id: 2, title: 'The Cotton Cutaway', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=60' },
    { id: 3, title: 'The Seersucker Dress', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&auto=format&fit=crop&q=60' },
    { id: 4, title: 'The Fatigue Sunglass', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1511499767390-91f9932aaad7?w=200&auto=format&fit=crop&q=60' },
    { id: 5, title: 'The Fatigue Shoe', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=60' },
    { id: 6, title: 'The Fatigue Shirt', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&auto=format&fit=crop&q=60' },
    { id: 7, title: 'The Cotton Cutaway', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop&q=60' },
    { id: 8, title: 'The Linen T-shirt', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=60' },
    { id: 9, title: 'The Fatigue Slipper', price: 21.00, rating: 4, reviews: 10, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&auto=format&fit=crop&q=60' },
];

const TopListedItems = () => {
    return (
        <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex bg-white rounded-lg border border-gray-100 shadow-xs overflow-hidden flex-col lg:flex-row">
                {/* Left side: Product Grid */}
                <div className="flex-1 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
                            Top Listed Items
                        </h2>
                        <Link href="/main/products" className="text-sm font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1 transition-colors">
                            View All
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        {[0, 1, 2].map((rowIndex) => (
                            <div key={rowIndex} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 ${rowIndex < 2 ? 'pb-6 border-b border-gray-200' : ''}`}>
                                {TOP_PRODUCTS.slice(rowIndex * 3, (rowIndex + 1) * 3).map((product, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        {/* Image Placeholder */}
                                        <div className="relative w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] bg-[#f2f2f2] rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                loading="lazy"
                                                className="object-cover mix-blend-multiply"
                                                sizes="90px"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-col flex-1 border-l-2 border-transparent  pr-2">
                                            {/* Stars */}
                                            <div className="flex items-center gap-[2px] mb-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <svg
                                                        key={s}
                                                        className={`w-3.5 h-3.5 ${s <= product.rating ? 'text-amber-400 fill-current' : 'text-gray-300 stroke-current fill-transparent'}`}
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                                <span className="text-[11px] text-gray-400 ml-1">({product.reviews})</span>
                                            </div>

                                            <h3 className="text-[13px] sm:text-[14px] font-medium text-gray-900 leading-tight mb-2 hover:text-amber-600 transition-colors cursor-pointer tracking-tight">
                                                {product.title}
                                            </h3>

                                            <p className="text-[15px] sm:text-[16px] font-extrabold text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side: Promotional Banner */}
                <div className="lg:w-[320px] bg-[#fde2e4] relative overflow-hidden flex flex-col items-center pt-12">
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

                    {/* Model Image - Bottom Aligned */}
                    <div className="mt-8 relative w-full h-[300px]">
                        <Image
                            src="https://images.unsplash.com/photo-1549066018-0629bcda55bc?w=500&auto=format&fit=crop&q=60"
                            alt="Promo Model"
                            fill
                            loading="lazy"
                            className="object-cover object-top"
                            sizes="320px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopListedItems;
