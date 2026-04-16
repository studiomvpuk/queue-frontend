'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import {
  Building2,
  User,
  MapPin,
  FileText,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

// ── Enums matching backend ──

const BUSINESS_SIZES = [
  { value: 'INDIVIDUAL', label: 'Individual', description: 'Solo practitioner or freelancer' },
  { value: 'SME', label: 'SME', description: 'Small or medium business (2–500 staff)' },
  { value: 'ENTERPRISE', label: 'Enterprise', description: 'Large organization (500+ staff)' },
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

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// ── Validation ──

// Helper: optional string field — treats '' as undefined
const optionalString = z.string().optional().transform((v) => v || undefined);

// Helper: optional email — valid email OR empty/undefined
const optionalEmail = z
  .string()
  .optional()
  .transform((v) => v || undefined)
  .pipe(z.string().email('Please enter a valid email').optional());

// Helper: optional URL — valid URL OR empty/undefined
const optionalUrl = z
  .string()
  .optional()
  .transform((v) => v || undefined)
  .pipe(z.string().url('Please enter a valid URL (e.g. https://...)').optional());

const registerSchema = z.object({
  // Business info
  name: z.string().min(2, 'Business name is required').max(120),
  size: z.enum(['INDIVIDUAL', 'SME', 'ENTERPRISE']),
  type: z.string().min(1, 'Business type is required'),
  category: z.string().min(1, 'Category is required'),
  description: optionalString,

  // Legal
  cacNumber: optionalString,
  tinNumber: optionalString,

  // Contact person
  contactFirstName: z.string().min(2, 'First name is required'),
  contactLastName: z.string().min(2, 'Last name is required'),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
  contactRole: optionalString,

  // Business contact
  businessEmail: optionalEmail,
  businessPhone: optionalString,
  website: optionalUrl,

  // Address
  address: optionalString,
  city: optionalString,
  state: optionalString,
}).refine(
  (data) => {
    // CAC is required for SME and ENTERPRISE
    if (data.size !== 'INDIVIDUAL' && (!data.cacNumber || data.cacNumber.length < 3)) {
      return false;
    }
    return true;
  },
  {
    message: 'CAC Registration Number is required for SME and Enterprise businesses',
    path: ['cacNumber'],
  }
);

type RegisterForm = z.infer<typeof registerSchema>;

// ── Select Component ──

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
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
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-qe-micro text-qe-signal-busy mt-qe-2">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ── Section Header ──

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-qe-3 mb-qe-6">
      <div className="w-qe-10 h-qe-10 rounded-qe-md bg-qe-brand-100 flex items-center justify-center flex-shrink-0 mt-qe-1">
        <Icon className="w-5 h-5 text-qe-brand-500" />
      </div>
      <div>
        <h2 className="text-qe-h3 font-semibold text-qe-ink">{title}</h2>
        <p className="text-qe-small text-qe-ink-3 mt-qe-1">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Main Page ──

export default function RegisterBusinessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      size: 'SME',
      type: '',
      category: '',
    },
  });

  const selectedSize = watch('size');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setApiError('');

      // Zod transforms already convert '' to undefined;
      // strip undefined keys before sending to backend
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
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

  // ── Success State ──
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-qe-bg flex items-center justify-center px-qe-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-qe-note-mint flex items-center justify-center mx-auto mb-qe-6">
            <CheckCircle className="w-8 h-8 text-qe-signal-live" />
          </div>
          <h1 className="text-qe-h1 font-bold text-qe-ink mb-qe-3">
            Registration Submitted
          </h1>
          <p className="text-qe-body text-qe-ink-2 mb-qe-8">
            Thank you for registering your business with QueueEase. Our team will review your
            details and verify your account. You'll receive an email once your business is
            approved.
          </p>
          <div className="flex flex-col gap-qe-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Go to Login
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration Form ──
  return (
    <div className="min-h-screen bg-qe-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-qe-bg/80 backdrop-blur-md border-b border-qe-line">
        <div className="max-w-2xl mx-auto px-qe-6 py-qe-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-qe-2 text-qe-ink-2 hover:text-qe-ink transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-qe-small font-medium">Back</span>
          </button>
          <span className="text-qe-h3 font-bold text-qe-brand-500">QueueEase</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-qe-6 py-qe-10">
        {/* Page header */}
        <div className="mb-qe-10">
          <h1 className="text-qe-h1 font-bold text-qe-ink mb-qe-2">
            Register your business
          </h1>
          <p className="text-qe-body text-qe-ink-3">
            Join QueueEase to manage your queues, reduce wait times, and delight your customers.
            Fill in your details below and our team will verify your business.
          </p>
        </div>

        {apiError && (
          <div className="mb-qe-8 p-qe-4 rounded-qe-md bg-qe-note-blush border border-qe-signal-busy/20">
            <p className="text-qe-small text-qe-signal-busy">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-qe-12">
          {/* ─── Section 1: Business Information ─── */}
          <section>
            <SectionHeader
              icon={Building2}
              title="Business Information"
              subtitle="Tell us about your organization"
            />

            <div className="flex flex-col gap-qe-5">
              <Input
                label="Business Name"
                placeholder="e.g. Acme Hospital"
                error={errors.name?.message}
                {...register('name')}
              />

              {/* Size selector — radio cards */}
              <div>
                <label className="block text-qe-small font-medium text-qe-ink mb-qe-3">
                  Business Size
                </label>
                <div className="grid grid-cols-3 gap-qe-3">
                  {BUSINESS_SIZES.map((s) => (
                    <label
                      key={s.value}
                      className={`relative flex flex-col items-center p-qe-4 rounded-qe-md border-2 cursor-pointer transition-all duration-200 text-center ${
                        selectedSize === s.value
                          ? 'border-qe-brand-500 bg-qe-brand-100'
                          : 'border-qe-line bg-qe-surface hover:border-qe-ink-3'
                      }`}
                    >
                      <input
                        type="radio"
                        value={s.value}
                        className="sr-only"
                        {...register('size')}
                      />
                      <span
                        className={`text-qe-body font-semibold ${
                          selectedSize === s.value ? 'text-qe-brand-500' : 'text-qe-ink'
                        }`}
                      >
                        {s.label}
                      </span>
                      <span className="text-qe-micro text-qe-ink-3 mt-qe-1">{s.description}</span>
                    </label>
                  ))}
                </div>
                {errors.size && (
                  <p className="text-qe-micro text-qe-signal-busy mt-qe-2">{errors.size.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-qe-5">
                <Select
                  label="Business Type"
                  error={errors.type?.message}
                  options={BUSINESS_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                  {...register('type')}
                />
                <Select
                  label="Industry / Category"
                  error={errors.category?.message}
                  options={BUSINESS_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                  {...register('category')}
                />
              </div>

              <div>
                <label className="block text-qe-small font-medium text-qe-ink mb-qe-2">
                  Description <span className="text-qe-ink-3 font-normal">(optional)</span>
                </label>
                <textarea
                  className="w-full px-qe-4 py-qe-3 rounded-qe-md border border-qe-line bg-qe-surface text-qe-ink placeholder-qe-ink-3 focus:outline-none focus:ring-2 focus:ring-qe-brand-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Briefly describe what your business does..."
                  maxLength={500}
                  {...register('description')}
                />
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-qe-line" />

          {/* ─── Section 2: Legal & Verification ─── */}
          <section>
            <SectionHeader
              icon={FileText}
              title="Legal & Verification"
              subtitle={
                selectedSize === 'INDIVIDUAL'
                  ? 'Optional for individual practitioners'
                  : 'Required for business verification'
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-qe-5">
              <Input
                label={
                  selectedSize === 'INDIVIDUAL'
                    ? 'CAC Registration Number (optional)'
                    : 'CAC Registration Number *'
                }
                placeholder="e.g. RC-123456"
                error={errors.cacNumber?.message}
                {...register('cacNumber')}
              />
              <Input
                label="Tax Identification Number (optional)"
                placeholder="e.g. 12345678-0001"
                error={errors.tinNumber?.message}
                {...register('tinNumber')}
              />
            </div>
          </section>

          {/* Divider */}
          <hr className="border-qe-line" />

          {/* ─── Section 3: Contact Person ─── */}
          <section>
            <SectionHeader
              icon={User}
              title="Contact Person"
              subtitle="The primary person responsible for this account"
            />

            <div className="flex flex-col gap-qe-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-qe-5">
                <Input
                  label="First Name"
                  placeholder="e.g. Tolu"
                  error={errors.contactFirstName?.message}
                  {...register('contactFirstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Adeyemi"
                  error={errors.contactLastName?.message}
                  {...register('contactLastName')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-qe-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  error={errors.contactEmail?.message}
                  {...register('contactEmail')}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  error={errors.contactPhone?.message}
                  {...register('contactPhone')}
                />
              </div>

              <Input
                label="Your Role (optional)"
                placeholder="e.g. CEO, Manager, Owner"
                error={errors.contactRole?.message}
                {...register('contactRole')}
              />
            </div>
          </section>

          {/* Divider */}
          <hr className="border-qe-line" />

          {/* ─── Section 4: Business Contact & Address ─── */}
          <section>
            <SectionHeader
              icon={MapPin}
              title="Business Contact & Address"
              subtitle="How customers and our team can reach your business"
            />

            <div className="flex flex-col gap-qe-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-qe-5">
                <Input
                  label="Business Email (optional)"
                  type="email"
                  placeholder="info@company.com"
                  error={errors.businessEmail?.message}
                  {...register('businessEmail')}
                />
                <Input
                  label="Business Phone (optional)"
                  type="tel"
                  placeholder="+234 1 234 5678"
                  error={errors.businessPhone?.message}
                  {...register('businessPhone')}
                />
              </div>

              <Input
                label="Website (optional)"
                placeholder="https://yourcompany.com"
                error={errors.website?.message}
                {...register('website')}
              />

              <Input
                label="Street Address (optional)"
                placeholder="e.g. 12 Marina Road, Victoria Island"
                error={errors.address?.message}
                {...register('address')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-qe-5">
                <Input
                  label="City (optional)"
                  placeholder="e.g. Lagos"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <Select
                  label="State (optional)"
                  error={errors.state?.message}
                  options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))}
                  {...register('state')}
                />
              </div>
            </div>
          </section>

          {/* ─── Submit ─── */}
          <div className="pt-qe-4 pb-qe-12">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Submit Registration
            </Button>
            <p className="text-qe-micro text-qe-ink-3 text-center mt-qe-4">
              By registering, you agree to QueueEase's Terms of Service and Privacy Policy.
              Your business will be reviewed and verified by our team.
            </p>
          </div>
        </form>

        {/* Already have an account? */}
        <div className="text-center pb-qe-12">
          <p className="text-qe-small text-qe-ink-3">
            Already registered?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-qe-brand-500 font-medium hover:underline"
            >
              Log in to your dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
