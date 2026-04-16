'use client';

import React, { useState } from 'react';
import { useActiveLocationStore } from '@/lib/store/active-location';
import { useReviews, Review } from '@/lib/hooks/useReviews';
import { ReviewCard } from '@/components/ReviewCard';
import { RespondDialog } from '@/components/RespondDialog';
import { Chip, EmptyState } from '@/components/ui';
import { MessageSquare } from 'lucide-react';

export default function ReviewsPage() {
  const activeLocationId = useActiveLocationStore((state) => state.activeLocationId);
  const [filter, setFilter] = useState<'all' | 'unreplied' | 'low'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const reviewsQuery = useReviews(activeLocationId || '', filter);
  const reviews = reviewsQuery.data ?? [];

  if (!activeLocationId) {
    return (
      <EmptyState
        title="Select a location"
        description="Choose a location from the menu to view reviews"
      />
    );
  }

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-qe-body text-qe-ink-3">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-qe-8">
      <div>
        <h1 className="text-qe-h1 font-700 text-qe-ink">Reviews</h1>
        <p className="text-qe-body text-qe-ink-3 mt-qe-2">
          Manage customer reviews and feedback
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-qe-3">
        {(['all', 'unreplied', 'low'] as const).map((f) => (
          <Chip
            key={f}
            role="button"
            onClick={() => setFilter(f)}
            variant={filter === f ? 'success' : 'default'}
            style={{ cursor: 'pointer' }}
          >
            {f === 'all'
              ? 'All Reviews'
              : f === 'unreplied'
                ? 'Unreplied'
                : 'Low Rating ≤3'}
          </Chip>
        ))}
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews will appear here as customers leave feedback"
          icon={<MessageSquare className="w-12 h-12 text-qe-ink-3" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-qe-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onRespond={(r) => {
                setSelectedReview(r);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <RespondDialog
        review={selectedReview}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
