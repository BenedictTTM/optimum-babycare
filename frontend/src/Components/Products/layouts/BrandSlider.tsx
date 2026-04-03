'use client';

import React from 'react';
// using native <img> for remote logos to avoid requiring next.config change

const BRANDS = [
    { name: "ALLURE", svg: `
        <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ALLURE">
            <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="currentColor" font-weight="700">ALLURE</text>
        </svg>
    ` },
    { name: "BUSTLE", svg: `
        <svg viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BUSTLE">
            <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="currentColor" font-weight="700">BUSTLE</text>
        </svg>
    ` },
    { name: "BAZAAR", svg: `
        <svg viewBox="0 0 260 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BAZAAR">
            <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="currentColor" font-weight="700">BAZAAR</text>
        </svg>
    ` },
    { name: "GOOP", svg: `
        <svg viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GOOP">
            <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="currentColor" font-weight="700">GOOP</text>
        </svg>
    ` },
    { name: "BRIT+CO", svg: `
        <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BRIT+CO">
            <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="currentColor" font-weight="700">BRIT+CO</text>
        </svg>
    ` },
    { name: "THE COVETEUR", svg: `
        <svg viewBox="0 0 320 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="THE COVETEUR">
            <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="currentColor" font-weight="700">THE COVETEUR</text>
        </svg>
    ` }
];

const BrandSlider = () => {
    return (
        <section className="w-full relative h-[120px] sm:h-[180px] bg-red-800 overflow-hidden my-12">
            {/* Background Texture/Overlay for Red Bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#991b1b] to-[#b91c1c] mix-blend-multiply opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-10 bg-repeat mix-blend-overlay" />

            <div className="absolute inset-0 flex items-center justify-center max-w-[1400px] mx-auto px-4 overflow-x-auto no-scrollbar whitespace-nowrap z-10 text-white">
                <div className="flex gap-8 md:gap-12 items-center animate-scroll">
                    {BRANDS.map((brand, index) => (
                        <div key={index} className="flex items-center justify-center shrink-0 px-6 logo-svg" aria-hidden={false}>
                            <div dangerouslySetInnerHTML={{ __html: brand.svg }} />
                            <span className="sr-only">{brand.name}</span>
                        </div>
                    ))}
                    {/* Duplicate loop to allow continuous scrolling effect */}
                    {BRANDS.map((brand, index) => (
                        <div key={`dup-${index}`} className="flex items-center justify-center shrink-0 px-6 logo-svg" aria-hidden={false}>
                            <div dangerouslySetInnerHTML={{ __html: brand.svg }} />
                            <span className="sr-only">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                /* mask removed to ensure logos are visible */
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 28s linear infinite;
                    will-change: transform;
                }
                .logo-svg svg {
                    height: 28px;
                    width: auto;
                    display: block;
                    color: #ffffff; /* uses currentColor in SVG */
                }
                @media (min-width: 640px) {
                    .logo-svg svg { height: 32px; }
                }
                @media (min-width: 768px) {
                    .logo-svg svg { height: 44px; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-scroll { animation-play-state: paused; }
                }
            `}</style>
        </section>
    );
};

export default BrandSlider;