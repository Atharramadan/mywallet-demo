import { X, DatabaseBackup, NotebookPen, PiggyBank, Crown } from 'lucide-react';
import type { Reminder } from '../domain/reminderUseCases';

const ICONS = {
  backup: DatabaseBackup,
  transaction: NotebookPen,
  goal: PiggyBank,
  wealth: Crown,
};

export function ReminderBanner({
  reminders,
  onDismiss,
}: {
  reminders: Reminder[];
  onDismiss: (id: string) => void;
}) {
  if (reminders.length === 0) return null;

  return (
    <>
      {reminders.map((r) => {
        const Icon = ICONS[r.icon];
        return (
          <div
            key={r.id}
            className="flex w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl items-start gap-3 rounded-2xl bg-surface dark:bg-surface-dark p-3.5 card-shadow border border-border dark:border-border-dark"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-peach/20">
              <Icon size={17} className="text-peach" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">{r.message}</p>
            </div>
            <button
              onClick={() => onDismiss(r.id)}
              aria-label="Tutup pengingat"
              className="shrink-0 rounded-full p-1 text-text-muted dark:text-text-muted-dark"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </>
  );
}
