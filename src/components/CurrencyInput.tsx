import { useState, useEffect } from 'react';
import { haptic } from '../lib/haptic';

export function CurrencyInput({
  value,
  onChange,
  autoFocus,
  placeholder = '0',
}: {
  value: number;
  onChange: (value: number) => void;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [display, setDisplay] = useState(value ? value.toLocaleString('id-ID') : '');

  useEffect(() => {
    setDisplay(value ? value.toLocaleString('id-ID') : '');
  }, [value]);

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, '');
    const num = digits ? parseInt(digits, 10) : 0;
    setDisplay(num ? num.toLocaleString('id-ID') : '');
    onChange(num);
    haptic.light();
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3.5">
      <span className="font-display text-xl font-semibold text-text-muted dark:text-text-muted-dark">Rp</span>
      <input
        type="text"
        inputMode="numeric"
        autoFocus={autoFocus}
        value={display}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-transparent font-display text-xl font-semibold tabular-nums outline-none placeholder:text-text-muted/50"
      />
    </div>
  );
}
