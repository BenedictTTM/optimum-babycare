'use client';

import React from 'react';

const HeroSlider = () => {
    return (
        <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden rounded-md bg-[#FFF5E9] flex items-center">
            {/* 
              Placeholder Image - aligned to the right.
              (Retaining the baby image you requested previously) 
            */}
            <div
                className="absolute right-0 bottom-0 h-[100%] w-[60%] md:w-[50%] bg-no-repeat bg-right-bottom bg-contain"
                style={{
                    backgroundImage: "url('https://plus.unsplash.com/premium_photo-1701984401514-a32a73eac549?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmFieSUyMHByb2R1Y3RzfGVufDB8MXwwfHx8MA%3D%3D')"
                }}
            />

            {/* Text Content */}
            <div className="relative z-10 w-full px-8 md:px-16 flex flex-col justify-center text-left max-w-[65%]">
                <p className="text-sm md:text-base font-medium text-gray-700 tracking-wide mb-3 md:mb-4">
                    Women's Collection
                </p>

                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-tight mb-4">
                    NEW FLORAL DRESS
                </h2>

                <p className="text-xs md:text-sm text-gray-500 mb-8 max-w-sm">
                    Free shipping with our Special Service & not redeemable
                </p>

                <div className="flex items-center">
                    <button className="text-black font-extrabold tracking-widest uppercase text-sm border-b-2 border-black pb-1 hover:text-amber-500 hover:border-amber-500 transition-colors">
                        View Collection
                    </button>
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
