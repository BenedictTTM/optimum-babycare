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
                <div key={index} className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow h-full">
                    {/* Image Area - Gray background */}
                    <div className="relative aspect-[4/5] bg-neutral-50 p-0 overflow-visible">
                        <Image
                            src={offer.image}
                            alt={offer.category}
                            fill
                            className="object-cover"
                            sizes="(max-width: 660px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {/* Badge - overlaps the content area slightly */}
                        <div className="absolute -bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-20">
                            <span className="text-[11px] font-bold text-gray-900 leading-none flex items-center">
                                <span className="text-gray-900 font-extrabold mr-1 text-[12px]">{offer.items}</span>
                                <span className="text-gray-500 font-medium lowercase text-[11px]">items</span>
                            </span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-3 flex-1 flex flex-col justify-between pt-8">
                        <div>
                            <h3 className="text-[15px] sm:text-[16px] font-extrabold text-gray-900 tracking-wide mb-3">
                                {offer.category}
                            </h3>

                            {/* Feature Checklist */}
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <svg className="w-4 h-4 mt-0.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                                        {offer.discount}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-4 h-4 mt-0.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                                        {offer.delivery}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <div className="w-full flex justify-center">
                            <button className="w-56 sm:w-64 bg-white text-[13px] font-bold text-gray-900 py-3 rounded-md shadow-xs border border-gray-100 hover:shadow-sm transition-all">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OfferBanners;
