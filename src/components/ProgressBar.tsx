import clsx from 'clsx';

export function ProgressBar({
  percentage,
  color = 'var(--color-purple)',
  height = 10,
  className,
}: {
  percentage: number;
  color?: string;
  height?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <div
      className={clsx('w-full rounded-pill bg-surface-muted dark:bg-surface-muted-dark overflow-hidden', className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-pill transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
