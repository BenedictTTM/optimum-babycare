'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Super Fast Delivery',
    description: 'Potenti dapibus lobortis convallis sociis orci sagittis igula sollicitudin'
  },
  {
    icon: RotateCcw,
    title: '30 Day Easy Return',
    description: 'Potenti dapibus lobortis convallis sociis orci sagittis igula sollicitudin'
  },
  {
    icon: ShieldCheck,
    title: 'Security Payment',
    description: 'Potenti dapibus lobortis convallis sociis orci sagittis igula sollicitudin'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Potenti dapibus lobortis convallis sociis orci sagittis igula sollicitudin'
  }
];

const ServiceFeatures = () => {
  return (
    <section className="w-full bg-[#ef4444] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {FEATURES.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-4 group">
            {/* Icon Container */}
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <feature.icon className="w-6 h-6 text-[#ef4444]" strokeWidth={2.5} />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <h3 className="text-white font-extrabold text-lg tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/80 text-[12px] sm:text-[13px] leading-relaxed max-w-[220px] mx-auto">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceFeatures;