'use client';

import React from 'react';

type PromotionalCardProps = {
  badge?: React.ReactNode;
  title?: React.ReactNode;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  gradientClass?: string; // e.g. 'from-blue-50 to-cyan-50'
  titleClass?: string;
  textClass?: string;
};

const PromotionalCard: React.FC<PromotionalCardProps> = ({
  badge,
  title,
  description,
  buttonText,
  imageUrl,
  gradientClass = 'from-blue-50 to-cyan-50',
  titleClass = 'text-2xl md:text-3xl font-extrabold mb-2 text-red-600',
  textClass = 'text-xs md:text-sm text-gray-600'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${gradientClass} shadow-xs hover:shadow-sm transition-shadow duration-300 min-h-[180px]`}>
      {/* Image: absolutely fills the right half, bleeds left to overlap text */}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="promo"
          className="absolute bottom-0 right-0 h-[110%] w-1/2 object-contain object-bottom z-20"
        />
      )}

      {/* Text panel: takes 3/5 width, sits behind the image */}
      <div className="relative z-10 w-3/5 px-6 py-6 flex flex-col justify-center min-h-[180px]">
        {badge && (
          (typeof badge === 'string' || typeof badge === 'number') ? (
            <p className="text-xs md:text-sm font-medium text-gray-600 mb-2 tracking-wide">{badge}</p>
          ) : (
            <div className="mb-2">{badge}</div>
          )
        )}

        {title && <h3 className={titleClass}>{title}</h3>}

        {description && <p className={textClass}>{description}</p>}

        {buttonText && (
          <div className="mt-3">
            <button className="inline-block bg-red-600 text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-red-700 transition-colors w-fit">
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalCard;
