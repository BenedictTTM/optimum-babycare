'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/api/clients';
import BlogCard from '@/app/accounts/blog/Components/BlogCard';

export default function BlogInsights() {
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        const w = el.clientWidth;
        const idx = Math.round(el.scrollLeft / w);
        setActiveIndex(idx);
    };

    const scrollToIndex = (i: number) => {
        const el = carouselRef.current;
        if (!el) return;
        el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get('/blog?limit=3');
                setPosts(response.data?.data || response.data || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        const onResize = () => scrollToIndex(activeIndex);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [activeIndex]);

    return (
        <section className="w-full py-3 text-left max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#FF4A3B] font-medium text-sm">News & Articles</span>
                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-wider uppercase">
                    Blog & Insights
                </h2>
            </div>

            <div className="relative">
                {/* Prev/Next buttons (mobile only) */}
                <div className="absolute inset-y-0 left-2 flex items-center z-20 md:hidden">
                    <button
                        onClick={() => {
                            if (!carouselRef.current) return;
                            const w = carouselRef.current.clientWidth;
                            carouselRef.current.scrollBy({ left: -w, behavior: 'smooth' });
                        }}
                        aria-label="Previous"
                        className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow"
                    >
                        <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="absolute inset-y-0 right-2 flex items-center z-20 md:hidden">
                    <button
                        onClick={() => {
                            if (!carouselRef.current) return;
                            const w = carouselRef.current.clientWidth;
                            carouselRef.current.scrollBy({ left: w, behavior: 'smooth' });
                        }}
                        aria-label="Next"
                        className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow"
                    >
                        <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="none">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div
                    ref={carouselRef}
                    className={`flex md:grid md:grid-cols-2 ${posts.length === 0 ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
                    onScroll={handleScroll}
                >
                    {isLoading ? (
                        <div className="md:col-span-3 py-10 text-center text-gray-500 w-full">Loading insights...</div>
                    ) : posts.length === 0 ? (
                        <div className="md:col-span-3 py-10 text-center text-gray-500 w-full">No posts found.</div>
                    ) : (
                        posts.map((post, index) => (
                            <div
                                key={post.id || index}
                                data-index={index}
                                className="snap-start shrink-0 w-full md:w-auto md:shrink"
                            >
                                <BlogCard
                                    title={post.title}
                                    excerpt={post.content ? (post.content.substring(0, 100) + '...') : ''}
                                    content={post.content}
                                    imageUrl={post.coverImage || post.coverImageUrl}
                                    author={post.author?.firstName ? `${post.author.firstName} ${post.author.lastName || ''}` : 'Admin'}
                                    date={new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    tags={post.category ? [post.category] : []}
                                    status={post.status?.toLowerCase() || 'published'}
                                    disablePreview={true}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Dot indicators (mobile only) */}
                {posts.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-4 md:hidden z-20">
                        {posts.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`w-2.5 h-2.5 rounded-full ${i === activeIndex ? 'bg-gray-800' : 'bg-gray-300'} transition-colors`}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <div className="text-center mt-10">
                <Link href="/blog" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-sm text-[#FF4A3B] bg-white hover:bg-gray-50 transition-colors shadow-sm">
                    View All Articles
                </Link>
            </div>
        </section>
    );
}