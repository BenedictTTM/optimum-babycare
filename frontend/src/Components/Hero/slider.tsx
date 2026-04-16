'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

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
    },
    {
        image: '/baby.png',
        category: 'Limited Edition',
        title: 'Hand-knit Baby Blanket',
        description: 'Cozy, hand-knit blanket made with ultra-soft yarn — perfect for swaddles, stroller rides, and gifting.',
        ctaText: 'Shop Blankets',
        ctaHref: '#blankets'
    }
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        scale: 0.95,
        opacity: 0,
        zIndex: 10,
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.18))',
    }),
    center: {
        x: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
    },
    exit: {
        x: 0,
        scale: 0.85,
        opacity: 0,
        zIndex: 0,
        filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
    },
};

const transitionConfig = {
    duration: 0.8,
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

const HeroSlider: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState<number | null>(null);
    const [deltaX, setDeltaX] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const threshold = 50;

    const paginate = useCallback((dir: number) => {
        setDirection(dir);
        setIndex((i) => (i + dir + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused, paginate]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || startX === null) return;
        setDeltaX(e.touches[0].clientX - startX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsPaused(false);
        if (Math.abs(deltaX) > threshold) {
            paginate(deltaX < 0 ? 1 : -1);
        }
        setDeltaX(0);
        setStartX(null);
    };

    // Mouse handlers
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
            paginate(deltaX < 0 ? 1 : -1);
        }
        setDeltaX(0);
        setStartX(null);
    };

    const current = slides[index];

    return (
        <div
            className="relative w-full h-[360px] md:h-full bg-transparent flex flex-col md:flex-row items-center"
            style={{ overflow: 'hidden', perspective: '1000px' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transitionConfig}
                    className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center"
                >
                    {/* Background image (right aligned) — Next.js Image for WebP/AVIF + preload */}
                    <div className="relative md:absolute md:right-12 md:bottom-0 md:top-0 h-64 md:h-full w-full md:w-[60%] z-0 flex-shrink-0 flex items-center justify-center">
                        <Image
                            src={current.image}
                            alt={current.title}
                            fill
                            sizes="(max-width: 768px) 60vw, 50vw"
                            priority={index === 0}
                            className="object-contain object-center md:object-right"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 w-full md:w-[50%] px-4 sm:px-6 md:px-12 flex flex-col justify-center items-center md:items-start text-center md:text-left h-full">
                        <p className="text-xs md:text-base font-medium text-gray-700 tracking-wide mb-3 md:mb-4">
                            {current.category}
                        </p>

                        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-950 leading-tight mb-3 md:mb-4 md:pr-4">
                            {current.title}
                        </h2>

                        <p className="text-xs md:text-base text-gray-500 mb-6 md:mb-8 max-w-lg md:pr-2">
                            {current.description}
                        </p>

                        <div className="flex items-center justify-center md:justify-start mt-2">
                            <a href={current.ctaHref} className="inline-block font-extrabold uppercase text-xs md:text-sm text-black underline decoration-black underline-offset-4 tracking-wide">
                                {current.ctaText}
                            </a>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute top-6 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > index ? 1 : -1);
                            setIndex(idx);
                        }}
                        aria-label={`Slide ${idx + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${idx === index ? 'bg-black' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
