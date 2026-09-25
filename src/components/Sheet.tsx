import { type ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'wide';
  children: ReactNode;
  footer?: ReactNode;
}

const SIZE_MAP: Record<string, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg md:max-w-xl',
  xl: 'sm:max-w-xl md:max-w-2xl',
  '2xl': 'sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
  wide: 'sm:max-w-2xl md:max-w-3xl lg:max-w-4xl',
};

export function Sheet({ open, onClose, title, size = 'md', children, footer }: SheetProps) {
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

  const maxWidthClass = SIZE_MAP[size] || SIZE_MAP.md;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xl transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className={`relative flex flex-col w-full max-w-full ${maxWidthClass} max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-surface dark:bg-surface-dark shadow-2xl glass-edge transition-all duration-250 ease-out`}
        style={{ 
          opacity: visible ? 1 : 0, 
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)' 
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50 dark:border-border-dark/50 shrink-0">
          <h2 className="font-display text-base sm:text-lg font-bold text-text dark:text-white truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-text-muted hover:bg-surface-muted dark:text-text-muted-dark dark:hover:bg-surface-muted-dark transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overflow-x-hidden min-h-0">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 p-4 sm:px-6 py-3.5 bg-surface dark:bg-surface-dark border-t border-border/80 dark:border-border-dark/80 z-20">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
