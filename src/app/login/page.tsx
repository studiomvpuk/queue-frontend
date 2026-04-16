'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { useAuthStore } from '@/lib/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-qe-bg flex items-center justify-center px-qe-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-qe-12">
          <h1 className="text-qe-h1 font-800 text-qe-brand-500 mb-qe-2">QueueEase</h1>
          <p className="text-qe-body text-qe-ink-3">Reception Staff Portal</p>
        </div>
        <LoginForm
          onSuccess={() => {
            router.push('/app/dashboard');
          }}
        />
      </div>
    </div>
  );
}
