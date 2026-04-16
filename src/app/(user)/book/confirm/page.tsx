'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { Location, ApiResponse, Booking } from '@/types/api';
import { AlertCircle } from 'lucide-react';

interface BookingData {
  locationId: string;
  slotStart: string;
  isPriority: boolean;
}

export default function BookConfirmPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingBooking');
    if (stored) {
      setBookingData(JSON.parse(stored));
    } else {
      router.push('/find');
    }
  }, [router]);

  const locationQuery = useQuery({
    queryKey: ['location', bookingData?.locationId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Location>>(
        `/locations/${bookingData?.locationId}`
      );
      return response.data.data;
    },
    enabled: !!bookingData,
  });

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!bookingData) throw new Error('No booking data');
      const response = await api.post<ApiResponse<Booking>>('/bookings', {
        locationId: bookingData.locationId,
        slotStart: bookingData.slotStart,
        isPriority: bookingData.isPriority,
      });
      return response.data.data;
    },
    onSuccess: (booking) => {
      sessionStorage.removeItem('pendingBooking');
      router.push(`/ticket/${booking.id}`);
    },
  });

  if (!bookingData) return null;

  const location = locationQuery.data;

  return (
    <div className="space-y-qe-8">
      <div>
        <h1 className="text-qe-h1 font-800 text-qe-ink">Review your booking</h1>
        <p className="text-qe-body text-qe-ink-2 mt-qe-2">Confirm the details below</p>
      </div>

      {locationQuery.isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : !location ? (
        <div className="text-center py-12">Location not found</div>
      ) : (
        <>
          <Card className="space-y-qe-6">
            <div>
              <p className="text-qe-small text-qe-ink-3 mb-qe-2">Location</p>
              <h2 className="text-qe-h2 font-700 text-qe-ink">{location.name}</h2>
              <p className="text-qe-body text-qe-ink-2">{location.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-qe-6 pt-qe-4 border-t border-qe-line">
              <div>
                <p className="text-qe-small text-qe-ink-3 mb-qe-2">Time slot</p>
                <p className="text-qe-body font-600 text-qe-ink">{bookingData.slotStart}</p>
              </div>
              <div>
                <p className="text-qe-small text-qe-ink-3 mb-qe-2">Type</p>
                <p className="text-qe-body font-600 text-qe-ink">
                  {bookingData.isPriority ? 'Priority' : 'Standard'}
                </p>
              </div>
            </div>

            {bookingData.isPriority && (
              <div className="p-qe-4 bg-qe-note-sky rounded-qe-md flex gap-qe-3">
                <AlertCircle className="w-5 h-5 text-qe-signal-warn flex-shrink-0 mt-qe-1" />
                <div className="text-qe-small text-qe-ink">
                  <p className="font-600">Priority fee: ₦{location.priorityPrice || 500}</p>
                  <p className="text-qe-ink-2 mt-qe-1">
                    You'll be prompted to pay via Paystack
                  </p>
                </div>
              </div>
            )}
          </Card>

          <div className="flex gap-qe-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => router.back()}
            >
              Edit
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              isLoading={createBookingMutation.isPending}
              onClick={() => createBookingMutation.mutate()}
            >
              Confirm booking
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
