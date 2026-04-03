'use client';

import React from 'react';

const DiscountBar = () => {
    return (
        <div className="w-full bg-[#f5f5f5] py-3 px-4 border-b border-gray-100 flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3 text-center">
                <p className="text-[11px] sm:text-[12px] font-medium text-gray-600 tracking-wide uppercase">
                    Super discount for your 100$ purchase. Use this code
                    <span className="font-extrabold text-gray-900 ml-1 underline decoration-red-500 decoration-2 underline-offset-4">OFFER100</span>
                </p>
            </div>
        </div>
    );
};

export default DiscountBar;
