'use client';

import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-qe-4 right-qe-4 bg-qe-surface shadow-qe-3 rounded-qe-lg p-qe-4 max-w-sm border border-qe-line z-50">
      <div className="flex items-start justify-between gap-qe-4">
        <div className="flex items-start gap-qe-3 flex-1">
          <Download className="w-5 h-5 text-qe-brand-500 flex-shrink-0 mt-qe-1" />
          <div>
            <p className="text-qe-body font-600 text-qe-ink">Add to home screen</p>
            <p className="text-qe-small text-qe-ink-2 mt-qe-1">
              Get quick access to your bookings and tickets.
            </p>
            <button
              onClick={handleInstall}
              className="mt-qe-3 px-qe-4 py-qe-2 bg-qe-brand-500 text-qe-surface rounded-qe-md text-qe-small font-600 hover:bg-qe-brand-600 transition"
            >
              Install
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-qe-ink-3 hover:text-qe-ink transition flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
