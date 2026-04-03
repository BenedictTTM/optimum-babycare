'use client';

import React from 'react';
import Image from 'next/image';

const BRANDS = [
    { name: "allure", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Allure_logo.svg/200px-Allure_logo.svg.png" },
    { name: "BUSTLE", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Bustle_logo.svg/200px-Bustle_logo.svg.png" },
    { name: "BAZAAR", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Harper%27s_Bazaar_logo.svg/200px-Harper%27s_Bazaar_logo.svg.png" },
    { name: "goop", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Goop_logo.svg/100px-Goop_logo.svg.png" },
    { name: "BRIT+CO", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Brit_%2B_Co.logo.png/100px-Brit_%2B_Co.logo.png" },
    { name: "THE COVETEUR", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coveteur_logo.svg/150px-Coveteur_logo.svg.png" }
];

const BrandSlider = () => {
    return (
        <section className="w-full relative h-[120px] sm:h-[180px] bg-red-800 overflow-hidden my-12">
            {/* Background Texture/Overlay for Red Bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#991b1b] to-[#b91c1c] mix-blend-multiply opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-10 bg-repeat mix-blend-overlay" />

            <div className="absolute inset-0 flex items-center justify-center max-w-[1400px] mx-auto px-4 overflow-x-auto no-scrollbar mask-edges whitespace-nowrap">
                <div className="flex gap-16 md:gap-24 opacity-80 mix-blend-luminosity brightness-0 invert items-center animate-scroll">
                    {BRANDS.map((brand, index) => (
                        <div key={index} className="relative h-6 md:h-10 shrink-0 min-w-[100px]">
                            {/* Fallback to text if images are restricted */}
                            <span className="text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-widest uppercase truncate ml-8 mr-8">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                    {/* Duplicate loop to allow continuous scrolling effect */}
                    {BRANDS.map((brand, index) => (
                        <div key={`dup-${index}`} className="relative h-6 md:h-10 shrink-0 min-w-[100px]">
                            <span className="text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-widest uppercase truncate ml-8 mr-8">
                                {brand.name}
                            </span>
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
                .mask-edges {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default BrandSlider;