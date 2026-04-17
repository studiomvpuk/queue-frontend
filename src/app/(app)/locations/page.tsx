'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button, EmptyState } from '@/components/ui';
import { Location, ApiResponse } from '@/types/api';
import { Plus, MapPin } from 'lucide-react';
import { CreateLocationDialog } from '@/components/CreateLocationDialog';

export default function LocationsPage() {
  const [showCreate, setShowCreate] = useState(false);

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

  if (locationsQuery.isLoading) {
    return <div className="text-center py-12">Loading locations...</div>;
  }

  return (
    <div className="space-y-qe-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-qe-h1 font-800 text-qe-ink">Locations</h1>
          <p className="text-qe-body text-qe-ink-3 mt-qe-2">Manage all your business locations</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <EmptyState
          icon={<MapPin />}
          title="No locations yet"
          description="Create your first location to start managing queues"
          action={
            <Button variant="primary" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Location
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-qe-6">
          {locations.map((location) => (
            <Link key={location.id} href={`/app/locations/${location.id}`}>
              <Card className="cursor-pointer hover:shadow-qe-2 transition-shadow h-full">
                <div className="flex items-start justify-between mb-qe-4">
                  <div>
                    <h3 className="text-qe-h3 font-700 text-qe-ink">{location.name}</h3>
                    <p className="text-qe-small text-qe-ink-3 mt-qe-1">{location.category}</p>
                  </div>
                </div>
                <p className="text-qe-small text-qe-ink-3 mb-qe-6">{location.address}</p>
                <div className="flex items-center gap-qe-4 text-qe-micro text-qe-ink-3">
                  <span>Max: {location.maxQueueSize}</span>
                  <span>Slot: {location.slotDurationMin}m</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateLocationDialog
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </div>
  );
}
