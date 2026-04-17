'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { Card, Button, Input, Toast } from '@/components/ui';
import { Location, ApiResponse } from '@/types/api';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const updateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  address: z.string().min(1, 'Address is required'),
  slotDurationMin: z.coerce.number().int().min(5, 'Minimum 5 mins').max(120, 'Maximum 120 mins'),
  maxQueueSize: z.coerce.number().int().min(5, 'Minimum 5').max(500, 'Maximum 500'),
  walkInPercent: z.coerce.number().int().min(0).max(100),
});

type UpdateForm = z.infer<typeof updateSchema>;

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const locationId = params.id as string;

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>({
    message: '',
    type: 'success',
    open: false,
  });

  const locationQuery = useQuery({
    queryKey: ['location', locationId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Location>>(`/locations/${locationId}`);
      return response.data.data;
    },
  });

  const location = locationQuery.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
  });

  // Populate form when location data arrives
  useEffect(() => {
    if (location) {
      reset({
        name: location.name,
        address: location.address,
        slotDurationMin: location.slotDurationMin,
        maxQueueSize: location.maxQueueSize,
        walkInPercent: location.walkInPercent,
      });
    }
  }, [location, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: UpdateForm) => {
      return api.patch(`/locations/${locationId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location', locationId] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setToast({ message: 'Location updated', type: 'success', open: true });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        'Failed to save changes. Please try again.';
      setToast({ message: typeof msg === 'string' ? msg : 'Something went wrong', type: 'error', open: true });
    },
  });

  const onSubmit = (data: UpdateForm) => {
    saveMutation.mutate(data);
  };

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
        <p className="text-qe-body text-qe-ink-3 mt-qe-2">{location.category} · {location.address}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-qe-6">
          <h2 className="text-qe-h2 font-700 text-qe-ink">Settings</h2>

          <Input
            label="Location Name"
            type="text"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Address"
            type="text"
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="grid grid-cols-3 gap-qe-4">
            <Input
              label="Slot Duration (mins)"
              type="number"
              error={errors.slotDurationMin?.message}
              {...register('slotDurationMin')}
            />
            <Input
              label="Max Queue Size"
              type="number"
              error={errors.maxQueueSize?.message}
              {...register('maxQueueSize')}
            />
            <Input
              label="Walk-In %"
              type="number"
              error={errors.walkInPercent?.message}
              {...register('walkInPercent')}
            />
          </div>
        </Card>

        <div className="flex gap-qe-4 mt-qe-6">
          <Button
            type="submit"
            variant="primary"
            isLoading={saveMutation.isPending}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/app/locations')}
          >
            Cancel
          </Button>
        </div>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
      />
    </div>
  );
}
