'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
    {
        title: 'SALES',
        subtitle: 'Sales',
        description: 'Curated sale items with limited time offers. Discover discounted favorites across categories.',
    },
    {
        title: 'CASUAL',
        subtitle: 'Casual',
        description: 'Relax in style with our Casual Collection, featuring comfortable yet trendy pieces.',
    },
    {
        title: 'MATERNITY',
        subtitle: 'Maternity',
        description: 'Celebrate motherhood with our Maternity Collection, offering stylish and comfortable essentials.',
    },
    {
        title: 'TIMELESS',
        subtitle: 'Timeless',
        description: 'Classic staples that never go out of style — explore the essentials for every wardrobe.',
    }
];

const CategoryShop = () => {
    const mobileRef = useRef<HTMLDivElement | null>(null);

    const scrollBy = (dir: 'next' | 'prev') => {
        const el = mobileRef.current;
        if (!el) return;
        const amount = Math.floor(el.clientWidth * 0.9);
        el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
    };

    const renderCard = (cat: typeof CATEGORIES[number], index: number, extraClasses = '') => (
        <div key={index} className={`bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 ${extraClasses}`}>
            <h3 className="text-2xl font-serif text-[#0a192f] tracking-widest uppercase mb-4">
                {cat.title}
            </h3>

            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#b89474]/60 to-transparent mb-5" />

            <p className="text-gray-600 text-[14px] leading-relaxed mb-8 flex-1">
                {cat.title === 'SALES' ? cat.subtitle : cat.description}
            </p>

            <Link href="/main/products" className="mt-auto inline-block w-full py-2.5 border border-[#b89474] text-[#b89474] hover:bg-[#b89474] hover:text-white rounded-md transition-colors text-sm tracking-widest uppercase font-serif text-center">
                VIEW COLLECTION
            </Link>
        </div>
    );

    return (
        <section className="w-full bg-gray-50 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Header with Nav Controls */}
                <div className="flex items-center justify-center mb-16">
                    <div className="text-center">
                         <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#FF4A3B] font-medium text-sm">Categories</span>
                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                        <h2 className="text-4xl text-[#0a192f] tracking-widest uppercase font-serif">
                           OUR COLLECTIONS
                        </h2>
                    </div>
                </div>

                {/* Mobile slider: visible on small screens only */}
                <div className="md:hidden relative mb-6">
                    <div
                            ref={mobileRef}
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-2 touch-pan-x scroll-pl-4" style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            {CATEGORIES.map((cat, index) => renderCard(cat, index, 'min-w-[90%] snap-center'))}
                        </div>

                    <div className="absolute right-3 top-3 flex items-center gap-2">
                        <button aria-label="Previous category" onClick={() => scrollBy('prev')} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                            ‹
                        </button>
                        <button aria-label="Next category" onClick={() => scrollBy('next')} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                            ›
                        </button>
                    </div>
                </div>

                {/* Desktop grid: hidden on small screens */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, index) => renderCard(cat, index))}
                </div>
            </div>
        </section>
    );
};

export default CategoryShop;
