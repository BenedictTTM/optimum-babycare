import React from 'react';

interface SimpleStarRatingProps {
  rating: number; // 0-5
  totalReviews?: number;
  size?: number; // Size in pixels
  showCount?: boolean;
}

export default function SimpleStarRating({ 
  rating, 
  totalReviews = 0, 
  size = 16,
  showCount = true 
}: SimpleStarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Stars */}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={`${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 fill-current'
            }`}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      
      {/* Review Count */}
      {showCount && (
        <span className="text-sm text-gray-500 ml-1">
          {totalReviews > 0 ? `(${totalReviews})` : '(0)'}
        </span>
      )}
    </div>
  );
}