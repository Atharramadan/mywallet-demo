import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-card bg-surface dark:bg-surface-dark card-shadow',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
