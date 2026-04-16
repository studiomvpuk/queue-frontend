'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button, Input, Toast } from '@/components/ui';
import { ApiResponse, Location } from '@/types/api';

interface FormState {
  name: string;
  slotDurationMin: number;
  maxQueueSize: number;
  walkInPercent: number;
}

const DEFAULT_FORM: FormState = {
  name: '',
  // PRD §1.9 sane defaults: 9–16, 15-min slots, 50 max, 30% walk-in reserve.
  slotDurationMin: 15,
  maxQueueSize: 50,
  walkInPercent: 30,
};

export default function ConfigPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; open: boolean }>(
    { message: '', type: 'success', open: false },
  );

  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{ locations: Location[]; nextCursor: string | null }>
      >('/locations');
      return response.data.data.locations;
    },
  });

  const locations = locationsQuery.data ?? [];

  // Auto-select first location and seed the form from its current values.
  useEffect(() => {
    const first = locations[0];
    if (first && !selectedId) {
      setSelectedId(first.id);
    }
  }, [locations, selectedId]);

  useEffect(() => {
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) {
      setForm({
        name: loc.name,
        slotDurationMin: loc.slotDurationMin ?? DEFAULT_FORM.slotDurationMin,
        maxQueueSize: loc.maxQueueSize ?? DEFAULT_FORM.maxQueueSize,
        walkInPercent: loc.walkInPercent ?? DEFAULT_FORM.walkInPercent,
      });
    }
  }, [selectedId, locations]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedId) throw new Error('No location selected');
      const response = await api.patch<ApiResponse<Location>>(`/locations/${selectedId}`, form);
      return response.data.data;
    },
    onSuccess: () => {
      setToast({ message: 'Settings saved', type: 'success', open: true });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: () => {
      setToast({ message: 'Failed to save settings', type: 'error', open: true });
    },
  });

  if (locationsQuery.isLoading) {
    return <div className="text-center py-12">Loading…</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12 text-qe-ink-3">
        Create a location first, then come back to configure it.
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-qe-8">
      <div>
        <h1 className="text-qe-h1 font-800 text-qe-ink mb-qe-3">Configuration</h1>
        <p className="text-qe-body text-qe-ink-3">
          Slot, capacity and walk-in settings. Changes take effect within 30 seconds and never
          affect existing bookings.
        </p>
      </div>

      {locations.length > 1 && (
        <div className="flex flex-wrap gap-qe-3">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedId(loc.id)}
              className={`px-qe-4 py-qe-2 rounded-qe-md font-medium text-qe-small transition-all ${
                selectedId === loc.id
                  ? 'bg-qe-brand-500 text-qe-surface shadow-qe-2'
                  : 'bg-qe-surface-2 text-qe-ink hover:bg-qe-line border border-qe-line'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}

      <Card className="space-y-qe-6">
        <h2 className="text-qe-h2 font-700 text-qe-ink">Slot Settings</h2>

        <Input
          label="Location Name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="Slot Duration (minutes)"
          type="number"
          value={form.slotDurationMin}
          min={5}
          max={120}
          onChange={(e) =>
            setForm({ ...form, slotDurationMin: parseInt(e.target.value || '0', 10) })
          }
        />

        <Input
          label="Maximum Queue Size"
          type="number"
          value={form.maxQueueSize}
          min={5}
          max={500}
          onChange={(e) =>
            setForm({ ...form, maxQueueSize: parseInt(e.target.value || '0', 10) })
          }
        />

        <Input
          label="Walk-In Reserve (%)"
          type="number"
          value={form.walkInPercent}
          min={0}
          max={100}
          onChange={(e) =>
            setForm({ ...form, walkInPercent: parseInt(e.target.value || '0', 10) })
          }
        />
      </Card>

      <div className="flex gap-qe-4">
        <Button
          variant="primary"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || !selectedId}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
      />
    </div>
  );
}
