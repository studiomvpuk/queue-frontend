import React from 'react';

interface StatusPillProps {
  status: 'CONFIRMED' | 'ARRIVED' | 'SERVED' | 'NO_SHOW' | 'CANCELLED';
}

interface StatusStyle { bg: string; text: string; icon: string }

const STATUS_COLORS: Record<string, StatusStyle> = {
  CONFIRMED: { bg: 'bg-qe-signal-live bg-opacity-10', text: 'text-qe-signal-live', icon: '●' },
  ARRIVED:   { bg: 'bg-qe-brand-100',                  text: 'text-qe-brand-500',  icon: '→' },
  SERVED:    { bg: 'bg-qe-signal-live bg-opacity-20',  text: 'text-qe-signal-live', icon: '✓' },
  NO_SHOW:   { bg: 'bg-qe-signal-busy bg-opacity-10',  text: 'text-qe-signal-busy', icon: '✕' },
  CANCELLED: { bg: 'bg-qe-ink-3 bg-opacity-10',        text: 'text-qe-ink-3',       icon: '⊘' },
};
const FALLBACK: StatusStyle = STATUS_COLORS.CONFIRMED!;

const getStatusColor = (status: string): StatusStyle => STATUS_COLORS[status] ?? FALLBACK;

const getLabel = (status: string) => {
  const labels: Record<string, string> = {
    CONFIRMED: 'Confirmed',
    ARRIVED: 'Arrived',
    SERVED: 'Served',
    NO_SHOW: 'No Show',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || status;
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const { bg, text, icon } = getStatusColor(status);

  return (
    <span className={`inline-flex items-center gap-qe-2 px-qe-3 py-qe-2 rounded-qe-pill text-qe-small font-medium ${bg} ${text}`}>
      <span>{icon}</span>
      {getLabel(status)}
    </span>
  );
};

export { StatusPill };
