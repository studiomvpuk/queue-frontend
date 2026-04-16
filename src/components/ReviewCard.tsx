'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { Review } from '@/lib/hooks/useReviews';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  onRespond: (review: Review) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onRespond }) => {
  return (
    <Card variant="elevated">
      <div className="space-y-qe-4">
        <div className="flex items-start justify-between gap-qe-4">
          <div className="flex-1">
            <div className="flex items-center gap-qe-3 mb-qe-2">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-qe-small text-qe-ink-3">
                {review.customerFirstName}
              </span>
            </div>
            <p className="text-qe-body text-qe-ink">{review.comment}</p>
          </div>
        </div>

        {review.responded && review.response && (
          <div className="bg-qe-surface-2 rounded-qe-md p-qe-4 border-l-2 border-qe-brand-500">
            <p className="text-qe-small font-600 text-qe-ink-2 mb-qe-2">Your response:</p>
            <p className="text-qe-small text-qe-ink">{review.response}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-qe-2">
          <span className="text-qe-micro text-qe-ink-3">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </span>
          {!review.responded && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRespond(review)}
            >
              Respond
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export { ReviewCard };
