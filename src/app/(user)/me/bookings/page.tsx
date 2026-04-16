'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Booking, ApiResponse } from '@/types/api';
import { Card, Button } from '@/components/ui';
import Link from 'next/link';

export default function BookingsPage() {
  const [filter, setFilter] = useState<'active' | 'history'>('active');

  const bookingsQuery = useQuery({
    queryKey: ['bookings', filter],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Booking[]>>('/bookings/me', {
        params: {
          status:
            filter === 'active'
              ? 'CONFIRMED,ARRIVED'
              : 'SERVED,NO_SHOW,CANCELLED',
        },
      });
      return response.data.data;
    },
  });

  const bookings = bookingsQuery.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-qe-note-sky text-qe-ink';
      case 'ARRIVED':
        return 'bg-qe-note-butter text-qe-ink';
      case 'SERVED':
        return 'bg-qe-surface-2 text-qe-ink-2';
      case 'NO_SHOW':
        return 'bg-qe-note-blush text-qe-ink';
      default:
        return 'bg-qe-surface-2 text-qe-ink-2';
    }
  };

  return (
    <div className="space-y-qe-8">
      <div className="space-y-qe-4">
        <h1 className="text-qe-h1 font-800 text-qe-ink">My bookings</h1>
        <p className="text-qe-body text-qe-ink-2">View all your upcoming and past bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-qe-4 border-b border-qe-line">
        <button
          onClick={() => setFilter('active')}
          className={`px-qe-4 py-qe-3 font-600 border-b-2 transition ${
            filter === 'active'
              ? 'text-qe-brand-500 border-qe-brand-500'
              : 'text-qe-ink-2 border-transparent hover:text-qe-ink'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('history')}
          className={`px-qe-4 py-qe-3 font-600 border-b-2 transition ${
            filter === 'history'
              ? 'text-qe-brand-500 border-qe-brand-500'
              : 'text-qe-ink-2 border-transparent hover:text-qe-ink'
          }`}
        >
          History
        </button>
      </div>

      {/* Bookings List */}
      {bookingsQuery.isLoading ? (
        <div className="text-center py-12">
          <p className="text-qe-ink-2">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-qe-ink-2">
            {filter === 'active' ? 'No active bookings' : 'No booking history'}
          </p>
        </div>
      ) : (
        <div className="space-y-qe-4">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="flex items-start justify-between p-qe-4 md:p-qe-6"
            >
              <div className="flex-1 space-y-qe-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-qe-h3 font-700 text-qe-ink">
                      {booking.user?.firstName ?? booking.walkInName ?? 'Customer'}
                    </h3>
                    <p className="text-qe-small text-qe-ink-2 mt-qe-1">
                      {new Date(booking.slotStart).toLocaleDateString()} at{' '}
                      {new Date(booking.slotStart).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className={`px-qe-3 py-qe-1 rounded-qe-pill text-qe-small font-600 ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>

                <div className="flex items-center gap-qe-2 text-qe-small text-qe-ink-2">
                  {booking.isPriority && (
                    <span className="px-qe-2 py-qe-1 bg-qe-signal-warn rounded text-qe-ink font-600">
                      Priority
                    </span>
                  )}
                </div>
              </div>

              {filter === 'active' && (
                <Link href={`/ticket/${booking.id}`} className="ml-qe-4 flex-shrink-0">
                  <Button variant="primary" size="sm">
                    View ticket
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
