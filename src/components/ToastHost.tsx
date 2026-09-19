import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useToastStore } from '../stores/toastStore';

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-2xl bg-surface dark:bg-surface-dark px-4 py-3 card-shadow animate-[toast-in_0.25s_ease-out]"
        >
          {t.variant === 'success' && <CheckCircle2 size={18} className="text-mint shrink-0" />}
          {t.variant === 'error' && <XCircle size={18} className="text-rose shrink-0" />}
          {t.variant === 'info' && <Info size={18} className="text-blue shrink-0" />}
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
