'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { products } from '@/api/clients';

const DealOfWeek = () => {
    // Product data state
    const [dealProduct, setDealProduct] = useState<any>(null);

    // Countdown logic
    const [timeLeft, setTimeLeft] = useState({
        days: 180,
        hours: 9,
        minutes: 9,
        seconds: 34
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch first product for the Deal of the week
                const data = await products.getAll(1, 1);
                // Handle different common pagination responses
                const firstProduct = Array.isArray(data) ? data[0] : (data?.data?.[0] || data?.items?.[0] || null);
                if (firstProduct) {
                    setDealProduct(firstProduct);
                }
            } catch (error) {
                console.error("Failed to fetch deal of the week product:", error);
            }
        };
        fetchProduct();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!dealProduct) return null;

    return (
        <section className="w-full relative overflow-hidden">
            {/* Hero background image (left) - hidden on smaller screens */}
            <div className="absolute inset-0 hidden lg:block">
                <div
                    className="absolute inset-0 bg-cover bg-left"
                    style={{ backgroundImage: "url('/shop.png')", backgroundPosition: 'center bottom', backgroundSize: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto lg:px-8 w-full flex flex-col lg:flex-row items-center lg:items-stretch py-12 lg:py-20 relative">

                {/* Desktop absolute product card (kept) - mobile snapshot will be embedded inside the Deal card */}

                <div className="hidden lg:block absolute left-20 top-12 z-20">
                    <div className="bg-white rounded-lg shadow-xs w-[240px] overflow-hidden">
                        <div className="relative w-full h-48 bg-neutral-50">
                            <Image
                                src={dealProduct.imageUrl?.[0] ||  dealProduct.images?.[0] || '/placeholder-product.jpg'}
                                alt={dealProduct.title || "Promo"}
                                fill
                                loading="lazy"
                                className="object-contain p-6"
                            />
                        </div>
                        <div className="p-4 border-t">
                            <h4 className="text-xs text-gray-500 truncate" title={dealProduct.title}>
                                {dealProduct.title}
                            </h4>
                            <p className="text-lg font-extrabold text-gray-900">${dealProduct.discountedPrice || dealProduct.originalPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Right content card */}
                <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-md shadow-sm relative z-30 mx-auto lg:mx-0 lg:ml-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <span className=" sm:w-3 md:w-8 md:h-[2px] bg-red-500 inline-block" />
                        <span className="text-md md:text-lg font-bold tracking-[0.2em] text-red-500 uppercase">Deal Of The Week</span>
                    </div>

                    {/* Mobile: small product snapshot inside the deal card */}
                    <div className="flex items-center gap-4 mb-4 lg:hidden">
                        <div className="relative w-16 h-16 rounded-sm overflow-hidden ">
                            <Image
                                src={dealProduct.imageUrl?.[0] }
                                alt={dealProduct.title || "Promo"}
                                fill
                                loading="lazy"
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]" title={dealProduct.title}>
                                {dealProduct.title}
                            </div>
                            <div className="text-sm text-gray-500 font-bold">${dealProduct.discountedPrice || dealProduct.originalPrice}</div>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base max-w-lg leading-relaxed mb-6 line-clamp-3">
                        {dealProduct.description}
                    </p>

                    {/* Countdown as rounded boxes */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {[
                            { label: 'D', value: timeLeft.days },
                            { label: 'H', value: timeLeft.hours },
                            { label: 'M', value: timeLeft.minutes },
                            { label: 'S', value: timeLeft.seconds }
                        ].map((unit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="px-3 sm:px-4 py-2 bg-gray-100 rounded-md shadow-sm text-center min-w-[52px] sm:min-w-[64px]">
                                    <div className="text-lg sm:text-xl font-extrabold text-gray-900">{unit.value.toString().padStart(2, '0')}</div>
                                    <div className="text-[10px] text-gray-500 font-bold mt-1">{unit.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Limited Offer Notice */}
                    <div className="flex items-start gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[13px] text-gray-700">
                                Limited time offer. The deal will expires on <span className="font-bold">November 12, 2026</span>
                                <span className="text-red-500 font-extrabold ml-2">HURRY UP!</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DealOfWeek;
