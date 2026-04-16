import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-qe-12 px-qe-6 text-center">
    {icon && <div className="mb-qe-6 text-6xl opacity-20">{icon}</div>}
    <h3 className="text-qe-h3 font-600 text-qe-ink mb-qe-3">{title}</h3>
    {description && <p className="text-qe-body text-qe-ink-3 mb-qe-6 max-w-sm">{description}</p>}
    {action && <div className="mt-qe-8">{action}</div>}
  </div>
);

export { EmptyState };
