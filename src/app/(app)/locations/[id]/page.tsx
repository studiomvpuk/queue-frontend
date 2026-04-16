'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button, Input } from '@/components/ui';
import { Location, ApiResponse } from '@/types/api';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LocationDetailPage() {
  const params = useParams();
  const locationId = params.id as string;

  const locationQuery = useQuery({
    queryKey: ['location', locationId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Location>>(`/locations/${locationId}`);
      return response.data.data;
    },
  });

  const location = locationQuery.data;

  if (locationQuery.isLoading) {
    return <div className="text-center py-12">Loading location...</div>;
  }

  if (!location) {
    return <div className="text-center py-12">Location not found</div>;
  }

  return (
    <div className="space-y-qe-8">
      <Link href="/app/locations" className="flex items-center gap-qe-2 text-qe-brand-500 hover:text-qe-brand-600 mb-qe-4">
        <ChevronLeft className="w-4 h-4" />
        Back to Locations
      </Link>

      <div>
        <h1 className="text-qe-h1 font-800 text-qe-ink">{location.name}</h1>
        <p className="text-qe-body text-qe-ink-3 mt-qe-2">{location.address}</p>
      </div>

      <Card className="space-y-qe-6">
        <h2 className="text-qe-h2 font-700 text-qe-ink">Settings</h2>

        <Input
          label="Location Name"
          type="text"
          defaultValue={location.name}
        />

        <Input
          label="Category"
          type="text"
          defaultValue={location.category}
        />

        <Input
          label="Address"
          type="text"
          defaultValue={location.address}
        />

        <Input
          label="Phone"
          type="tel"
          defaultValue={location.phone || ''}
        />

        <Input
          label="Slot Duration (minutes)"
          type="number"
          defaultValue={location.slotDurationMin}
        />

        <Input
          label="Maximum Queue Size"
          type="number"
          defaultValue={location.maxQueueSize}
        />

        <Input
          label="Walk-In Percentage"
          type="number"
          defaultValue={location.walkInPercent}
        />

        <div className="grid grid-cols-2 gap-qe-6">
          <Input
            label="Opens At"
            type="time"
            defaultValue={location.hoursOpen}
          />
          <Input
            label="Closes At"
            type="time"
            defaultValue={location.hoursClose}
          />
        </div>
      </Card>

      <div className="flex gap-qe-4">
        <Button variant="primary">Save Changes</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </div>
  );
}
