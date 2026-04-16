import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 'md',
  interactive = false,
  onRatingChange,
}) => {
  return (
    <div className="flex gap-qe-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={`${sizeMap[size]} transition-colors ${
            interactive ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
          }`}
        >
          <Star
            className={`w-full h-full ${
              star <= rating
                ? 'fill-qe-signal-warn text-qe-signal-warn'
                : 'text-qe-line'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export { RatingStars };
