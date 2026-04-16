import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface AnalyticsData {
  volumeByHour: Array<{ hour: number; volume: number }>;
  noShowTrend: Array<{ date: string; rate: number }>;
  serviceTime: {
    p50: number;
    p90: number;
    p99: number;
  };
  uniqueCustomersPerDay: Array<{ date: string; count: number }>;
  wowDelta: number;
}

export const useAnalytics = (
  locationId: string,
  range: '7d' | '30d' = '7d'
) => {
  return useQuery({
    queryKey: ['analytics', locationId, range],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AnalyticsData>>(
        `/locations/${locationId}/analytics?range=${range}`
      );
      return response.data.data;
    },
    enabled: !!locationId,
    staleTime: 60000,
  });
};
