import { ICON_CHOICES, AppIcon } from '../lib/icons';
import clsx from 'clsx';

export function IconPicker({
  value,
  onChange,
  color = '#7C6FE0',
}: {
  value: string;
  onChange: (icon: string) => void;
  color?: string;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ICON_CHOICES.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onChange(icon)}
          className={clsx(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-all',
            value === icon
              ? 'ring-2 ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark'
              : 'bg-surface-muted dark:bg-surface-muted-dark hover:opacity-80'
          )}
          style={
            value === icon
              ? { backgroundColor: `${color}22`, boxShadow: `0 0 0 2px ${color}` }
              : undefined
          }
        >
          <AppIcon name={icon} size={20} style={{ color: value === icon ? color : undefined }} />
        </button>
      ))}
    </div>
  );
}
