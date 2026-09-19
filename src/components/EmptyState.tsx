import { type ReactNode } from 'react';
import { Mascot } from './Mascot';

export function EmptyState({
  title,
  description,
  mood = 'idle',
  action,
}: {
  title: string;
  description?: string;
  mood?: 'happy' | 'idle' | 'excited' | 'thinking' | 'sleepy';
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Mascot mood={mood} size={88} />
      <h3 className="font-display text-base font-semibold">{title}</h3>
      {description && (
        <p className="max-w-[220px] text-sm text-text-muted dark:text-text-muted-dark">{description}</p>
      )}
      {action}
    </div>
  );
}
