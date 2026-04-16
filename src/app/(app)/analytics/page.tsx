'use client';

import React, { useState } from 'react';
import { useActiveLocationStore } from '@/lib/store/active-location';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { KpiCard, ChartCard, Button, EmptyState } from '@/components/ui';
import api from '@/lib/api';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  const activeLocationId = useActiveLocationStore((state) => state.activeLocationId);
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [exporting, setExporting] = useState(false);

  const analyticsQuery = useAnalytics(activeLocationId || '', range);
  const data = analyticsQuery.data;

  const handleExport = async () => {
    if (!activeLocationId) return;
    setExporting(true);
    try {
      const response = await api.get(
        `/locations/${activeLocationId}/analytics/export?range=${range}&format=csv`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${activeLocationId}-${range}.csv`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (!activeLocationId) {
    return (
      <EmptyState
        title="Select a location"
        description="Choose a location from the menu to view analytics"
      />
    );
  }

  if (analyticsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-qe-body text-qe-ink-3">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-qe-8">
      <div className="flex items-center justify-between gap-qe-4">
        <div>
          <h1 className="text-qe-h1 font-700 text-qe-ink">Analytics</h1>
          <p className="text-qe-body text-qe-ink-3 mt-qe-2">
            Location performance and trends
          </p>
        </div>
        <div className="flex items-center gap-qe-3">
          <div className="flex gap-qe-2">
            {(['7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-qe-4 py-qe-2 rounded-qe-md text-qe-small font-600 transition ${
                  range === r
                    ? 'bg-qe-brand-500 text-qe-surface'
                    : 'bg-qe-surface-2 text-qe-ink hover:bg-qe-line'
                }`}
              >
                {r === '7d' ? 'Last 7 days' : 'Last 30 days'}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="w-4 h-4 mr-qe-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-qe-6">
          <KpiCard
            value={Math.round(data.volumeByHour.reduce((sum, h) => sum + h.volume, 0))}
            label="Total Bookings"
            delta={data.wowDelta}
          />
          <KpiCard
            value={Math.round(data.serviceTime.p50)}
            label="Avg Wait Time"
            unit="min"
            variant="warn"
          />
          <KpiCard
            value={(data.noShowTrend[data.noShowTrend.length - 1]?.rate ?? 0).toFixed(1)}
            label="No-Show Rate"
            unit="%"
            variant="busy"
          />
          <KpiCard
            value={data.uniqueCustomersPerDay.reduce((sum, d) => sum + d.count, 0)}
            label="Unique Customers"
            variant="live"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-qe-6">
        {data && (
          <>
            <ChartCard title="Bookings by Hour" subtitle="Daily volume distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.volumeByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--qe-line)" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="var(--qe-brand-500)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="No-Show Trend" subtitle="Rate over time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.noShowTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--qe-line)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--qe-signal-busy)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Service Time Distribution" subtitle="p50/p90/p99">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: 'Service Time',
                      p50: data.serviceTime.p50,
                      p90: data.serviceTime.p90,
                      p99: data.serviceTime.p99,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--qe-line)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="p50" fill="var(--qe-signal-live)" />
                  <Bar dataKey="p90" fill="var(--qe-signal-warn)" />
                  <Bar dataKey="p99" fill="var(--qe-signal-busy)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Unique Customers" subtitle="Daily active customers">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.uniqueCustomersPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--qe-line)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    fill="var(--qe-brand-100)"
                    stroke="var(--qe-brand-500)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
}
