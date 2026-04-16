import React from 'react';
import { Card } from './Card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
  return (
    <Card variant="elevated" className="flex flex-col">
      <div className="mb-qe-6">
        <h3 className="text-qe-h3 font-600 text-qe-ink">{title}</h3>
        {subtitle && <p className="text-qe-small text-qe-ink-3 mt-qe-2">{subtitle}</p>}
      </div>
      <div className="flex-1 overflow-x-auto">
        {children}
      </div>
    </Card>
  );
};

export { ChartCard };
