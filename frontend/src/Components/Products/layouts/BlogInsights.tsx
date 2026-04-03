'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BLOG_POSTS = [
    {
        title: "ONCE THAT'S DETERMINED WITH A GOOD, YOU NEED TO COME UP WITH A NAME",
        category: "FASHION",
        date: "25",
        month: "Jul",
        author: "PARV INFOTECH",
        authorRole: "Author",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        authorImage: "https://ui-avatars.com/api/?name=PI&background=0D8ABC&color=fff"
    },
    {
        title: "ONCE DETERMINED, YOU NEED TO COME UP WITH A NAME A LEGAL STRUCTURE",
        category: "TRENDING",
        date: "25",
        month: "Jul",
        author: "PARV INFOTECH",
        authorRole: "Author",
        image: "https://images.unsplash.com/photo-1550614000-4b95d4ebf071?q=80&w=600&auto=format&fit=crop",
        authorImage: "https://ui-avatars.com/api/?name=PI&background=0D8ABC&color=fff"
    },
    {
        title: "AT THE LIMIT, STATICALLY GENERATED, EDGE DELIVERED A FOOD",
        category: "DESIGN",
        date: "25",
        month: "Jul",
        author: "PARV INFOTECH",
        authorRole: "Author",
        image: "https://images.unsplash.com/photo-1485230895905-31d414dc14fd?q=80&w=600&auto=format&fit=crop",
        authorImage: "https://ui-avatars.com/api/?name=PI&background=0D8ABC&color=fff"
    }
];

const BlogInsights = () => {
    return (
        <section className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
            <div className="mb-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#FF4A3B] font-medium text-sm">News</span>
                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-wider uppercase">
                    Blog & Insights
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.map((post, index) => (
                    <article key={index} className="bg-white group cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        {/* Image Container with Date Badge */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Date Badge */}
                            <div className="absolute bottom-[-20px] right-6 bg-white px-4 py-2 shadow-md flex flex-col items-center justify-center z-10 w-16">
                                <span className="text-xl font-bold text-gray-900 leading-none">{post.date}</span>
                                <span className="text-xs text-gray-500 font-medium uppercase mt-1">{post.month}</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 pt-10">
                            <p className="text-[#FF4A3B] text-[11px] font-bold tracking-wider uppercase mb-3">
                                {post.category}
                            </p>
                            <h3 className="text-[14px] leading-relaxed font-extrabold text-gray-900 mb-6 group-hover:text-[#FF4A3B] transition-colors line-clamp-3">
                                {post.title}
                            </h3>

                            {/* Author Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 line">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                    <Image
                                        src={post.authorImage}
                                        alt={post.author}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-gray-900">{post.author}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">{post.authorRole}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default BlogInsights;