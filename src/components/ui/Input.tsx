import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-qe-small font-medium text-qe-ink mb-qe-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-qe-4 py-qe-3 rounded-qe-md border border-qe-line bg-qe-surface text-qe-ink placeholder-qe-ink-3 focus:outline-none focus:ring-2 focus:ring-qe-brand-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-qe-signal-busy' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-qe-micro text-qe-signal-busy mt-qe-2">{error}</p>}
        {hint && !error && <p className="text-qe-micro text-qe-ink-3 mt-qe-2">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
