'use client';

import React, { useEffect, useState } from 'react';

type Slide = {
    image: string;
    category: string;
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
};

const slides: Slide[] = [
    {
        image: '/baby2.png',
        category: "Baby Essentials",
        title: 'Cozy Cotton Romper',
        description: 'Soft, breathable cotton designed for delicate skin — machine washable and perfect for everyday play.',
        ctaText: 'Shop Rompers',
        ctaHref: '#rompers'
    },
    {
        image: '/baby3.png',
        category: 'New Arrivals',
        title: 'Organic Snuggle Set',
        description: 'Lightweight organic layers that keep baby comfy and stylish — responsibly sourced and GOTS certified.',
        ctaText: 'Browse Sets',
        ctaHref: '#sets'
    }
    ,
    {
        image: '/baby.png',
        category: 'Limited Edition',
        title: 'Hand-knit Baby Blanket',
        description: 'Cozy, hand-knit blanket made with ultra-soft yarn — perfect for swaddles, stroller rides, and gifting.',
        ctaText: 'Shop Blankets',
        ctaHref: '#blankets'
    }
];

const HeroSlider: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState<number | null>(null);
    const [deltaX, setDeltaX] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const threshold = 50; // px needed to trigger slide change

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused]);

    // Handlers for touch and mouse dragging
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || startX === null) return;
        const x = e.touches[0].clientX;
        setDeltaX(x - startX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsPaused(false);
        if (Math.abs(deltaX) > threshold) {
            if (deltaX < 0) setIndex((i) => (i + 1) % slides.length);
            else setIndex((i) => (i - 1 + slides.length) % slides.length);
        }
        setDeltaX(0);
        setStartX(null);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPaused(true);
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || startX === null) return;
        setDeltaX(e.clientX - startX);
    };

    const endDrag = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsPaused(false);
        if (Math.abs(deltaX) > threshold) {
            if (deltaX < 0) setIndex((i) => (i + 1) % slides.length);
            else setIndex((i) => (i - 1 + slides.length) % slides.length);
        }
        setDeltaX(0);
        setStartX(null);
    };

    const current = slides[index];

    const wrapperStyle: React.CSSProperties = {
        transform: `translateX(${deltaX}px)`,
        transition: isDragging ? 'none' : 'transform 300ms ease'
    };

    return (
        <div
            className="relative w-full h-[420px] md:h-[560px] overflow-hidden bg-transparent flex items-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            style={wrapperStyle}
        >
            {/* Background image (right aligned) */}
            <div
                className="absolute right-0 md:right-12 bottom-0 top-0 h-full w-[60%] md:w-[50%] bg-no-repeat bg-right-bottom bg-contain z-0 transition-all duration-700 ease-in-out"
                style={{
                    backgroundImage: `url('${current.image}')`,
                    backgroundPosition: 'right bottom'
                }}
            />

            {/* Text Content */}
            <div className="relative z-10 w-[65%] md:w-[50%] px-4 sm:px-6 md:px-12 flex flex-col justify-center text-left h-full">
                <p className="text-xs md:text-base font-medium text-gray-700 tracking-wide mb-2 md:mb-4">
                    {current.category}
                </p>

                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-950 leading-tight mb-2 md:mb-4 pr-4">
                    {current.title}
                </h2>

                <p className="text-xs md:text-base text-gray-500 mb-6 md:mb-8 max-w-md pr-2">
                    {current.description}
                </p>

                <div className="flex items-center">
                    <a href={current.ctaHref} className="inline-block font-extrabold uppercase text-xs md:text-sm text-black underline decoration-black underline-offset-4 tracking-wide">
                        {current.ctaText}
                    </a>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setIndex(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${idx === index ? 'bg-black' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
