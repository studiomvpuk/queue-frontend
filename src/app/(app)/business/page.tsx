'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useActiveLocationStore } from '@/lib/store/active-location';
import { useBusinessAggregate } from '@/lib/hooks/useBusinessAggregate';
import { Card, KpiCard, EmptyState } from '@/components/ui';
import { Building2 } from 'lucide-react';
import { ApiResponse } from '@/types/api';

interface Business {
  id: string;
  name: string;
}

interface LocationWithMetrics {
  id: string;
  name: string;
  queueCount: number;
  status: 'live' | 'warn' | 'busy';
  rating: number;
}

export default function BusinessPage() {
  const setActiveLocation = useActiveLocationStore((state) => state.setActiveLocation);

  // Fetch current business
  const businessQuery = useQuery({
    queryKey: ['businessMe'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Business>>('/businesses/me');
      return response.data.data;
    },
  });

  // Fetch locations for business
  const locationsQuery = useQuery({
    queryKey: ['businessLocations', businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) return [];
      const response = await api.get<ApiResponse<LocationWithMetrics[]>>(
        `/businesses/${businessQuery.data.id}/locations`
      );
      return response.data.data;
    },
    enabled: !!businessQuery.data?.id,
  });

  const aggregateQuery = useBusinessAggregate(businessQuery.data?.id || '');

  useEffect(() => {
    if (locationsQuery.data?.[0]) {
      setActiveLocation(locationsQuery.data[0].id);
    }
  }, [locationsQuery.data, setActiveLocation]);

  if (businessQuery.isLoading || locationsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-qe-body text-qe-ink-3">Loading business...</p>
      </div>
    );
  }

  const business = businessQuery.data;
  const locations = locationsQuery.data ?? [];
  const aggregate = aggregateQuery.data;

  if (!business) {
    return (
      <EmptyState
        title="No business found"
        description="Create a business to get started"
      />
    );
  }

  return (
    <div className="space-y-qe-8">
      <div>
        <h1 className="text-qe-h1 font-700 text-qe-ink">{business.name}</h1>
        <p className="text-qe-body text-qe-ink-3 mt-qe-2">
          {locations.length} location{locations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Hero KPIs */}
      {aggregate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-qe-6">
          <KpiCard
            value={aggregate.totalBookingsToday}
            label="Today's Bookings"
            variant="default"
          />
          <KpiCard
            value={Math.round(aggregate.avgWaitTime)}
            label="Avg Wait Time"
            unit="min"
            variant="warn"
          />
          <KpiCard
            value={aggregate.busyLocations.length}
            label="Busy Locations"
            variant="live"
          />
        </div>
      )}

      {/* Location Grid */}
      {locations.length === 0 ? (
        <EmptyState
          title="No locations yet"
          description="Add your first location to start managing queues"
          icon={<Building2 className="w-12 h-12 text-qe-ink-3" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-qe-6">
          {locations.map((location) => (
            <Card key={location.id} variant="elevated">
              <div className="space-y-qe-4">
                <div className="flex items-start justify-between gap-qe-3">
                  <h3 className="text-qe-h3 font-600 text-qe-ink">{location.name}</h3>
                  <span
                    className={`text-qe-micro font-600 px-qe-2 py-qe-1 rounded-qe-pill uppercase tracking-wide ${
                      location.status === 'live'
                        ? 'bg-qe-signal-live/10 text-qe-signal-live'
                        : location.status === 'warn'
                          ? 'bg-qe-signal-warn/10 text-qe-signal-warn'
                          : 'bg-qe-signal-busy/10 text-qe-signal-busy'
                    }`}
                  >
                    {location.status}
                  </span>
                </div>

                <div className="space-y-qe-3">
                  <div className="flex items-center justify-between">
                    <span className="text-qe-body text-qe-ink-3">Queue</span>
                    <span
                      className="text-qe-h3 font-700 text-qe-brand-500"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {location.queueCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-qe-body text-qe-ink-3">Rating</span>
                    <span
                      className="text-qe-body font-600"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {location.rating.toFixed(1)} ★
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
