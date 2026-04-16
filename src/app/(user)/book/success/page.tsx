'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { Booking, ApiResponse } from '@/types/api';
import { CheckCircle2 } from 'lucide-react';

export default function BookSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const confirmPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!reference) throw new Error('No payment reference');

      const bookingData = JSON.parse(
        sessionStorage.getItem('pendingBooking') || '{}'
      );

      const response = await api.post<ApiResponse<Booking>>('/bookings', {
        ...bookingData,
        paymentReference: reference,
      });
      return response.data.data;
    },
    onSuccess: (booking) => {
      sessionStorage.removeItem('pendingBooking');
      router.push(`/ticket/${booking.id}`);
    },
    onError: () => {
      router.push('/find');
    },
  });

  useEffect(() => {
    if (reference) {
      confirmPaymentMutation.mutate();
    } else {
      router.push('/find');
    }
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center p-qe-4">
      <Card className="max-w-md w-full text-center space-y-qe-6">
        <CheckCircle2 className="w-16 h-16 mx-auto text-qe-signal-live" />

        <div>
          <h1 className="text-qe-h2 font-800 text-qe-ink">Payment received</h1>
          <p className="text-qe-body text-qe-ink-2 mt-qe-2">
            {confirmPaymentMutation.isPending
              ? 'Confirming your booking...'
              : 'Your priority slot is secured!'}
          </p>
        </div>

        <div className="py-qe-4 px-qe-4 bg-qe-surface-2 rounded-qe-md font-mono text-qe-small text-qe-ink-2">
          {reference}
        </div>

        <Button
          variant="primary"
          className="w-full"
          disabled={confirmPaymentMutation.isPending}
        >
          {confirmPaymentMutation.isPending ? 'Processing...' : 'Continue'}
        </Button>
      </Card>
    </div>
  );
}
