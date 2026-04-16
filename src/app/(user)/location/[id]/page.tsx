'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { Location, ApiResponse } from '@/types/api';
import { ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import PriorityToggle from '@/components/PriorityToggle';
import SlotPickerGrid from '@/components/SlotPickerGrid';

interface TimeSlot {
  time: string;
  available: boolean;
  isPriority?: boolean;
}

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isPriority, setIsPriority] = useState(false);

  const locationQuery = useQuery({
    queryKey: ['location', locationId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Location>>(
        `/locations/${locationId}`
      );
      return response.data.data;
    },
  });

  const location = locationQuery.data;

  // Generate time slots
  const generateSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [hours = 9, minutes = 0] =
      location?.hoursOpen?.split(':').map(Number) ?? [9, 0];
    const [closeHours = 17, closeMinutes = 0] =
      location?.hoursClose?.split(':').map(Number) ?? [17, 0];

    let current = new Date();
    current.setHours(hours, minutes, 0, 0);
    const end = new Date();
    end.setHours(closeHours, closeMinutes, 0, 0);

    const slotDuration = location?.slotDurationMin || 15;

    while (current < end) {
      const timeStr = current.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Simple availability logic: all slots available
      slots.push({
        time: timeStr,
        available: true,
        isPriority: isPriority && Math.random() < 0.2, // Mock 20% priority
      });

      current.setMinutes(current.getMinutes() + slotDuration);
    }

    return slots;
  };

  const slots = location ? generateSlots() : [];

  if (locationQuery.isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!location) {
    return <div className="text-center py-12">Location not found</div>;
  }

  const handleContinue = () => {
    if (!selectedSlot) return;

    // Store booking context
    const bookingData = {
      locationId,
      slotStart: selectedSlot,
      isPriority,
    };
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    if (isPriority && location.priorityEnabled) {
      router.push('/book/pay');
    } else {
      router.push('/book/confirm');
    }
  };

  return (
    <div className="space-y-qe-8">
      <Link
        href="/find"
        className="flex items-center gap-qe-2 text-qe-brand-500 hover:text-qe-brand-600"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <div>
        <h1 className="text-qe-h1 font-800 text-qe-ink">{location.name}</h1>
        <p className="text-qe-body text-qe-ink-2 mt-qe-2">{location.address}</p>
        <div className="flex items-center gap-qe-2 text-qe-small text-qe-ink-3 mt-qe-3">
          <Clock className="w-4 h-4" />
          {location.hoursOpen} - {location.hoursClose}
        </div>
      </div>

      <Card className="space-y-qe-6">
        <div>
          <h2 className="text-qe-h2 font-700 text-qe-ink mb-qe-4">
            Select a time slot
          </h2>

          {location.priorityEnabled && (
            <PriorityToggle
              enabled={isPriority}
              price={location.priorityPrice || 500}
              onToggle={setIsPriority}
            />
          )}

          <SlotPickerGrid
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        </div>

        <div className="flex gap-qe-4 pt-qe-4 border-t border-qe-line">
          <Link href="/find" className="flex-1">
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!selectedSlot}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
