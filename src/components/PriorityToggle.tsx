'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface PriorityToggleProps {
  enabled: boolean;
  price: number;
  onToggle: (enabled: boolean) => void;
}

export default function PriorityToggle({ enabled, price, onToggle }: PriorityToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center justify-between p-qe-4 bg-qe-surface-2 rounded-qe-md mb-qe-6">
      <div className="flex items-center gap-qe-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="w-5 h-5 accent-qe-brand-500 cursor-pointer"
          />
          <span className="ml-qe-3 text-qe-body font-600 text-qe-ink">
            Priority slot · ₦{price}
          </span>
        </label>

        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-qe-1 text-qe-ink-3 hover:text-qe-ink transition"
          >
            <Info className="w-4 h-4" />
          </button>

          {showTooltip && (
            <div className="absolute left-0 bottom-8 bg-qe-ink text-qe-surface text-qe-small p-qe-3 rounded-qe-md whitespace-nowrap shadow-qe-3 z-10">
              Priority slots are capped at 20% of capacity. Standard slots are always guaranteed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
