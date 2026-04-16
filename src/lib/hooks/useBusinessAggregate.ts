import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface BusinessAggregate {
  totalBookingsToday: number;
  avgWaitTime: number;
  busyLocations: Array<{
    id: string;
    name: string;
    queueCount: number;
    avgWait: number;
  }>;
}

export const useBusinessAggregate = (businessId: string) => {
  return useQuery({
    queryKey: ['businessAggregate', businessId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<BusinessAggregate>>(
        `/businesses/${businessId}/aggregate`
      );
      return response.data.data;
    },
    enabled: !!businessId,
    staleTime: 30000,
  });
};
