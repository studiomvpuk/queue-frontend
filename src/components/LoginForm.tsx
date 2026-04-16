'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';
import { Button, Input, Card } from '@/components/ui';
import { ApiResponse, AuthResponse } from '@/types/api';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  firstName: z.string().optional(),
});

type PhoneInput = z.infer<typeof phoneSchema>;
type OtpInput = z.infer<typeof otpSchema>;

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const phoneForm = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  });

  const handlePhoneSubmit = async (data: PhoneInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<ApiResponse<{ expiresAt: string }>>('/auth/otp/request', {
        phone: data.phone,
      });
      setPhone(data.phone);
      setExpiresAt(response.data.data.expiresAt);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: OtpInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/otp/verify', {
        phone,
        otp: data.otp,
        firstName: data.firstName,
      });
      const { user, tokens } = response.data.data;
      setAuth(user, tokens);
      onSuccess();
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      {step === 'phone' ? (
        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-qe-6">
          <div>
            <h2 className="text-qe-h2 font-700 text-qe-ink mb-qe-2">Welcome to QueueEase</h2>
            <p className="text-qe-body text-qe-ink-3">Sign in with your phone number</p>
          </div>

          <Input
            {...phoneForm.register('phone')}
            type="tel"
            placeholder="+234 808 000 0000"
            label="Phone Number"
            error={phoneForm.formState.errors.phone?.message}
          />

          {error && <p className="text-qe-small text-qe-signal-busy">{error}</p>}

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-qe-6">
          <div>
            <h2 className="text-qe-h2 font-700 text-qe-ink mb-qe-2">Verify OTP</h2>
            <p className="text-qe-body text-qe-ink-3">Enter the 6-digit code sent to {phone}</p>
          </div>

          <Input
            {...otpForm.register('otp')}
            type="text"
            placeholder="000000"
            label="One-Time Password"
            maxLength={6}
            error={otpForm.formState.errors.otp?.message}
          />

          <Input
            {...otpForm.register('firstName')}
            type="text"
            placeholder="John (optional)"
            label="First Name (if new user)"
          />

          {error && <p className="text-qe-small text-qe-signal-busy">{error}</p>}

          <div className="flex gap-qe-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStep('phone');
                setError(null);
              }}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
              Verify
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export { LoginForm };
