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
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${gradientClass} shadow-xs hover:shadow-sm transition-shadow duration-300`}>
      {/* Mobile: stacked layout with blurred image */}
      <div className="block md:hidden">
        <div className="px-6 py-6">
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

        {/* Mobile image: blurred and slightly scaled */}
        <div
          className="h-40 w-full bg-no-repeat bg-cover bg-center scale-105 opacity-70 transition-all duration-300"
          style={{ backgroundImage: `url('${imageUrl ?? ''}')` }}
        />
      </div>

      {/* Desktop/tablet: side-by-side layout */}
      <div className="hidden md:flex items-center h-[180px]">
        <div className="relative z-10 w-1/2 px-6 md:px-8 py-6 flex flex-col justify-center">
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

        <div
          className="absolute right-0 top-0 w-1/2 h-full bg-no-repeat bg-cover bg-center transition-transform duration-300"
          style={{
            backgroundImage: `url('${imageUrl ?? ''}')`
          }}
        />
      </div>
    </div>
  );
};

export default PromotionalCard;
