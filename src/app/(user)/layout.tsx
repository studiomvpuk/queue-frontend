'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { LogOut, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-qe-bg">
      {/* Top Navigation */}
      <nav className="bg-qe-surface border-b border-qe-line sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-qe-6 py-qe-4 flex items-center justify-between">
          <Link href="/find" className="text-qe-h2 font-800 text-qe-brand-500">
            QueueEase
          </Link>

          <div className="flex items-center gap-qe-6">
            <div className="hidden sm:flex items-center gap-qe-4">
              <span className="text-qe-small text-qe-ink-3">{user.firstName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-qe-surface border-t border-qe-line md:hidden z-40">
        <div className="flex justify-around max-w-4xl mx-auto">
          <Link
            href="/find"
            className="flex-1 flex items-center justify-center gap-qe-2 px-qe-4 py-qe-4 text-qe-small font-600 text-qe-ink-2 hover:text-qe-brand-500 transition"
          >
            <MapPin className="w-5 h-5" />
            <span className="hidden sm:inline">Find</span>
          </Link>
          <Link
            href="/me/bookings"
            className="flex-1 flex items-center justify-center gap-qe-2 px-qe-4 py-qe-4 text-qe-small font-600 text-qe-ink-2 hover:text-qe-brand-500 transition"
          >
            <Ticket className="w-5 h-5" />
            <span className="hidden sm:inline">Bookings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-qe-6 py-qe-8 pb-24 md:pb-qe-8">
        {children}
      </main>

      <PwaInstallPrompt />
    </div>
  );
}
