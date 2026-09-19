import { type ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="relative flex flex-col w-full max-w-full sm:max-w-md max-h-[85vh] overflow-hidden rounded-3xl bg-surface dark:bg-surface-dark shadow-2xl glass-edge transition-all duration-250 ease-out"
        style={{ 
          opacity: visible ? 1 : 0, 
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)' 
        }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50 dark:border-border-dark/50 shrink-0">
          <h2 className="font-display text-lg font-bold text-text dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-text-muted hover:bg-surface-muted dark:text-text-muted-dark dark:hover:bg-surface-muted-dark transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
