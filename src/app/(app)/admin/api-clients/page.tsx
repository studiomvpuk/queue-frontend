'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, Button, Input, Dialog } from '@/components/ui';
import { ApiClient, ApiClientCreateResponse, ApiResponse } from '@/types/api';
import { Copy, Trash2, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import RoleGate from '@/components/RoleGate';

export default function ApiClientsPage() {
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newClientSecret, setNewClientSecret] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [copied, setCopied] = useState(false);

  const clientsQuery = useQuery({
    queryKey: ['api-clients'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ApiClient[]>>('/admin/api-clients');
      return response.data.data;
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<ApiResponse<ApiClientCreateResponse>>(
        '/admin/api-clients',
        {
          name: clientName,
          scopes: ['read:locations', 'create:bookings', 'read:webhooks'],
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      setNewClientSecret(data.clientSecret);
      queryClient.invalidateQueries({ queryKey: ['api-clients'] });
      setClientName('');
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await api.delete(`/admin/api-clients/${clientId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-clients'] });
    },
  });

  const handleCopySecret = () => {
    if (newClientSecret) {
      navigator.clipboard.writeText(newClientSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clients = clientsQuery.data ?? [];

  return (
    <RoleGate role="ADMIN" fallback={<div className="text-center py-12">Admin only</div>}>
      <div className="space-y-qe-8">
        <div className="flex items-center justify-between">
          <div className="space-y-qe-2">
            <h1 className="text-qe-h1 font-800 text-qe-ink">API Clients</h1>
            <p className="text-qe-body text-qe-ink-2">Manage third-party integrations</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-qe-2"
          >
            <Plus className="w-4 h-4" />
            New Client
          </Button>
        </div>

        {/* Secret Display */}
        {newClientSecret && (
          <Card className="p-qe-6 bg-qe-note-butter border-2 border-qe-signal-warn space-y-qe-4">
            <div className="flex items-start gap-qe-3">
              <AlertCircle className="w-5 h-5 text-qe-signal-warn flex-shrink-0 mt-qe-1" />
              <div className="flex-1">
                <p className="font-700 text-qe-ink">Save your client secret now</p>
                <p className="text-qe-small text-qe-ink-2 mt-qe-2">
                  You won't be able to see this again. Store it securely.
                </p>
              </div>
            </div>

            <div className="bg-qe-surface p-qe-4 rounded-qe-md font-mono text-qe-small text-qe-ink break-all">
              {newClientSecret}
            </div>

            <div className="flex gap-qe-3">
              <Button
                variant="primary"
                className="flex items-center gap-qe-2"
                onClick={handleCopySecret}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy secret
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setNewClientSecret(null)}
              >
                Done
              </Button>
            </div>
          </Card>
        )}

        {/* Clients List */}
        {clientsQuery.isLoading ? (
          <div className="text-center py-12">Loading clients...</div>
        ) : clients.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-qe-ink-2">No API clients yet</p>
          </Card>
        ) : (
          <div className="space-y-qe-4">
            {clients.map((client) => (
              <Card key={client.id} className="flex items-start justify-between p-qe-6">
                <div className="flex-1">
                  <h3 className="text-qe-h3 font-700 text-qe-ink">{client.name}</h3>
                  <p className="text-qe-small text-qe-ink-2 mt-qe-2 font-mono break-all">
                    {client.clientId}
                  </p>
                  <div className="flex gap-qe-2 mt-qe-3">
                    {client.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-qe-2 py-qe-1 bg-qe-surface-2 rounded text-qe-micro text-qe-ink-2"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteClientMutation.mutate(client.id)}
                  disabled={deleteClientMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        {showCreateDialog && (
          <Dialog
            open={showCreateDialog}
            onOpenChange={(open) => setShowCreateDialog(open)}
            title="Create API Client"
          >
            <div className="space-y-qe-6">
              <Input
                label="Client Name"
                placeholder="e.g. Mobile App"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />

              <div className="flex gap-qe-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setClientName('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  isLoading={createClientMutation.isPending}
                  disabled={!clientName}
                  onClick={() => createClientMutation.mutate()}
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
