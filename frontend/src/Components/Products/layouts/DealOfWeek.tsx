'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const DealOfWeek = () => {
    // Countdown logic
    const [timeLeft, setTimeLeft] = useState({
        days: 180,
        hours: 9,
        minutes: 9,
        seconds: 34
    });

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

    return (
        <section className="w-full relative min-h-[480px] overflow-hidden">
            {/* Hero background image (left) */}
            <div className="absolute inset-0 hidden lg:block">
                <div
                    className="absolute inset-0 bg-cover bg-left"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&auto=format&fit=crop&q=60')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-stretch py-20 relative">

                {/* Small product card positioned over the hero (left) */}
                <div className="hidden lg:block absolute left-20 top-12 z-20">
                    <div className="bg-white rounded-lg shadow-2xl w-[240px] overflow-hidden">
                        <div className="relative w-full h-48 bg-neutral-50">
                            <Image
                                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60"
                                alt="Promo"
                                fill
                                loading="lazy"
                                className="object-contain p-6"
                            />
                        </div>
                        <div className="p-4 border-t">
                            <h4 className="text-xs text-gray-500">The Organic Cotton Cutaway Tank</h4>
                            <p className="text-lg font-extrabold text-gray-900">$21.00</p>
                        </div>
                    </div>
                </div>

                {/* Right content card */}
                <div className="ml-auto w-full max-w-2xl bg-white p-10 rounded-md shadow-lg relative z-30">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-[2px] bg-red-500 inline-block" />
                        <span className="text-[12px] font-bold tracking-[0.2em] text-red-500 uppercase">Deal Of The Week</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
                        Roland Grand White <br className="hidden lg:block" /> short T-shirt
                    </h2>

                    <p className="text-gray-600 text-sm sm:text-base max-w-lg leading-relaxed mb-6">
                        Our intent and our actions have always been informed by progress. We look at an impact report as a way to measure.
                    </p>

                    {/* Countdown as rounded boxes */}
                    <div className="flex items-center gap-3 mb-6">
                        {[
                            { label: 'D', value: timeLeft.days },
                            { label: 'H', value: timeLeft.hours },
                            { label: 'M', value: timeLeft.minutes },
                            { label: 'S', value: timeLeft.seconds }
                        ].map((unit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="px-4 py-2 bg-gray-100 rounded-md shadow-sm text-center min-w-[64px]">
                                    <div className="text-lg font-extrabold text-gray-900">{unit.value.toString().padStart(2, '0')}</div>
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
