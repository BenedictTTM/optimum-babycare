'use client';

import React from 'react';

const HeroSlider = () => {
    return (
        <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden bg-white flex items-center">
            {/* 
              Placeholder Image - aligned to the right.
              (Retaining the baby image you requested previously) 
            */}
            <div
                className="absolute right-0 bottom-0 top-0 h-full w-[40%] bg-no-repeat bg-right-bottom bg-contain"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80')",
                    backgroundPosition: 'right center'
                }}
            />

            {/* Text Content */}
            <div className="relative z-10 w-full md:w-[60%] px-6 md:px-12 flex flex-col justify-center text-left">
                <p className="text-sm md:text-base font-medium text-gray-700 tracking-wide mb-3 md:mb-4">
                    Women's Collection
                </p>

                <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-950 leading-tight mb-4">
                    NEW FLORAL TOP
                </h2>

                <p className="text-sm md:text-base text-gray-500 mb-8 max-w-md">
                    Free shipping with our Special Service & not redeemable
                </p>

                <div className="flex items-center">
                    <a href="#collections" className="inline-block font-extrabold uppercase text-sm text-black underline decoration-black underline-offset-4 tracking-wide">
                        View Collections
                    </a>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
                <button className="w-1.5 h-1.5 rounded-full bg-black" aria-label="Slide 1"></button>
                <button className="flex items-center justify-center w-4 h-4 rounded-full border border-black" aria-label="Slide 2">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                </button>
                <button className="w-1.5 h-1.5 rounded-full bg-black" aria-label="Slide 3"></button>
                <button className="w-1.5 h-1.5 rounded-full bg-black" aria-label="Slide 4"></button>
                <button className="w-1.5 h-1.5 rounded-full bg-black" aria-label="Slide 5"></button>
                <button className="w-1.5 h-1.5 rounded-full bg-black" aria-label="Slide 6"></button>
            </div>
        </div>
    );
};

export default HeroSlider;
