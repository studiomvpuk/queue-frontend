'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button, Input, Dialog } from '@/components/ui';
import { Webhook, ApiResponse } from '@/types/api';
import { Trash2, Plus, CheckCircle2 } from 'lucide-react';
import RoleGate from '@/components/RoleGate';

const AVAILABLE_EVENTS = [
  'booking:created',
  'booking:updated',
  'payment:completed',
  'queue:updated',
];

export default function WebhooksPage() {
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const webhooksQuery = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Webhook[]>>('/webhooks/me');
      return response.data.data;
    },
  });

  const createWebhookMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<ApiResponse<Webhook>>('/webhooks', {
        url: webhookUrl,
        events: selectedEvents,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setWebhookUrl('');
      setSelectedEvents([]);
      setShowCreateDialog(false);
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      await api.delete(`/webhooks/${webhookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const webhooks = webhooksQuery.data ?? [];

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    );
  };

  return (
    <RoleGate role="ADMIN" fallback={<div className="text-center py-12">Admin only</div>}>
      <div className="space-y-qe-8">
        <div className="flex items-center justify-between">
          <div className="space-y-qe-2">
            <h1 className="text-qe-h1 font-800 text-qe-ink">Webhooks</h1>
            <p className="text-qe-body text-qe-ink-2">Subscribe to real-time events</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-qe-2"
          >
            <Plus className="w-4 h-4" />
            New Webhook
          </Button>
        </div>

        {/* Webhooks List */}
        {webhooksQuery.isLoading ? (
          <div className="text-center py-12">Loading webhooks...</div>
        ) : webhooks.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-qe-ink-2">No webhooks configured</p>
          </Card>
        ) : (
          <div className="space-y-qe-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="p-qe-6">
                <div className="flex items-start justify-between gap-qe-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-qe-3 mb-qe-3">
                      <h3 className="text-qe-h3 font-700 text-qe-ink">{webhook.url}</h3>
                      {webhook.active ? (
                        <span className="flex items-center gap-qe-1 text-qe-small font-600 text-qe-signal-live">
                          <CheckCircle2 className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="text-qe-small font-600 text-qe-signal-busy">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="space-y-qe-2">
                      <p className="text-qe-small text-qe-ink-2 font-600">Events:</p>
                      <div className="flex flex-wrap gap-qe-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="px-qe-2 py-qe-1 bg-qe-surface-2 rounded text-qe-micro text-qe-ink-2"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteWebhookMutation.mutate(webhook.id)}
                    disabled={deleteWebhookMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        {showCreateDialog && (
          <Dialog
            open={showCreateDialog}
            onOpenChange={(open) => setShowCreateDialog(open)}
            title="Create Webhook"
          >
            <div className="space-y-qe-6">
              <Input
                label="Webhook URL"
                placeholder="https://example.com/webhooks"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />

              <div>
                <p className="text-qe-small font-600 text-qe-ink mb-qe-3">
                  Subscribe to events
                </p>
                <div className="space-y-qe-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <label key={event} className="flex items-center gap-qe-3">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="w-4 h-4 accent-qe-brand-500"
                      />
                      <span className="text-qe-small text-qe-ink">{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-qe-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setWebhookUrl('');
                    setSelectedEvents([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  isLoading={createWebhookMutation.isPending}
                  disabled={!webhookUrl || selectedEvents.length === 0}
                  onClick={() => createWebhookMutation.mutate()}
                >
                  Create
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </RoleGate>
  );
}
