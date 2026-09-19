import { useState } from "react";
import clsx from "clsx";
import {
  Wallet,
  Tags,
  DatabaseBackup,
  Bell,
  Info,
  ChevronRight,
  User,
  Cloud,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { haptic } from "../../lib/haptic";
import { Card } from "../../components/Card";
import { Mascot } from "../../components/Mascot";
import { useSettingsStore } from "../../stores/settingsStore";
import { useToastStore } from "../../stores/toastStore";
import { ChangePinSheet } from "./ChangePinSheet";
import { useAuthStore } from "../../stores/authStore";
import { Modal } from "../../components/Modal";
import { PageTransition } from "../../components/PageTransition";

export function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setNotificationsEnabled = useSettingsStore(
    (s) => s.setNotificationsEnabled,
  );
  const showToast = useToastStore((s) => s.show);
  const [showChangePin, setShowChangePin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const authSession = useAuthStore((s) => s.session);
  const authLogout = useAuthStore((s) => s.logout);
  const isDark = (settings?.theme || "dark") === "dark";

  async function handleToggleNotifications() {
    if (!settings) return;
    const next = !settings.notificationsEnabled;
    await setNotificationsEnabled(next);
    showToast(
      next
        ? "Pengingat in-app diaktifkan"
        : "Pengingat in-app dinonaktifkan",
      "success"
    );
  }


  return (
    <PageTransition className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 min-h-dvh bg-bg dark:bg-bg-dark">
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 py-4 -mt-6 mb-6 pt-6 z-50">
        <h1 className="font-display text-xl font-bold">Pengaturan</h1>
      </div>

      <Card className="mb-6 flex items-center gap-4 bg-linear-to-br from-purple/10 to-purple/5 border border-purple/20 glow-mesh relative overflow-hidden" padded>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-purple/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 shrink-0 drop-shadow-sm">
          <Mascot mood="happy" size={56} />
        </div>
        <div className="relative z-10">
          <p className="font-display text-base font-bold text-text dark:text-white drop-shadow-sm">MyWallet Premium</p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5 leading-relaxed">
            Kelola keuanganmu dengan cerdas, aman, dan menyenangkan.
          </p>
        </div>
      </Card>

      <SettingsGroup title="Akun">
        <SettingsLink
          to="/pengaturan/profil"
          icon={<User size={18} className="text-purple" />}
          label="Profil & Keamanan"
        />
        <SettingsButton
          icon={<Cloud size={18} className="text-purple" />}
          label={`Keluar / Logout (${authSession?.user.email})`}
          onClick={() => setShowLogoutModal(true)}
        />
      </SettingsGroup>

      <SettingsGroup title="Data">
        <SettingsLink
          to="/pengaturan/akun"
          icon={<Wallet size={18} />}
          label="Kelola Akun"
        />
        <SettingsLink
          to="/pengaturan/kategori"
          icon={<Tags size={18} />}
          label="Kelola Kategori"
        />
        <SettingsLink
          to="/pengaturan/backup"
          icon={<DatabaseBackup size={18} />}
          label="Backup & Restore"
        />
      </SettingsGroup>

      <SettingsGroup title="Preferensi">
        <SettingsToggle
          icon={isDark ? <Moon size={18} /> : <Sun size={18} />}
          label="Mode Gelap"
          checked={isDark}
          onChange={(v) => setTheme(v ? "dark" : "light")}
        />
        <SettingsToggle
          icon={<Bell size={18} />}
          label="Pengingat In-App"
          checked={settings?.notificationsEnabled ?? false}
          onChange={handleToggleNotifications}
        />
      </SettingsGroup>
      <p className="mb-4 px-2 -mt-2 text-xs text-text-muted dark:text-text-muted-dark">
        Pengingat backup, pencatatan, dan tenggat target tabungan akan muncul
        saat kamu
        <span className="font-medium"> membuka aplikasi</span>.
      </p>

      <SettingsGroup title="Informasi">
        <SettingsLink
          to="/pengaturan/tentang"
          icon={<Info size={20} />}
          label="Tentang MyWallet"
        />
        <SettingsLink
          to="/pengaturan/panduan"
          icon={<HelpCircle size={20} />}
          label="Panduan Penggunaan"
        />
      </SettingsGroup>

      <ChangePinSheet
        open={showChangePin}
        onClose={() => setShowChangePin(false)}
      />

      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Konfirmasi Logout">
        <p className="mb-6 text-sm text-text-muted dark:text-text-muted-dark leading-relaxed">
          Apakah Anda yakin ingin keluar dari akun Cloud? Anda harus login kembali untuk bisa masuk ke aplikasi MyWallet.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-muted dark:text-text-muted-dark dark:hover:bg-surface-muted-dark transition-colors"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              setShowLogoutModal(false);
              await authLogout();
              showToast("Berhasil logout", "info");
            }}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 active:scale-95 transition-all"
          >
            Ya, Keluar
          </button>
        </div>
      </Modal>
    </PageTransition>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-text-muted/80 dark:text-text-muted-dark/80">
        {title}
      </p>
      <Card
        padded={false}
        className="overflow-hidden divide-y divide-border/50 dark:divide-border-dark/50 card-shadow glass-edge relative rounded-3xl"
      >
        {children}
      </Card>
    </div>
  );
}

function SettingsLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link to={to} onClick={() => haptic.light()} className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-surface-muted/50 dark:hover:bg-surface-muted-dark/50 active:bg-surface-muted dark:active:bg-surface-muted-dark transition-colors">
      <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-purple/10 text-purple dark:bg-purple/20 dark:text-purple-light shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {icon}
      </div>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight
        size={16}
        className="text-text-muted/50 dark:text-text-muted-dark/50"
      />
    </Link>
  );
}

function SettingsButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={() => { haptic.light(); onClick(); }}
      className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left hover:bg-surface-muted/50 dark:hover:bg-surface-muted-dark/50 active:bg-surface-muted dark:active:bg-surface-muted-dark transition-colors"
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-purple/10 text-purple dark:bg-purple/20 dark:text-purple-light shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {icon}
      </div>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight
        size={16}
        className="text-text-muted/50 dark:text-text-muted-dark/50"
      />
    </button>
  );
}

function SettingsToggle({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => { haptic.light(); onChange(!checked); }}
      className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left hover:bg-surface-muted/50 dark:hover:bg-surface-muted-dark/50 active:bg-surface-muted dark:active:bg-surface-muted-dark transition-colors"
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-purple/10 text-purple dark:bg-purple/20 dark:text-purple-light shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {icon}
      </div>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <div
        className={clsx(
          "relative h-6 w-11 shrink-0 rounded-pill transition-colors",
          checked ? "bg-purple" : "bg-border dark:bg-border-dark",
        )}
      >
        <span
          className={clsx(
            "absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform",
            checked ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </div>
    </button>
  );
}
