'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/auth';

interface RoleGateProps {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGate({ role, children, fallback }: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess = allowedRoles.includes(user.role);

  return <>{hasAccess ? children : fallback}</>;
}
