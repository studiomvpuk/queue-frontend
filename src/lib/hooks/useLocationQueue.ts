import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { initSocket, subscribeToLocation, unsubscribeFromLocation } from '@/lib/socket';
import { ApiResponse, Booking } from '@/types/api';

export interface LocationQueueData {
  upcoming: Booking[];
  inQueue: Booking[];
  served: Booking[];
}

/**
 * Backed by GET /bookings/location/:locationId/queue (staff scope).
 * Live updates ride on the `locationUpdate` socket event published by the
 * NestJS QueuesGateway. Polls every 10s as a fallback (PRD §1.3 / §1.8).
 */
export const useLocationQueue = (locationId: string) => {
  const queryClient = useQueryClient();

  const queueQuery = useQuery({
    queryKey: ['location-queue', locationId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<LocationQueueData>>(
        `/bookings/location/${locationId}/queue`,
      );
      return response.data.data;
    },
    enabled: !!locationId,
    staleTime: 0,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!locationId) return;
    const socket = initSocket();
    if (!socket) return;

    subscribeToLocation(locationId);

    const handleUpdate = (data: { locationId?: string }) => {
      if (data?.locationId !== locationId) return;
      queryClient.invalidateQueries({ queryKey: ['location-queue', locationId] });
    };

    socket.on('locationUpdate', handleUpdate);

    return () => {
      socket.off('locationUpdate', handleUpdate);
      unsubscribeFromLocation(locationId);
    };
  }, [locationId, queryClient]);

  return queueQuery;
};
