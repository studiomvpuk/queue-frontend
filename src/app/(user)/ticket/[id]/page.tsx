'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Booking, ApiResponse } from '@/types/api';
import TicketDark from '@/components/TicketDark';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function TicketPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const bookingQuery = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
      return response.data.data;
    },
  });

  const booking = bookingQuery.data;

  if (bookingQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading ticket...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-qe-4">
          <p className="text-qe-ink-2">Ticket not found</p>
          <Link href="/me/bookings">
            <Button variant="primary">Back to bookings</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock queue data
  const queuePosition = 3;
  const totalInQueue = 12;

  return (
    <>
      <TicketDark
        booking={booking}
        queuePosition={queuePosition}
        totalInQueue={totalInQueue}
      />

      <div className="fixed bottom-qe-4 left-qe-4 right-qe-4 flex gap-qe-4">
        <Link href="/me/bookings" className="flex-1">
          <Button variant="secondary" className="w-full">
            Back
          </Button>
        </Link>
      </div>
    </>
  );
}
