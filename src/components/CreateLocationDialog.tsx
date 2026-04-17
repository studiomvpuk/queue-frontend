'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Dialog, Input, Button } from '@/components/ui';

// ── Category options ──

const LOCATION_CATEGORIES = [
  { value: 'BANK', label: 'Bank / Financial Services' },
  { value: 'HOSPITAL', label: 'Hospital / Clinic' },
  { value: 'GOVERNMENT', label: 'Government Office' },
  { value: 'SALON', label: 'Salon / Barbershop' },
  { value: 'TELECOM', label: 'Telecom / Service Centre' },
  { value: 'OTHER', label: 'Other' },
] as const;

// ── Nigerian states ──

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// ── Validation ──

const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(120),
  category: z.enum(['BANK', 'HOSPITAL', 'GOVERNMENT', 'SALON', 'TELECOM', 'OTHER'], {
    required_error: 'Please select a category',
  }),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  slotDurationMin: z.coerce.number().int().min(5).max(120).optional(),
  maxQueueSize: z.coerce.number().int().min(5).max(500).optional(),
});

type CreateLocationForm = z.infer<typeof createLocationSchema>;

// ── Select Component ──

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-qe-small font-medium text-qe-ink mb-qe-2">{label}</label>
      )}
      <select
        ref={ref}
        className={`w-full px-qe-4 py-qe-3 rounded-qe-md border bg-qe-surface text-qe-ink focus:outline-none focus:ring-2 focus:ring-qe-brand-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-qe-signal-busy' : 'border-qe-line'
        } ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-qe-micro text-qe-signal-busy mt-qe-2">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

// ── Dialog Component ──

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateLocationDialog({ open, onOpenChange, onSuccess }: CreateLocationDialogProps) {
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLocationForm>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      slotDurationMin: 15,
      maxQueueSize: 50,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateLocationForm) => {
      // Default lat/lng to Lagos centre — businesses can update later
      const payload = {
        ...data,
        latitude: 6.5244,
        longitude: 3.3792,
      };
      return api.post('/locations', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      reset();
      setApiError('');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong. Please try again.';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const onSubmit = (data: CreateLocationForm) => {
    setApiError('');
    createMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          reset();
          setApiError('');
        }
        onOpenChange(val);
      }}
      title="Create Location"
      actions={
        <div className="flex gap-qe-4 w-full">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              reset();
              setApiError('');
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            isLoading={createMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-qe-5">
        {apiError && (
          <div className="p-qe-4 rounded-qe-md bg-qe-note-blush border border-qe-signal-busy/20">
            <p className="text-qe-small text-qe-signal-busy">{apiError}</p>
          </div>
        )}

        <Input
          label="Location Name"
          placeholder="e.g. Ikeja Branch"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Category"
          error={errors.category?.message}
          options={LOCATION_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          {...register('category')}
        />

        <Input
          label="Address"
          placeholder="e.g. 12 Allen Avenue, Ikeja"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-2 gap-qe-4">
          <Input
            label="City"
            placeholder="e.g. Lagos"
            error={errors.city?.message}
            {...register('city')}
          />
          <Select
            label="State"
            error={errors.state?.message}
            options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))}
            {...register('state')}
          />
        </div>

        <div className="grid grid-cols-2 gap-qe-4">
          <Input
            label="Slot Duration (mins)"
            type="number"
            placeholder="15"
            hint="5–120 minutes"
            error={errors.slotDurationMin?.message}
            {...register('slotDurationMin')}
          />
          <Input
            label="Max Queue Size"
            type="number"
            placeholder="50"
            hint="5–500 people"
            error={errors.maxQueueSize?.message}
            {...register('maxQueueSize')}
          />
        </div>
      </form>
    </Dialog>
  );
}
