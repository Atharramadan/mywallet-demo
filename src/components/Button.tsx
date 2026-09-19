import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100',
        {
          'bg-purple text-white shadow-soft hover:bg-purple-dark': variant === 'primary',
          'bg-surface-muted text-text dark:bg-surface-muted-dark dark:text-text-dark': variant === 'secondary',
          'bg-transparent text-text-muted hover:bg-surface-muted dark:text-text-muted-dark dark:hover:bg-surface-muted-dark':
            variant === 'ghost',
          'bg-rose text-white hover:brightness-95': variant === 'danger',
        },
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-5 py-3 text-base': size === 'md',
          'px-6 py-4 text-lg': size === 'lg',
        },
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
