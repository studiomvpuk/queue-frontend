import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DeltaBadgeProps {
  delta: number;
  showIcon?: boolean;
}

const DeltaBadge: React.FC<DeltaBadgeProps> = ({ delta, showIcon = true }) => {
  const isPositive = delta >= 0;
  const bgColor = isPositive ? 'bg-qe-signal-live/10' : 'bg-qe-signal-busy/10';
  const textColor = isPositive ? 'text-qe-signal-live' : 'text-qe-signal-busy';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`inline-flex items-center gap-qe-2 px-qe-3 py-qe-2 rounded-qe-sm ${bgColor}`}>
      {showIcon && <Icon className={`w-3 h-3 ${textColor}`} />}
      <span className={`text-qe-small font-600 ${textColor}`}
            style={{ fontFeatureSettings: '"tnum"' }}>
        {isPositive ? '+' : ''}{delta.toFixed(1)}%
      </span>
    </div>
  );
};

export { DeltaBadge };
