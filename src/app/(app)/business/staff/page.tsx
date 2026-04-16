'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Card, Button, Input, Toast, EmptyState } from '@/components/ui';
import { ApiResponse } from '@/types/api';
import { Users, Phone, Tag } from 'lucide-react';

const staffSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,}$/, 'Valid phone number required'),
  role: z.enum(['STAFF', 'MANAGER']),
  locationId: z.string().min(1, 'Location required'),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffMember {
  id: string;
  phone: string;
  firstName: string;
  role: 'STAFF' | 'MANAGER';
  locationId: string;
}

export default function StaffPage() {
  const queryClient = useQueryClient();
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error'; open: boolean }>({
    message: '',
    type: 'success',
    open: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
  });

  // Fetch business and locations
  const businessQuery = useQuery({
    queryKey: ['businessMe'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<any>>('/businesses/me');
      return response.data.data;
    },
  });

  const locationsQuery = useQuery({
    queryKey: ['businessLocations', businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) return [];
      const response = await api.get<ApiResponse<any[]>>(
        `/businesses/${businessQuery.data.id}/locations`
      );
      return response.data.data;
    },
    enabled: !!businessQuery.data?.id,
  });

  // Fetch staff
  const staffQuery = useQuery({
    queryKey: ['staff', businessQuery.data?.id],
    queryFn: async () => {
      if (!businessQuery.data?.id) return [];
      const response = await api.get<ApiResponse<StaffMember[]>>(
        `/businesses/${businessQuery.data.id}/staff`
      );
      return response.data.data;
    },
    enabled: !!businessQuery.data?.id,
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      const response = await api.post<ApiResponse<StaffMember>>(
        `/businesses/${businessQuery.data?.id}/staff`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      reset();
      setToast({ message: 'Staff invitation sent', type: 'success', open: true });
    },
    onError: () => {
      setToast({ message: 'Failed to invite staff', type: 'error', open: true });
    },
  });

  const onSubmit = async (data: StaffFormData) => {
    await inviteMutation.mutateAsync(data);
  };

  const locations = locationsQuery.data ?? [];
  const staff = staffQuery.data ?? [];

  return (
    <div className="space-y-qe-8">
      <div>
        <h1 className="text-qe-h1 font-700 text-qe-ink">Staff Management</h1>
        <p className="text-qe-body text-qe-ink-3 mt-qe-2">
          Invite and manage team members
        </p>
      </div>

      {/* Invite Form */}
      <Card variant="elevated" className="space-y-qe-6">
        <h2 className="text-qe-h3 font-600 text-qe-ink">Invite Staff</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-qe-4">
          <div>
            <label className="block text-qe-small font-600 text-qe-ink mb-qe-2">
              <Phone className="w-4 h-4 inline mr-qe-2" />
              Phone Number
            </label>
            <Input
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
            {errors.phone && (
              <p className="text-qe-micro text-qe-signal-busy mt-qe-2">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-qe-4">
            <div>
              <label className="block text-qe-small font-600 text-qe-ink mb-qe-2">
                <Tag className="w-4 h-4 inline mr-qe-2" />
                Role
              </label>
              <select
                {...register('role')}
                className="w-full px-qe-4 py-qe-3 border border-qe-line rounded-qe-md text-qe-body bg-qe-surface focus:outline-none focus:ring-2 focus:ring-qe-brand-500"
              >
                <option value="">Select role</option>
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
              </select>
              {errors.role && (
                <p className="text-qe-micro text-qe-signal-busy mt-qe-2">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-qe-small font-600 text-qe-ink mb-qe-2">
                Location
              </label>
              <select
                {...register('locationId')}
                className="w-full px-qe-4 py-qe-3 border border-qe-line rounded-qe-md text-qe-body bg-qe-surface focus:outline-none focus:ring-2 focus:ring-qe-brand-500"
              >
                <option value="">Select location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <p className="text-qe-micro text-qe-signal-busy mt-qe-2">
                  {errors.locationId.message}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Sending invitation...' : 'Invite Staff Member'}
          </Button>
        </form>
      </Card>

      {/* Staff List */}
      {staff.length === 0 ? (
        <EmptyState
          title="No staff yet"
          description="Invite team members to get started"
          icon={<Users className="w-12 h-12 text-qe-ink-3" />}
        />
      ) : (
        <Card variant="elevated">
          <h2 className="text-qe-h3 font-600 text-qe-ink mb-qe-4">Team Members</h2>
          <div className="space-y-qe-3">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-qe-4 bg-qe-surface-2 rounded-qe-md"
              >
                <div>
                  <p className="text-qe-body font-600 text-qe-ink">{member.firstName}</p>
                  <p className="text-qe-small text-qe-ink-3">{member.phone}</p>
                </div>
                <div className="text-qe-small font-600 text-qe-ink-2">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
      />
    </div>
  );
}
