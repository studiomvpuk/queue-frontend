import React from 'react';
import { Booking } from '@/types/api';
import { Card, StatusPill, Avatar } from '@/components/ui';

// StatusPill only renders the post-booking lifecycle states. PENDING is a
// hold-state used by Phase 3 payment flows and SERVING collapses into ARRIVED
// for display purposes here.
type DisplayStatus = 'CONFIRMED' | 'ARRIVED' | 'SERVED' | 'NO_SHOW' | 'CANCELLED';
const toDisplayStatus = (s: Booking['status']): DisplayStatus => {
  if (s === 'PENDING') return 'CONFIRMED';
  if (s === 'SERVING') return 'ARRIVED';
  return s;
};

interface QueueCardProps {
  booking: Booking;
  position?: number;
  draggable?: boolean;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const isWalkIn = (b: Booking) => b.source === 'WALK_IN';

const displayName = (b: Booking): string => {
  if (isWalkIn(b)) return b.walkInName?.trim() || 'Walk-in';
  return b.user?.firstName ?? 'Customer';
};

const displayPhone = (b: Booking): string | undefined => {
  return isWalkIn(b) ? b.walkInPhone ?? undefined : b.user?.phone;
};

const QueueCard: React.FC<QueueCardProps> = ({ booking, position, draggable }) => {
  const name = displayName(booking);
  const phone = displayPhone(booking);
  const walkIn = isWalkIn(booking);

  return (
    <Card
      className={`cursor-move hover:shadow-qe-2 transition-shadow ${
        draggable ? 'opacity-90 scale-95' : ''
      }`}
      draggable
    >
      <div className="flex items-start justify-between gap-qe-4">
        <div className="flex items-start gap-qe-4 flex-1">
          <Avatar
            initials={getInitials(name)}
            size="md"
            variant={walkIn ? 'warn' : 'default'}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-qe-2">
              <p className="font-600 text-qe-ink truncate">{name}</p>
              {walkIn && (
                <span className="text-qe-micro font-600 px-qe-2 py-qe-1 rounded-qe-sm bg-qe-signal-warn text-qe-surface uppercase tracking-wide">
                  Walk-in
                </span>
              )}
            </div>
            {phone && <p className="text-qe-small text-qe-ink-3">{phone}</p>}
            <p className="text-qe-small text-qe-ink-3">Code {booking.code}</p>
            {position !== undefined && (
              <p className="text-qe-small font-500 text-qe-brand-500 mt-qe-2">
                Position #{position + 1}
              </p>
            )}
          </div>
        </div>
        <StatusPill status={toDisplayStatus(booking.status)} />
      </div>
      <p className="text-qe-micro text-qe-ink-3 mt-qe-4">
        {new Date(booking.slotStart).toLocaleTimeString()}
      </p>
    </Card>
  );
};

export { QueueCard };
