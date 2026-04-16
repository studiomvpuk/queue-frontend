'use client';

import React from 'react';

interface TimeSlot {
  time: string;
  available: boolean;
  isPriority?: boolean;
}

interface SlotPickerGridProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  disabled?: boolean;
}

export default function SlotPickerGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  disabled = false,
}: SlotPickerGridProps) {
  return (
    <div className="space-y-qe-4">
      <div className="grid grid-cols-3 gap-qe-3 md:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => onSelectSlot(slot.time)}
            disabled={!slot.available || disabled}
            className={`
              p-qe-3 rounded-qe-md text-qe-small font-600 transition
              ${
                selectedSlot === slot.time
                  ? 'bg-qe-brand-500 text-qe-surface shadow-qe-2'
                  : slot.available
                    ? 'bg-qe-surface-2 text-qe-ink hover:bg-qe-line cursor-pointer border border-transparent'
                    : 'bg-qe-surface-2 text-qe-ink-3 opacity-50 cursor-not-allowed border border-qe-line'
              }
            `}
          >
            <div>{slot.time}</div>
            {slot.isPriority && (
              <div className="text-qe-micro text-qe-signal-warn mt-qe-1">Priority</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
