'use client';

import React from 'react';
import Image from 'next/image';

const OFFERS = [
    {
        category: "FOR WOMEN'S",
        items: 20,
        discount: "Save 20% on order more than $250",
        delivery: "Delivery in 2 days",
        image: "https://images.unsplash.com/photo-1549066018-0629bcda55bc?w=500&auto=format&fit=crop&q=60"
    },
    {
        category: "FOR MEN'S",
        items: 20,
        discount: "Save 20% on order more than $250",
        delivery: "Delivery in 2 days",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60"
    },
    {
        category: "FOR KID'S",
        items: 20,
        discount: "Save 20% on order more than $250",
        delivery: "Delivery in 2 days",
        image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=500&auto=format&fit=crop&q=60"
    },
    {
        category: "ACCESORIES",
        items: 20,
        discount: "Save 20% on order more than $250",
        delivery: "Delivery in 2 days",
        image: "https://images.unsplash.com/photo-1576243352940-f7404a4ad258?w=500&auto=format&fit=crop&q=60"
    }
];

const OfferBanners = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {OFFERS.map((offer, index) => (
                <div key={index} className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                    {/* Image Area - Gray background */}
                    <div className="relative aspect-[4/5] bg-neutral-50 p-0">
                        <Image
                            src={offer.image}
                            alt={offer.category}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {/* Badge - overlaps the content area slightly */}
                        <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-10">
                            <span className="text-[11px] font-bold text-gray-900 leading-none">
                                <span className="text-gray-900 font-extrabold mr-1">{offer.items}</span>
                                <span className="text-gray-500 font-medium lowercase">items</span>
                            </span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col items-start space-y-3">
                        <h3 className="text-[15px] font-extrabold text-gray-900 tracking-wide">
                            {offer.category}
                        </h3>

                        {/* Feature Checklist */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium">
                                    {offer.discount}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium">
                                    {offer.delivery}
                                </span>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <button className="w-full mt-2 text-center text-[13px] font-bold text-gray-900 py-3 border-t border-gray-100 hover:text-amber-600 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OfferBanners;
