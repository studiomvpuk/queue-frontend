'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { useActiveLocationStore } from '@/lib/store/active-location';
import { initSocket } from '@/lib/socket';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui';
import { LogOut, Menu, ChevronDown, LayoutDashboard, Settings, MessageSquare, Building2, BarChart3, Code2, Webhook } from 'lucide-react';
import { ApiResponse } from '@/types/api';
import RoleGate from '@/components/RoleGate';

interface Location {
  id: string;
  name: string;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { activeLocationId, setActiveLocation } = useActiveLocationStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showLocationMenu, setShowLocationMenu] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      initSocket();
    }
  }, [isAuthenticated, router]);

  // Fetch locations
  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{ locations: Location[]; nextCursor: string | null }>
      >('/locations');
      return response.data.data.locations;
    },
    enabled: isAuthenticated,
  });

  const locations = locationsQuery.data ?? [];

  // Auto-select first location
  useEffect(() => {
    const first = locations[0];
    if (first && !activeLocationId) {
      setActiveLocation(first.id);
    }
  }, [locations, activeLocationId, setActiveLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Reviews', href: '/reviews', icon: MessageSquare },
    { label: 'Business', href: '/business', icon: Building2 },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Config', href: '/config', icon: Settings },
  ];

  const adminItems = [
    { label: 'API Clients', href: '/admin/api-clients', icon: Code2 },
    { label: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-qe-bg">
      {/* Top Navigation */}
      <nav className="bg-qe-surface border-b border-qe-line sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-qe-6 py-qe-4 flex items-center justify-between">
          <div className="flex items-center gap-qe-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-qe-2 hover:bg-qe-surface-2 rounded-qe-md"
            >
              <Menu className="w-5 h-5 text-qe-ink" />
            </button>
            <h1 className="text-qe-h2 font-800 text-qe-brand-500">QueueEase</h1>
          </div>

          {/* Location Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-qe-2 px-qe-4 py-qe-2 rounded-qe-md bg-qe-surface-2 hover:bg-qe-line transition-colors"
            >
              <span className="text-qe-small font-600 text-qe-ink">
                {locations.find((l) => l.id === activeLocationId)?.name || 'Select location'}
              </span>
              <ChevronDown className="w-4 h-4 text-qe-ink-3" />
            </button>

            {showLocationMenu && locations.length > 0 && (
              <div className="absolute right-0 top-12 bg-qe-surface border border-qe-line rounded-qe-md shadow-qe-2 min-w-48 z-50">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setActiveLocation(location.id);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full px-qe-4 py-qe-3 text-left text-qe-body transition ${
                      activeLocationId === location.id
                        ? 'bg-qe-brand-100 text-qe-brand-500 font-600'
                        : 'text-qe-ink hover:bg-qe-surface-2'
                    }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-qe-6">
            <div className="hidden md:flex items-center gap-qe-4">
              <span className="text-qe-small text-qe-ink-3">{user.firstName}</span>
              <div className="w-10 h-10 rounded-full bg-qe-brand-100 text-qe-brand-500 flex items-center justify-center font-600">
                {user.firstName?.[0]}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden md:w-48 md:border-r md:border-qe-line md:block">
            <nav className="space-y-qe-1 p-qe-6">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-qe-3 px-qe-4 py-qe-3 rounded-qe-md transition ${
                    isActive(href)
                      ? 'bg-qe-brand-100 text-qe-brand-500 font-600'
                      : 'text-qe-ink-2 hover:bg-qe-surface-2'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}

              <RoleGate role="ADMIN">
                <div className="mt-qe-8 pt-qe-8 border-t border-qe-line">
                  <p className="text-qe-micro font-600 text-qe-ink-3 px-qe-4 mb-qe-3">
                    ADMIN
                  </p>
                  {adminItems.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-qe-3 px-qe-4 py-qe-3 rounded-qe-md transition ${
                        isActive(href)
                          ? 'bg-qe-brand-100 text-qe-brand-500 font-600'
                          : 'text-qe-ink-2 hover:bg-qe-surface-2'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </RoleGate>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-qe-6 py-qe-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
