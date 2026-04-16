'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Location, ApiResponse } from '@/types/api';
import Link from 'next/link';
import { Card, Button, Input } from '@/components/ui';
import { MapPin, Clock } from 'lucide-react';

export default function FindLocationsPage() {
  const [search, setSearch] = useState('');

  const locationsQuery = useQuery({
    queryKey: ['locations', search],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{ locations: Location[]; nextCursor: string | null }>
      >('/locations', {
        params: { search: search || undefined, limit: 50 },
      });
      return response.data.data.locations;
    },
  });

  const locations = locationsQuery.data ?? [];

  return (
    <div className="space-y-qe-8">
      <div className="space-y-qe-4">
        <h1 className="text-qe-h1 font-800 text-qe-ink">Find a location</h1>
        <p className="text-qe-body text-qe-ink-2">Browse and book your spot</p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name, category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Locations Grid */}
      {locationsQuery.isLoading ? (
        <div className="text-center py-12">
          <p className="text-qe-ink-2">Loading locations...</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-qe-ink-2">No locations found</p>
        </div>
      ) : (
        <div className="grid gap-qe-6 md:grid-cols-2">
          {locations.map((location) => (
            <Card key={location.id} className="space-y-qe-4">
              <div>
                <h3 className="text-qe-h3 font-700 text-qe-ink">{location.name}</h3>
                <p className="text-qe-small text-qe-ink-2">{location.category}</p>
              </div>

              <div className="space-y-qe-2">
                <div className="flex items-center gap-qe-2 text-qe-small text-qe-ink-2">
                  <MapPin className="w-4 h-4" />
                  {location.address}
                </div>
                <div className="flex items-center gap-qe-2 text-qe-small text-qe-ink-2">
                  <Clock className="w-4 h-4" />
                  {location.hoursOpen} - {location.hoursClose}
                </div>
              </div>

              <Link href={`/location/${location.id}`}>
                <Button variant="primary" className="w-full">
                  Book now
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
