import React from 'react';

interface AvatarProps {
  src?: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warn' | 'danger';
}

const getSizeClass = (size: string) => {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-qe-small',
    md: 'w-12 h-12 text-qe-body',
    lg: 'w-16 h-16 text-qe-h2',
  };
  return sizes[size] || sizes.md;
};

const getVariantClass = (variant: string) => {
  const variants: Record<string, string> = {
    default: 'bg-qe-brand-100 text-qe-brand-500',
    success: 'bg-qe-signal-live bg-opacity-10 text-qe-signal-live',
    warn: 'bg-qe-signal-warn bg-opacity-10 text-qe-signal-warn',
    danger: 'bg-qe-signal-busy bg-opacity-10 text-qe-signal-busy',
  };
  return variants[variant] || variants.default;
};

const Avatar: React.FC<AvatarProps> = ({ src, initials, size = 'md', variant = 'default' }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full font-600 flex-shrink-0 ${getSizeClass(size)} ${getVariantClass(variant)}`}
  >
    {src ? (
      <img src={src} alt={initials} className="w-full h-full rounded-full object-cover" />
    ) : (
      initials.toUpperCase()
    )}
  </div>
);

export { Avatar };
