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
        <section className="w-full bg-[#1a1a1a] relative min-h-[400px] flex items-center overflow-hidden">
            {/* Background with texture/overlay potentially */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12 py-12 md:py-0">

                {/* Left Card: Featured Product */}
                <div className="relative z-10 w-full md:w-[350px] lg:w-[400px] flex-shrink-0 animate-in fade-in slide-in-from-left duration-700">
                    <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
                        <div className="relative w-full aspect-square mb-6 bg-neutral-50 rounded-lg overflow-hidden group">
                            <Image
                                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60"
                                alt="Roland Grand White"
                                fill
                                loading="lazy"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-gray-100 italic">
                                New
                            </div>
                        </div>
                        <div className="w-full text-left">
                            <h4 className="text-gray-500 text-[11px] font-bold mb-1 uppercase tracking-widest">The Organic Cotton Cutaway Tank</h4>
                            <p className="text-gray-900 font-extrabold text-lg">$21.00</p>
                        </div>
                    </div>
                </div>

                {/* Right Content: Details & Countdown */}
                <div className="relative z-10 flex-1 text-white text-center md:text-left space-y-6">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="w-8 h-[2px] bg-red-500" />
                        <span className="text-[12px] font-bold tracking-[0.2em] text-red-500 uppercase">Deal Of The Week</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                        Roland Grand White <br className="hidden lg:block" /> short T-shirt
                    </h2>

                    <p className="text-gray-400 text-sm sm:text-base max-w-lg leading-relaxed">
                        Our intent and our actions have always been informed by progress. We look at an impact report as a way to measure.
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 pt-4">
                        {[
                            { label: 'D', value: timeLeft.days },
                            { label: 'H', value: timeLeft.hours },
                            { label: 'M', value: timeLeft.minutes },
                            { label: 'S', value: timeLeft.seconds }
                        ].map((unit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gray-700 flex items-center justify-center mb-2 bg-white/5 backdrop-blur-sm">
                                    <span className="text-xl sm:text-2xl font-extrabold tracking-tighter">{unit.value.toString().padStart(2, '0')}</span>
                                    <span className="text-[10px] ml-0.5 font-bold text-gray-500">{unit.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Limited Offer Notice */}
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-8 p-3 rounded-lg border border-white/10 bg-white/5 max-w-sm">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-[11px] sm:text-[12px] font-bold text-gray-300">
                            Limited time offer. The deal will expires <br />
                            on November 12, 2026 <span className="text-red-500 ml-1">HURRY UP!</span>
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DealOfWeek;
