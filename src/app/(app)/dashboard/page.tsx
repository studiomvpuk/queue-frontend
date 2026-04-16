'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useLocationQueue } from '@/lib/hooks/useLocationQueue';
import { Button, HeroNumber, Card, EmptyState, Toast } from '@/components/ui';
import { QueueColumn } from '@/components/QueueColumn';
import { Location, ApiResponse } from '@/types/api';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({
    message: '',
    type: 'success',
    open: false,
  });

  // Backend list response is { locations, nextCursor }, not a flat array.
  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{ locations: Location[]; nextCursor: string | null }>
      >('/locations');
      return response.data.data.locations;
    },
  });

  const locations = locationsQuery.data ?? [];

  // Auto-select first location
  useEffect(() => {
    const first = locations[0];
    if (first && !selectedLocation) {
      setSelectedLocation(first.id);
    }
  }, [locations, selectedLocation]);

  // Fetch queue for selected location (uses the new staff endpoint
  // /bookings/location/:id/queue and listens for `locationUpdate` over WS).
  const queueQuery = useLocationQueue(selectedLocation || '');

  const queueData = queueQuery.data;
  const upcoming = queueData?.upcoming ?? [];
  const inQueue = queueData?.inQueue ?? [];
  const served = queueData?.served ?? [];

  const handleCallNext = async () => {
    // "Call Next" pulls the head of the inQueue panel into SERVING.
    const head = inQueue[0];
    if (!selectedLocation || !head) return;
    try {
      await api.post(`/bookings/${head.id}/serve`);
      setToast({ message: 'Calling next customer…', type: 'success', open: true });
    } catch {
      setToast({ message: 'Failed to call next customer', type: 'error', open: true });
    }
  };

  const handleAddWalkIn = async () => {
    if (!selectedLocation) return;
    // PRD §1.10: name and phone are optional. We use a lightweight prompt
    // so it stays one-tap; a richer modal can replace this in Phase 2.
    const name = window.prompt('Walk-in name (optional):', '') ?? undefined;
    try {
      await api.post('/bookings/walk-in', {
        locationId: selectedLocation,
        name: name || undefined,
      });
      setToast({ message: 'Walk-in added to queue', type: 'success', open: true });
      queueQuery.refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.error === 'WALK_IN_CAPACITY'
        ? 'Walk-in reserve reached. Confirm to override.'
        : 'Failed to add walk-in';
      if (err?.response?.data?.error === 'WALK_IN_CAPACITY' && window.confirm(msg)) {
        try {
          await api.post('/bookings/walk-in', {
            locationId: selectedLocation,
            name: name || undefined,
            override: true,
          });
          setToast({ message: 'Walk-in added (override)', type: 'success', open: true });
          queueQuery.refetch();
        } catch {
          setToast({ message: 'Failed to add walk-in', type: 'error', open: true });
        }
      } else {
        setToast({ message: msg, type: 'error', open: true });
      }
    }
  };

  // Spacebar shortcut, but only when no input/textarea/contentEditable is focused.
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleCallNext();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inQueue, selectedLocation]);

  if (locationsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-qe-body text-qe-ink-3">Loading queue...</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <EmptyState
        title="No locations yet"
        description="Create your first location to start managing queues"
        action={
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-qe-8">
      {/* Location Selector */}
      <div className="flex flex-wrap gap-qe-3">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocation(loc.id)}
            className={`px-qe-4 py-qe-2 rounded-qe-md font-medium text-qe-small transition-all ${
              selectedLocation === loc.id
                ? 'bg-qe-brand-500 text-qe-surface shadow-qe-2'
                : 'bg-qe-surface-2 text-qe-ink hover:bg-qe-line border border-qe-line'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      {location && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-qe-8">
          <div className="text-center">
            <HeroNumber
              number={upcoming.length}
              label="Upcoming"
              variant="brand-500"
            />
          </div>
          <div className="text-center">
            <HeroNumber
              number={inQueue.length}
              label="In Queue"
              variant={inQueue.length > 5 ? 'busy' : inQueue.length > 2 ? 'warn' : 'live'}
            />
          </div>
          <div className="text-center">
            <HeroNumber
              number={served.length}
              label="Just Served"
              variant="live"
            />
          </div>
        </div>
      )}

      {/* Queue Columns */}
      {selectedLocation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-qe-8">
          <QueueColumn title="Upcoming" bookings={upcoming} />
          <QueueColumn
            title="In Queue"
            bookings={inQueue}
            isEmpty={inQueue.length === 0}
          />
          <QueueColumn title="Just Served" bookings={served} isEmpty={served.length === 0} />
        </div>
      )}

      {/* Quick Actions */}
      <Card className="flex gap-qe-4 flex-wrap">
        <Button variant="primary" onClick={handleCallNext} disabled={inQueue.length === 0}>
          Call Next (Space)
        </Button>
        <Button variant="secondary" onClick={handleAddWalkIn} disabled={!selectedLocation}>
          + Add Walk-In
        </Button>
        <Button variant="ghost">Settings</Button>
      </Card>

      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
      />
    </div>
  );
}
