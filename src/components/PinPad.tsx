import { useEffect, useState } from 'react';
import { Delete } from 'lucide-react';
import { haptic } from '../lib/haptic';

const PIN_LENGTH = 6;

export function PinPad({
  onComplete,
  error,
  resetSignal,
}: {
  onComplete: (pin: string) => void;
  error?: boolean;
  resetSignal?: number;
}) {
  const [digits, setDigits] = useState<string[]>([]);

  useEffect(() => {
    setDigits([]);
  }, [resetSignal]);

  useEffect(() => {
    if (digits.length === PIN_LENGTH) {
      const pin = digits.join('');
      onComplete(pin);
    }
  }, [digits]); // eslint-disable-line react-hooks/exhaustive-deps

  function press(d: string) {
    if (digits.length >= PIN_LENGTH) return;
    haptic.light();
    setDigits((prev) => [...prev, d]);
  }

  function backspace() {
    haptic.light();
    setDigits((prev) => prev.slice(0, -1));
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`flex gap-3 ${error ? 'animate-[shake_0.4s]' : ''}`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 w-3.5 rounded-full border-2 transition-colors"
            style={{
              borderColor: error ? '#FF8DA1' : 'var(--color-purple)',
              backgroundColor: i < digits.length ? (error ? '#FF8DA1' : 'var(--color-purple)') : 'transparent',
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-semibold bg-surface-muted dark:bg-surface-muted-dark active:scale-90 transition-transform"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => press('0')}
          className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-semibold bg-surface-muted dark:bg-surface-muted-dark active:scale-90 transition-transform"
        >
          0
        </button>
        <button
          onClick={backspace}
          aria-label="Hapus"
          className="flex h-16 w-16 items-center justify-center rounded-full text-text-muted dark:text-text-muted-dark active:scale-90 transition-transform"
        >
          <Delete size={22} />
        </button>
      </div>
    </div>
  );
}
