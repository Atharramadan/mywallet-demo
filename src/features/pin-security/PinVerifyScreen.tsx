import { useState } from 'react';
import { Mascot } from '../../components/Mascot';
import { PinPad } from '../../components/PinPad';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAuthStore } from '../../stores/authStore';

export function PinVerifyScreen() {
  const verifyAndUnlock = useSettingsStore((s) => s.verifyAndUnlock);
  const [error, setError] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const authLogout = useAuthStore((s) => s.logout);

  async function handleComplete(pin: string) {
    const ok = await verifyAndUnlock(pin);
    if (!ok) {
      setError(true);
      setResetSignal((n) => n + 1);
      setTimeout(() => setError(false), 500);
    }
  }

  async function handleForgotPin() {
    // Jika lupa PIN, satu-satunya cara adalah logout dan login ulang dengan password yang valid
    await authLogout();
    // Setelah logout, App.tsx akan merender AuthPage secara otomatis
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg dark:bg-bg-dark px-6 text-center">
      <Mascot mood={error ? 'thinking' : 'idle'} size={110} />
      <div>
        <h1 className="font-display text-2xl font-bold">Masukkan PIN</h1>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          {error ? 'PIN salah, coba lagi' : 'Verifikasi untuk membuka MyWallet'}
        </p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <PinPad onComplete={handleComplete} error={error} resetSignal={resetSignal} />
        
        <button 
          onClick={handleForgotPin}
          className="text-sm font-semibold text-text-muted dark:text-text-muted-dark hover:text-purple transition-colors"
        >
          Lupa PIN? (Keluar Akun)
        </button>
      </div>
    </div>
  );
}
