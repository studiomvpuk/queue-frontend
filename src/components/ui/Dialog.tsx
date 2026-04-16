import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// framer-motion v11 type defs ship a stricter `motion.div` signature
// that complains about `className`/`onClick` even though they're valid
// at runtime. We alias once to a permissive prop type to keep the call
// sites clean.
const MotionDiv = motion.div as unknown as React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
  }
>;

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, title, children, actions }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-qe-ink bg-opacity-40 z-40"
          />
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-qe-surface rounded-qe-xl shadow-qe-3 p-qe-8">
              <h2 className="text-qe-h2 font-700 text-qe-ink mb-qe-6">{title}</h2>
              <div className="text-qe-body text-qe-ink-2 mb-qe-8">{children}</div>
              {actions && <div className="flex gap-qe-4 justify-end">{actions}</div>}
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export { Dialog };
