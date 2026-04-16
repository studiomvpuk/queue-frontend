import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface Review {
  id: string;
  locationId: string;
  rating: number;
  comment: string;
  customerFirstName: string;
  customerPhone: string;
  createdAt: string;
  responded: boolean;
  response?: string;
}

export const useReviews = (
  locationId: string,
  filter: 'all' | 'unreplied' | 'low' = 'all'
) => {
  return useQuery({
    queryKey: ['reviews', locationId, filter],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Review[]>>(
        `/locations/${locationId}/reviews?cursor=0&limit=50`
      );
      let reviews = response.data.data;
      if (filter === 'unreplied') {
        reviews = reviews.filter((r) => !r.responded);
      } else if (filter === 'low') {
        reviews = reviews.filter((r) => r.rating <= 3);
      }
      return reviews;
    },
    enabled: !!locationId,
    staleTime: 30000,
  });
};

export const useRespondToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      const res = await api.post<ApiResponse<Review>>(
        `/reviews/${reviewId}/respond`,
        { response }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
