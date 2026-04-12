'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categories as categoriesApi } from '../../../api/clients';

interface Category {
    id: number;
    name: string;
    description: string | null;
}

const CategoryShop = () => {
    const mobileRef = useRef<HTMLDivElement | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesApi.getAll();
                // Depending on API response structure, we use data directly if it is an array
                setCategories(Array.isArray(data) ? data : data.data || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const scrollBy = (dir: 'next' | 'prev') => {
        const el = mobileRef.current;
        if (!el) return;
        const amount = Math.floor(el.clientWidth * 0.9);
        el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
    };

    const renderCard = (cat: Category, index: number, extraClasses = '') => (
        <div key={index} className={`bg-white rounded-xl p-5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 w-[300px] sm:w-[360px] md:w-[420px] lg:w-[480px] h-[260px] md:h-[200px] ${extraClasses}`}>
            <h3 className="md:text-xl text-md font-bold text-[#1a1a2e] tracking-widest uppercase mb-2">
                {cat.name}
            </h3>

            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#F5A623]/60 to-transparent mb-3" />

            <p className="text-gray-500 text-[14px] leading-relaxed mb-4 flex-1 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                {cat.description || `Explore our ${cat.name} collection featuring exclusive items.`}
            </p>

            <Link href={`/main/products/categories?category=${cat.id}`} className="mt-auto inline-block w-full py-2.5 border border-[#F5A623] text-amber-600 hover:bg-amber-100 rounded-md transition-colors text-sm tracking-widest uppercase font-thin text-center">
                VIEW COLLECTION
            </Link>
        </div>
    );

    return (
        <section className="w-full bg-gray-50  px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Header with Nav Controls */}
                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#F5A623]">
                                <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-[#F5A623] font-semibold text-sm">Categories</span>
                            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#F5A623]">
                                <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="md:text-4xl text-xl text-[#1a1a2e] tracking-widest uppercase font-bold">
                            OUR COLLECTIONS
                        </h2>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5A623]"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No categories found.</div>
                ) : (
                    <>
                        {/* Scrollable slider for all screens */}
                        <div className="relative  md:mb-6  group">
                            <div
                                ref={mobileRef}
                                className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 touch-pan-x scroll-pl-4 hide-scrollbar" 
                                style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {categories.map((cat, index) => renderCard(cat, index, 'min-w-[85%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%] snap-center shrink-0 transition-transform duration-300 hover:scale-[1.02]'))}
                            </div>

                            {categories.length > 1 && (
                                <div className="absolute right-4 -top-12 flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                    <button aria-label="Previous category" onClick={() => scrollBy('prev')} className="w-10 h-10 rounded-full  border border-gray-200 text-gray-600 hover:text-[#F5A623] hover:border-[#F5A623] shadow-xs flex items-center justify-center transition-colors">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    </button>
                                    <button aria-label="Next category" onClick={() => scrollBy('next')} className="w-10 h-10 rounded-full  border border-gray-200 text-gray-600 hover:text-[#F5A623] hover:border-[#F5A623] shadow-xs flex items-center justify-center transition-colors">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default CategoryShop;
