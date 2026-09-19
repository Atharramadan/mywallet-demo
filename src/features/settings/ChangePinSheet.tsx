import { useState, useEffect } from 'react';
import { Sheet } from '../../components/Sheet';
import { PinPad } from '../../components/PinPad';
import { useSettingsStore } from '../../stores/settingsStore';
import { useToastStore } from '../../stores/toastStore';

type Stage = 'verify' | 'create' | 'confirm';

export function ChangePinSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const verifyAndUnlock = useSettingsStore((s) => s.verifyAndUnlock);
  const changePin = useSettingsStore((s) => s.changePin);
  const settings = useSettingsStore((s) => s.settings);
  const showToast = useToastStore((s) => s.show);

  const isPinEnabled = !!settings?.pinHash;

  const [stage, setStage] = useState<Stage>('verify');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    if (open) {
      setStage(isPinEnabled ? 'verify' : 'create');
      setNewPin('');
      setError(false);
    }
  }, [open, isPinEnabled]);

  function handleClose() {
    onClose();
  }

  async function handleVerify(pin: string) {
    const ok = await verifyAndUnlock(pin);
    if (!ok) {
      setError(true);
      setResetSignal((n) => n + 1);
      setTimeout(() => setError(false), 500);
      return;
    }
    setStage('create');
  }

  function handleCreate(pin: string) {
    setNewPin(pin);
    setStage('confirm');
  }

  async function handleConfirm(pin: string) {
    if (pin !== newPin) {
      setError(true);
      setResetSignal((n) => n + 1);
      setTimeout(() => {
        setError(false);
        setStage('create');
      }, 500);
      return;
    }
    await changePin(pin);
    showToast('PIN berhasil diubah', 'success');
    handleClose();
  }

  const titles: Record<Stage, string> = {
    verify: 'Masukkan PIN Lama',
    create: 'Buat PIN Baru',
    confirm: 'Konfirmasi PIN Baru',
  };

  return (
    <Sheet open={open} onClose={handleClose} title={titles[stage]}>
      <div className="flex flex-col items-center gap-6 py-4">
        {error && (
          <p className="text-sm text-rose">
            {stage === 'verify' ? 'PIN salah, coba lagi' : 'PIN tidak cocok, coba lagi'}
          </p>
        )}
        <PinPad
          key={stage}
          error={error}
          resetSignal={resetSignal}
          onComplete={stage === 'verify' ? handleVerify : stage === 'create' ? handleCreate : handleConfirm}
        />
      </div>
    </Sheet>
  );
}
