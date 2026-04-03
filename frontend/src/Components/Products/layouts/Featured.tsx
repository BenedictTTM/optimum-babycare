'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { categoryService, Category } from '@/app/accounts/addCategories/lib/categoryService';

/* ── static hero images per category (cycled if more categories exist) ── */
const CATEGORY_IMAGES = [
    'https://images.unsplash.com/photo-1584515933487-779824d29309',
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d6',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1',
    'https://images.unsplash.com/photo-1609220136736-443140cffec6',
    'https://images.unsplash.com/photo-1583947582886-f40ec95dd752',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e',
    'https://images.unsplash.com/photo-1609220136890-7c57f7f0e0e3',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
];

export default function Featured() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await categoryService.fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to load categories', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ── skeleton ── */
    if (loading) {
        return (
            <section className="w-full py-12 sm:py-16">
                <div className="text-center mb-8">
                    <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
                    <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
                <div className="flex gap-5 px-6 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-shrink-0 w-[260px]">
                            <div className="h-[320px] bg-gray-100 rounded-2xl animate-pulse" />
                            <div className="mt-4 space-y-2">
                                <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                                <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full py-10 sm:py-14 overflow-hidden">
            {/* ── Header ── */}
            <div className="text-center mb-8 sm:mb-10 px-4">
                {/* Decorative label */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
                        <path d="M1 4c3-3 6 3 9 0s6 3 9 0s6 3 9 0" stroke="#c8956c" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm sm:text-base tracking-widest text-amber-700 uppercase font-medium">
                        Featured
                    </span>
                    <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
                        <path d="M1 4c3-3 6 3 9 0s6 3 9 0s6 3 9 0" stroke="#c8956c" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
                    Explore Our Collections
                </h2>
            </div>

            {/* ── Scrollable cards row ── */}
            <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-10 pb-2 snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {categories.map((cat, idx) => {
                    const imgSrc = CATEGORY_IMAGES[idx % CATEGORY_IMAGES.length];
                    const itemCount = cat._count?.products ?? 0;

                    return (
                        <div
                            key={cat.id}
                            className="flex-shrink-0 w-[220px] sm:w-[250px] md:w-[270px] snap-start"
                        >
                            {/* Image card */}
                            <Link href={`/main/products/categories?category=${cat.id}`}>
                                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#f0eeeb] group">
                                    <Image
                                        src={imgSrc}
                                        alt={cat.name}
                                        fill
                                        unoptimized
                                        loading="lazy"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="270px"
                                    />

                                    {/* Item count badge */}
                                    <div className="absolute bottom-3 left-3 z-10">
                                        <span className="inline-flex items-center gap-1 bg-amber-600/90 text-white text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                                            {itemCount} items
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* Info below image */}
                            <div className="mt-3.5 px-0.5">
                                <h3 className="text-[15px] sm:text-base font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                                    {cat.name}
                                </h3>

                                <ul className="space-y-0.5 mb-3">
                                    <li className="flex items-start gap-1.5 text-[12px] sm:text-[13px] text-gray-500">
                                        <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                        Save 20% on order more than GH₵250
                                    </li>
                                    <li className="flex items-start gap-1.5 text-[12px] sm:text-[13px] text-gray-500">
                                        <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                        Delivery in 2 days
                                    </li>
                                </ul>

                                <Link
                                    href={`/main/products/categories?category=${cat.id}`}
                                    className="inline-flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 text-[13px] sm:text-sm font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
