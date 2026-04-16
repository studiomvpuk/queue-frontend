import React from 'react';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  onRemove?: () => void;
}

const getVariantClass = (variant: string) => {
  const variants: Record<string, string> = {
    default: 'bg-qe-brand-100 text-qe-brand-500',
    success: 'bg-qe-signal-live bg-opacity-10 text-qe-signal-live',
    warning: 'bg-qe-signal-warn bg-opacity-10 text-qe-signal-warn',
    danger: 'bg-qe-signal-busy bg-opacity-10 text-qe-signal-busy',
  };
  return variants[variant] || variants.default;
};

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className = '', variant = 'default', onRemove, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center gap-qe-2 px-qe-3 py-qe-2 rounded-qe-pill text-qe-small font-medium ${getVariantClass(variant)} ${className}`}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-qe-1 text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </div>
  )
);

Chip.displayName = 'Chip';

export { Chip };
