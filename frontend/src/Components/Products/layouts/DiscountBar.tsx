'use client';

import React from 'react';

const DiscountBar = () => {
    return (
        <div className="w-full bg-[#f5f5f5] py-[10px] px-4 flex items-center justify-center relative overflow-hidden">
            {/* Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }}
            />
            <div className="flex items-center gap-2 sm:gap-3 text-center relative z-10 w-full max-w-[1200px] bg-[#f8f8f8] border border-gray-100/50 shadow-sm rounded-lg py-3 justify-center"
                 style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd' stroke='%23000000' stroke-width='1' stroke-opacity='0.05'%3E%3Cpath d='M10 10 L20 10 L20 20 L10 20 Z M40 10 L50 20 M15 40 A5 5 0 1 1 15 50 A5 5 0 1 1 15 40 M45 40 A3 3 0 1 1 45 46 A3 3 0 1 1 45 40 M40 50 L50 40' /%3E%3C/g%3E%3C/svg%3E")`,
                 }}
            >
                <p className="text-[9px] sm:text-[11px] font-medium text-black tracking-wide">
                    Super discount for your 100$ purchase. Use this code
                    <span className="font-extrabold text-black ml-2 underline decoration-black decoration-2 underline-offset-[6px]">OFFER100</span>
                </p>
            </div>
        </div>
    );
};

export default DiscountBar;
