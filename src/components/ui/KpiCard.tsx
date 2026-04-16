import React from 'react';
import { DeltaBadge } from './DeltaBadge';
import { Card } from './Card';

interface KpiCardProps {
  value: number | string;
  label: string;
  delta?: number;
  variant?: 'default' | 'live' | 'warn' | 'busy';
  unit?: string;
}

const getVariantColor = (variant: string) => {
  const colors: Record<string, string> = {
    default: 'text-qe-brand-500',
    live: 'text-qe-signal-live',
    warn: 'text-qe-signal-warn',
    busy: 'text-qe-signal-busy',
  };
  return colors[variant] || colors.default;
};

const KpiCard: React.FC<KpiCardProps> = ({
  value,
  label,
  delta,
  variant = 'default',
  unit,
}) => {
  return (
    <Card variant="elevated" className="flex flex-col justify-between min-h-32">
      <div>
        <p className="text-qe-small text-qe-ink-3 font-600 uppercase tracking-tight mb-qe-3">
          {label}
        </p>
        <div className="flex items-baseline gap-qe-3">
          <div className={`font-800 text-qe-h1 leading-tight ${getVariantColor(variant)}`}
               style={{ fontFeatureSettings: '"tnum"' }}>
            {value}
          </div>
          {unit && <span className="text-qe-body text-qe-ink-3">{unit}</span>}
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-qe-4">
          <DeltaBadge delta={delta} />
        </div>
      )}
    </Card>
  );
};

export { KpiCard };
