'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { Location, ApiResponse, PaymentInitResponse } from '@/types/api';
import { CreditCard } from 'lucide-react';

interface BookingData {
  locationId: string;
  slotStart: string;
  isPriority: boolean;
}

export default function BookPayPage() {
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

  const initPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!bookingData) throw new Error('No booking data');
      const response = await api.post<ApiResponse<PaymentInitResponse>>(
        '/payments/paystack/initialize',
        {
          purpose: 'PRIORITY_SLOT',
          locationId: bookingData.locationId,
          slotStart: bookingData.slotStart,
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Redirect to Paystack authorization URL
      window.location.href = data.authorizationUrl;
    },
  });

  if (!bookingData) return null;

  const location = locationQuery.data;

  return (
    <div className="space-y-qe-8">
      <div>
        <h1 className="text-qe-h1 font-800 text-qe-ink">Secure payment</h1>
        <p className="text-qe-body text-qe-ink-2 mt-qe-2">
          Powered by Paystack
        </p>
      </div>

      {locationQuery.isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : !location ? (
        <div className="text-center py-12">Location not found</div>
      ) : (
        <>
          <Card className="space-y-qe-6">
            <div className="pb-qe-6 border-b border-qe-line">
              <p className="text-qe-small text-qe-ink-3 mb-qe-2">Location</p>
              <h2 className="text-qe-h2 font-700 text-qe-ink">{location.name}</h2>
            </div>

            <div className="space-y-qe-4">
              <div className="flex justify-between items-center">
                <span className="text-qe-body text-qe-ink-2">Priority fee</span>
                <span className="text-qe-h3 font-800 text-qe-ink">
                  ₦{location.priorityPrice || 500}
                </span>
              </div>
            </div>

            <div className="p-qe-4 bg-qe-note-butter rounded-qe-md">
              <p className="text-qe-small text-qe-ink">
                Your payment will secure a priority slot. You can cancel anytime before
                arrival.
              </p>
            </div>
          </Card>

          <Card className="p-qe-6 border-2 border-qe-brand-500 bg-qe-brand-100 space-y-qe-4">
            <div className="flex gap-qe-3">
              <CreditCard className="w-5 h-5 text-qe-brand-500 flex-shrink-0" />
              <div>
                <p className="text-qe-body font-600 text-qe-brand-500">
                  All major cards accepted
                </p>
                <p className="text-qe-small text-qe-ink-2 mt-qe-1">
                  Visa, Mastercard, and more. Your data is secure.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-qe-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              isLoading={initPaymentMutation.isPending}
              onClick={() => initPaymentMutation.mutate()}
            >
              Pay now
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
