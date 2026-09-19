import { useState } from 'react';
import { Mascot } from '../../components/Mascot';
import { PinPad } from '../../components/PinPad';
import { useSettingsStore } from '../../stores/settingsStore';

export function PinSetupScreen() {
  const setupPin = useSettingsStore((s) => s.setupPin);
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  function handleFirstComplete(pin: string) {
    setFirstPin(pin);
    setStage('confirm');
  }

  async function handleConfirmComplete(pin: string) {
    if (pin !== firstPin) {
      setError(true);
      setResetSignal((n) => n + 1);
      setTimeout(() => {
        setError(false);
        setStage('create');
        setFirstPin('');
      }, 500);
      return;
    }
    await setupPin(pin);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg dark:bg-bg-dark px-6 text-center">
      <Mascot mood={stage === 'confirm' ? 'thinking' : 'happy'} size={110} />
      <div>
        <h1 className="font-display text-2xl font-bold">
          {stage === 'create' ? 'Buat PIN 6 digit' : 'Konfirmasi PIN kamu'}
        </h1>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          {stage === 'create'
            ? 'PIN ini melindungi data keuanganmu'
            : error
              ? 'PIN tidak cocok, coba lagi'
              : 'Masukkan sekali lagi untuk konfirmasi'}
        </p>
      </div>
      <PinPad
        key={stage}
        onComplete={stage === 'create' ? handleFirstComplete : handleConfirmComplete}
        error={error}
        resetSignal={resetSignal}
      />
    </div>
  );
}
