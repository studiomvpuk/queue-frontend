'use client';

import React from 'react';
import { Booking } from '@/types/api';
import { Copy, CheckCircle2 } from 'lucide-react';

interface TicketDarkProps {
  booking: Booking;
  queuePosition: number;
  totalInQueue: number;
}

export default function TicketDark({ booking, queuePosition, totalInQueue }: TicketDarkProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bookingDate = new Date(booking.slotStart);
  const estimatedWaitMinutes = Math.ceil((totalInQueue - queuePosition + 1) * 15);

  return (
    <div className="min-h-screen bg-qe-dark-bg flex items-center justify-center p-qe-4">
      <div className="w-full max-w-md bg-qe-dark-surface rounded-qe-lg p-qe-8 shadow-qe-3 border border-qe-dark-line space-y-qe-8">
        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="px-qe-4 py-qe-2 bg-qe-signal-live rounded-qe-pill text-qe-dark-ink text-qe-small font-600">
            {booking.status === 'CONFIRMED' ? 'Confirmed' : 'In Queue'}
          </div>
        </div>

        {/* Ticket Code */}
        <div className="text-center space-y-qe-4">
          <p className="text-qe-dark-ink-2 text-qe-small">Your ticket code</p>
          <div className="bg-qe-dark-surface-2 rounded-qe-md p-qe-6 font-mono text-4xl font-800 tracking-wider text-qe-dark-ink">
            {booking.id.substring(0, 8).toUpperCase()}
          </div>
          <button
            onClick={handleCopyCode}
            className="mx-auto flex items-center gap-qe-2 px-qe-4 py-qe-2 bg-qe-brand-500 hover:bg-qe-brand-600 text-qe-surface rounded-qe-md text-qe-small font-600 transition"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy code
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-qe-dark-line" />

        {/* Details */}
        <div className="space-y-qe-6">
          <div>
            <p className="text-qe-dark-ink-2 text-qe-small mb-qe-2">Location</p>
            <p className="text-qe-dark-ink text-qe-body font-600">
              {booking.user?.firstName ?? booking.walkInName ?? 'Customer'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-qe-6">
            <div>
              <p className="text-qe-dark-ink-2 text-qe-small mb-qe-2">Date & Time</p>
              <p className="text-qe-dark-ink text-qe-body font-600">
                {bookingDate.toLocaleDateString()}
              </p>
              <p className="text-qe-dark-ink text-qe-small">
                {bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="text-qe-dark-ink-2 text-qe-small mb-qe-2">Position</p>
              <p className="text-qe-dark-ink text-qe-h2 font-800">{queuePosition}</p>
              <p className="text-qe-dark-ink-2 text-qe-small">of {totalInQueue}</p>
            </div>
          </div>

          <div>
            <p className="text-qe-dark-ink-2 text-qe-small mb-qe-2">Est. wait time</p>
            <p className="text-qe-dark-ink text-qe-body font-600">~{estimatedWaitMinutes} min</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-qe-6 border-t border-qe-dark-line text-center">
          <p className="text-qe-dark-ink-2 text-qe-micro">
            You'll be notified when to arrive. Arrive on time!
          </p>
        </div>
      </div>
    </div>
  );
}
