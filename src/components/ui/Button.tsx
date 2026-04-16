import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const getVariantClass = (variant: ButtonVariant) => {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-qe-brand-500 text-qe-surface hover:bg-qe-brand-600 shadow-qe-1 hover:shadow-qe-2',
    secondary: 'bg-qe-surface-2 text-qe-ink hover:bg-qe-line border border-qe-line',
    ghost: 'text-qe-ink hover:bg-qe-surface-2',
    danger: 'bg-qe-signal-busy text-qe-surface hover:opacity-90 shadow-qe-1',
  };
  return variants[variant];
};

const getSizeClass = (size: ButtonSize) => {
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-qe-small',
    md: 'px-6 py-3 text-qe-body',
    lg: 'px-8 py-4 text-qe-h3',
  };
  return sizes[size];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-qe-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getSizeClass(size)} ${getVariantClass(variant)} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="animate-spin mr-2">⏳</span> : null}
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export { Button };
