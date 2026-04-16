import React from 'react';

interface HeroNumberProps {
  number: number | string;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'brand-500' | 'live' | 'warn' | 'busy';
}

const getVariantColor = (variant: string) => {
  const colors: Record<string, string> = {
    default: 'text-qe-brand-500',
    'brand-500': 'text-qe-brand-500',
    live: 'text-qe-signal-live',
    warn: 'text-qe-signal-warn',
    busy: 'text-qe-signal-busy',
  };
  return colors[variant] || colors.default;
};

const HeroNumber: React.FC<HeroNumberProps> = ({ number, label, sublabel, variant = 'default' }) => (
  <div className="flex flex-col items-center text-center">
    <div
      className={`font-800 text-qe-display leading-tight ${getVariantColor(variant)}`}
      style={{ fontFeatureSettings: '"tnum"' }}
    >
      {number}
    </div>
    <p className="text-qe-h3 text-qe-ink mt-qe-4 font-600">{label}</p>
    {sublabel && <p className="text-qe-small text-qe-ink-3 mt-qe-2">{sublabel}</p>}
  </div>
);

export { HeroNumber };
