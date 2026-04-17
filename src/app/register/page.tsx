'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// ── Enums ──

const BUSINESS_SIZES = [
  { value: 'INDIVIDUAL', label: 'Individual', description: 'Solo practitioner' },
  { value: 'SME', label: 'SME', description: '2–500 staff' },
  { value: 'ENTERPRISE', label: 'Enterprise', description: '500+ staff' },
] as const;

const BUSINESS_TYPES = [
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'LIMITED_LIABILITY', label: 'Limited Liability Company' },
  { value: 'NGO', label: 'NGO / Non-Profit' },
  { value: 'GOVERNMENT', label: 'Government Agency' },
  { value: 'HOSPITAL', label: 'Hospital / Healthcare' },
  { value: 'EDUCATIONAL', label: 'Educational Institution' },
  { value: 'OTHER', label: 'Other' },
] as const;

const BUSINESS_CATEGORIES = [
  { value: 'BANK', label: 'Bank / Financial Services' },
  { value: 'HOSPITAL', label: 'Hospital / Clinic' },
  { value: 'GOVERNMENT', label: 'Government Office' },
  { value: 'SALON', label: 'Salon / Barbershop' },
  { value: 'TELECOM', label: 'Telecom / Service Centre' },
  { value: 'OTHER', label: 'Other' },
] as const;

// ── Validation ──

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().min(2, 'Business name is required').max(120),
  size: z.enum(['INDIVIDUAL', 'SME', 'ENTERPRISE']),

  // SME / Enterprise only — validated conditionally
  type: z.string().optional(),
  category: z.string().optional(),
  cacNumber: z.string().optional(),
}).refine(
  (data) => {
    if (data.size !== 'INDIVIDUAL' && !data.type) return false;
    return true;
  },
  { message: 'Please select a business type', path: ['type'] }
).refine(
  (data) => {
    if (data.size !== 'INDIVIDUAL' && !data.category) return false;
    return true;
  },
  { message: 'Please select an industry', path: ['category'] }
).refine(
  (data) => {
    if (data.size !== 'INDIVIDUAL' && (!data.cacNumber || data.cacNumber.length < 3)) return false;
    return true;
  },
  { message: 'CAC Registration Number is required', path: ['cacNumber'] }
);

type RegisterForm = z.infer<typeof registerSchema>;

// ── Select Component ──

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-qe-small font-medium text-qe-ink mb-qe-2">{label}</label>
      )}
      <select
        ref={ref}
        className={`w-full px-qe-4 py-qe-3 rounded-qe-md border bg-qe-surface text-qe-ink focus:outline-none focus:ring-2 focus:ring-qe-brand-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-qe-signal-busy' : 'border-qe-line'
        } ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-qe-micro text-qe-signal-busy mt-qe-2">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

// ── Main Page ──

export default function RegisterBusinessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { size: 'INDIVIDUAL', type: '', category: '', cacNumber: '' },
  });

  const selectedSize = watch('size');
  const showOrgFields = selectedSize === 'SME' || selectedSize === 'ENTERPRISE';

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setApiError('');

      // Strip empty optional fields
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
      );

      await api.post('/businesses/register', payload);
      setIsSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong. Please try again.';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Success ──
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-qe-bg flex items-center justify-center px-qe-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-qe-note-mint flex items-center justify-center mx-auto mb-qe-6">
            <CheckCircle className="w-8 h-8 text-qe-signal-live" />
          </div>
          <h1 className="text-qe-h2 font-bold text-qe-ink mb-qe-3">You're all set!</h1>
          <p className="text-qe-body text-qe-ink-2 mb-qe-8">
            Your account has been created. Log in to set up your first location and start managing your queue.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-qe-bg flex items-center justify-center px-qe-6 py-qe-10">
      <div className="w-full max-w-md">
        {/* Back link */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-qe-2 text-qe-ink-3 hover:text-qe-ink transition-colors mb-qe-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-qe-small">Back</span>
        </button>

        {/* Header */}
        <div className="mb-qe-8">
          <h1 className="text-qe-h1 font-bold text-qe-ink mb-qe-2">Create your account</h1>
          <p className="text-qe-body text-qe-ink-3">
            Get started with QueueEase in under a minute.
          </p>
        </div>

        {apiError && (
          <div className="mb-qe-6 p-qe-4 rounded-qe-md bg-qe-note-blush border border-qe-signal-busy/20">
            <p className="text-qe-small text-qe-signal-busy">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-qe-5">
          {/* Size selector */}
          <div>
            <label className="block text-qe-small font-medium text-qe-ink mb-qe-3">
              I am...
            </label>
            <div className="grid grid-cols-3 gap-qe-3">
              {BUSINESS_SIZES.map((s) => (
                <label
                  key={s.value}
                  className={`flex flex-col items-center p-qe-3 rounded-qe-md border-2 cursor-pointer transition-all duration-200 text-center ${
                    selectedSize === s.value
                      ? 'border-qe-brand-500 bg-qe-brand-100'
                      : 'border-qe-line bg-qe-surface hover:border-qe-ink-3'
                  }`}
                >
                  <input type="radio" value={s.value} className="sr-only" {...register('size')} />
                  <span className={`text-qe-body font-semibold ${
                    selectedSize === s.value ? 'text-qe-brand-500' : 'text-qe-ink'
                  }`}>
                    {s.label}
                  </span>
                  <span className="text-qe-micro text-qe-ink-3 mt-qe-1">{s.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="you@business.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-qe-4 top-[38px] text-qe-ink-3 hover:text-qe-ink"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Business Name */}
          <Input
            label={selectedSize === 'INDIVIDUAL' ? 'Your name or business name' : 'Business name'}
            placeholder={selectedSize === 'INDIVIDUAL' ? 'e.g. Dr. Tolu Adeyemi' : 'e.g. Acme Hospital'}
            error={errors.businessName?.message}
            {...register('businessName')}
          />

          {/* SME / Enterprise extra fields */}
          {showOrgFields && (
            <div className="flex flex-col gap-qe-5 pt-qe-2 border-t border-qe-line">
              <div className="grid grid-cols-2 gap-qe-4">
                <Select
                  label="Business Type"
                  error={errors.type?.message}
                  options={BUSINESS_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                  {...register('type')}
                />
                <Select
                  label="Industry"
                  error={errors.category?.message}
                  options={BUSINESS_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                  {...register('category')}
                />
              </div>
              <Input
                label="CAC Registration Number"
                placeholder="e.g. RC-123456"
                error={errors.cacNumber?.message}
                {...register('cacNumber')}
              />
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-qe-2"
            isLoading={isLoading}
          >
            Create Account
          </Button>

          <p className="text-qe-micro text-qe-ink-3 text-center">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        {/* Login link */}
        <p className="text-qe-small text-qe-ink-3 text-center mt-qe-8">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-qe-brand-500 font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
