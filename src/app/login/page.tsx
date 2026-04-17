'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/lib/store/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { ApiResponse, AuthResponse } from '@/types/api';
import { Eye, EyeOff } from 'lucide-react';

// ── Schemas ──

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, tokens } = response.data.data;
      setAuth(user, tokens);
      router.push('/app/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(typeof msg === 'string' ? msg : 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-qe-bg flex items-center justify-center px-qe-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-qe-10">
          <h1 className="text-qe-h1 font-800 text-qe-brand-500 mb-qe-2">QueueEase</h1>
          <p className="text-qe-body text-qe-ink-3">Business Portal</p>
        </div>

        <Card className="p-qe-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-qe-5">
            <div>
              <h2 className="text-qe-h2 font-bold text-qe-ink mb-qe-1">Welcome back</h2>
              <p className="text-qe-small text-qe-ink-3">Log in to manage your queue</p>
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@business.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
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

            {error && (
              <p className="text-qe-small text-qe-signal-busy">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Log in
            </Button>
          </form>
        </Card>

        {/* Register link */}
        <p className="text-qe-small text-qe-ink-3 text-center mt-qe-8">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-qe-brand-500 font-medium hover:underline"
          >
            Register your business
          </button>
        </p>
      </div>
    </div>
  );
}
