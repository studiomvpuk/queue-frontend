'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Review, useRespondToReview } from '@/lib/hooks/useReviews';

const respondSchema = z.object({
  response: z.string().min(10, 'Response must be at least 10 characters').max(500),
});

type RespondFormData = z.infer<typeof respondSchema>;

interface RespondDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RespondDialog: React.FC<RespondDialogProps> = ({
  review,
  open,
  onOpenChange,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RespondFormData>({
    resolver: zodResolver(respondSchema),
  });

  const respondMutation = useRespondToReview();

  const onSubmit = async (data: RespondFormData) => {
    if (!review) return;
    try {
      await respondMutation.mutateAsync({
        reviewId: review.id,
        response: data.response,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to respond:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Respond to review">
      <div className="space-y-qe-6">
        {review && (
          <>
            <div>
              <h2 className="text-qe-h2 font-700 text-qe-ink mb-qe-2">
                Respond to Review
              </h2>
              <p className="text-qe-body text-qe-ink-3">
                From {review.customerFirstName} • {review.rating} stars
              </p>
              <blockquote className="mt-qe-4 p-qe-4 bg-qe-surface-2 rounded-qe-md border-l-2 border-qe-brand-500">
                <p className="text-qe-body text-qe-ink italic">"{review.comment}"</p>
              </blockquote>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-qe-4">
              <div>
                <label className="block text-qe-small font-600 text-qe-ink mb-qe-2">
                  Your Response
                </label>
                <textarea
                  {...register('response')}
                  placeholder="Share your response with the customer..."
                  className="w-full px-qe-4 py-qe-3 border border-qe-line rounded-qe-md text-qe-body font-400 focus:outline-none focus:ring-2 focus:ring-qe-brand-500 focus:border-transparent resize-none"
                  rows={4}
                />
                {errors.response && (
                  <p className="text-qe-micro text-qe-signal-busy mt-qe-2">
                    {errors.response.message}
                  </p>
                )}
              </div>

              <div className="flex gap-qe-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
};

export { RespondDialog };
