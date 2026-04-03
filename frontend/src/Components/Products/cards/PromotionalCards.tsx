'use client';

import React from 'react';
import PromotionalCard from './PromotionalCard';

const PromotionalCards = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-7">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromotionalCard
          badge="Hot Offer"
          title={
            <>
             <span className='text-black'> Get</span> <span className="text-4xl md:text-4xl text-red-600 font-semibold">80% Off</span>
            </>
          }
          description="on first order"
          imageUrl="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&auto=format&fit=crop&q=60"
          gradientClass="from-blue-50 to-cyan-50"
          titleClass="text-2xl md:text-3xl mb-2 text-red-600"
        />

        <PromotionalCard
          badge={<span className="text-lg md:text-2xl font-bold text-gray-800 tracking-wide">Summer Offer</span>}
          title={"Get 50% Extra Discount On Summer Items"}
          buttonText="Buy Now"
          imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60"
          gradientClass="from-orange-50 to-rose-50"
          titleClass="text-sm md:text-base font-normal text-black mb-4 leading-tight"
          textClass="text-xs md:text-sm text-gray-700"
        />
      </div>
    </div>
  );
};

export default PromotionalCards;
