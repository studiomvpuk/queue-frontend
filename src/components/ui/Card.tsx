import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-qe-surface rounded-qe-lg p-qe-6 ${
        variant === 'elevated' ? 'shadow-qe-2' : 'shadow-qe-1 border border-qe-line'
      } ${className}`}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export { Card };
