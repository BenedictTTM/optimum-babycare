'use client';

import React from 'react';

const FooterFeatures = () => {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#FF4A3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            ),
            title: "INTERNATIONAL SHIPMENT",
            description: "Orders are shipped seamlessly between countries"
        },
        {
            icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#FF4A3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: "ONLINE SUPPORT 24/7",
            description: "Orders are shipped seamlessly between countries"
        },
        {
            icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#FF4A3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "MONEY RETURN",
            description: "Orders are shipped seamlessly between countries"
        },
        {
            icon: (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#FF4A3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
            ),
            title: "MEMBER DISCOUNT",
            description: "Orders are shipped seamlessly between countries"
        }
    ];

    return (
        <section className="w-full bg-white py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-100 rounded-xl shadow-sm my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="flex gap-4 items-start md:items-center">
                        <div className="shrink-0 pt-1 md:pt-0">
                            {feature.icon}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-[13px] md:text-[14px] font-extrabold text-gray-900 tracking-wide mb-1">
                                {feature.title}
                            </h4>
                            <p className="text-[11px] md:text-[12px] text-gray-500 leading-tight">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FooterFeatures;