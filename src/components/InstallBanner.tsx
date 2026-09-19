import { X, Download } from 'lucide-react';
import { Mascot } from './Mascot';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useSettingsStore } from '../stores/settingsStore';
import { useToastStore } from '../stores/toastStore';

export function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const settings = useSettingsStore((s) => s.settings);
  const markInstallBannerSeen = useSettingsStore((s) => s.markInstallBannerSeen);
  const markInstalled = useSettingsStore((s) => s.markInstalled);
  const showToast = useToastStore((s) => s.show);

  if (!canInstall || !settings || settings.hasSeenInstallBanner) return null;

  async function handleInstall() {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      await markInstalled();
      showToast('MyWallet berhasil diinstal!', 'success');
    }
    await markInstallBannerSeen();
  }

  return (
    <div className="flex w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl items-center gap-3 rounded-2xl bg-surface dark:bg-surface-dark p-3 card-shadow border border-border dark:border-border-dark">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple/10">
        <Mascot mood="excited" size={36} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-semibold">MyWallet</p>
        <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">
          Instal untuk pengalaman lebih ringan &amp; offline
        </p>
      </div>
      <button
        onClick={handleInstall}
        className="flex shrink-0 items-center gap-1 rounded-xl bg-purple px-3 py-2 text-xs font-semibold text-white"
      >
        <Download size={14} /> Install
      </button>
      <button
        onClick={() => markInstallBannerSeen()}
        aria-label="Tutup"
        className="shrink-0 rounded-full p-1 text-text-muted dark:text-text-muted-dark"
      >
        <X size={16} />
      </button>
    </div>
  );
}
