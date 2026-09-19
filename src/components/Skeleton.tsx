import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'icon';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-black/5 dark:bg-white/5',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent',
        {
          'rounded-2xl': variant === 'rectangular',
          'rounded-full': variant === 'circular',
          'rounded-md': variant === 'text',
          'rounded-xl': variant === 'icon',
        },
        className
      )}
    >
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
