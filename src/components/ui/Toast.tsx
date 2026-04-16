import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as unknown as React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
  }
>;

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration?: number;
}

interface ToastStyle { bg: string; text: string; icon: string }
const TOAST_STYLES: Record<string, ToastStyle> = {
  success: { bg: 'bg-qe-signal-live', text: 'text-qe-surface', icon: '✓' },
  error:   { bg: 'bg-qe-signal-busy', text: 'text-qe-surface', icon: '✕' },
  info:    { bg: 'bg-qe-brand-500',   text: 'text-qe-surface', icon: 'ℹ' },
  warning: { bg: 'bg-qe-signal-warn', text: 'text-qe-ink',     icon: '⚠' },
};
const TOAST_FALLBACK: ToastStyle = TOAST_STYLES.info!;

const getTypeStyles = (type: string): ToastStyle => TOAST_STYLES[type] ?? TOAST_FALLBACK;

const Toast: React.FC<ToastProps> = ({ message, type = 'info', open, onOpenChange, duration = 4000 }) => {
  React.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onOpenChange(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onOpenChange]);

  const { bg, text, icon } = getTypeStyles(type);

  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-qe-6 right-qe-6 flex items-center gap-qe-3 px-qe-6 py-qe-4 rounded-qe-md shadow-qe-2 ${bg} ${text} font-medium z-50`}
        >
          <span className="text-lg">{icon}</span>
          {message}
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export { Toast };
