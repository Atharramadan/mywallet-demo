import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, User, Mail, KeyRound, Lock } from "lucide-react";
import clsx from "clsx";
import { Mascot } from "../../components/Mascot";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import { useSettingsStore } from "../../stores/settingsStore";
import { useAuthStore } from "../../stores/authStore";
import { useToastStore } from "../../stores/toastStore";
import { ChangePinSheet } from "./ChangePinSheet";
import { supabase } from "../../lib/supabase";

export function ProfilePage() {
  const settings = useSettingsStore((s) => s.settings);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const disablePin = useSettingsStore((s) => s.disablePin);
  const showToast = useToastStore((s) => s.show);
  const authSession = useAuthStore((s) => s.session);

  const [showChangePin, setShowChangePin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPinEnabled = !!settings?.pinHash;

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Password minimal 6 karakter", "error");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast("Password berhasil diubah!", "success");
      setShowPasswordModal(false);
      setNewPassword("");
    } catch (err: any) {
      showToast(err.message || "Gagal mengubah password", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg dark:bg-bg-dark page-transition">
      <header className="sticky top-0 z-10 flex h-14 items-center px-4 bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-md">
        <Link
          to="/pengaturan"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface dark:hover:bg-surface-dark transition-colors"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="ml-2 font-display text-lg font-bold">Profil & Keamanan</h1>
      </header>

      <div className="flex-1 px-4 pb-28 pt-4">
        <div className="flex flex-col items-center mb-8">
          <Mascot mood="happy" size={80} />
          <p className="mt-4 text-sm text-center text-text-muted dark:text-text-muted-dark">Kelola akun dan pengaturan keamanan lokal</p>
        </div>

        <SettingsGroup title="Informasi Profil">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Mail size={18} className="text-text-muted dark:text-text-muted-dark" />
            <input
              type="text"
              value={authSession?.user.email || ""}
              disabled
              className="flex-1 bg-transparent text-sm font-medium text-text-muted outline-none"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <User size={18} className="text-text-muted dark:text-text-muted-dark" />
            <input
              type="text"
              placeholder="Nama Pengguna"
              value={settings?.userName || ""}
              onChange={(e) => setUserName(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-text-muted/50"
            />
          </div>
        </SettingsGroup>

        <SettingsGroup title="Keamanan Akun">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
          >
            <Lock size={18} className="text-text-muted dark:text-text-muted-dark" />
            <span className="flex-1 text-sm font-medium">Ubah Password Akun</span>
          </button>
        </SettingsGroup>

        <SettingsGroup title="Keamanan Lokal (Kunci Aplikasi)">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <KeyRound size={18} className="text-text-muted dark:text-text-muted-dark" />
            <span className="flex-1 text-sm font-medium">Gunakan PIN Gembok</span>
            <button
              type="button"
              role="switch"
              aria-checked={isPinEnabled}
              onClick={() => {
                if (isPinEnabled) {
                  disablePin();
                  showToast("Kunci PIN dinonaktifkan", "info");
                } else {
                  setShowChangePin(true);
                }
              }}
              className="relative h-6 w-11 shrink-0 rounded-pill transition-colors focus:outline-none"
              style={{ backgroundColor: isPinEnabled ? 'var(--color-purple)' : 'var(--color-border)' }}
            >
              <span
                className={clsx(
                  "absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform",
                  isPinEnabled ? "translate-x-5.5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
          {isPinEnabled && (
            <button
              onClick={() => setShowChangePin(true)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
            >
              <Lock size={18} className="text-text-muted dark:text-text-muted-dark" />
              <span className="flex-1 text-sm font-medium">Ubah PIN Sekarang</span>
            </button>
          )}
        </SettingsGroup>
      </div>

      <ChangePinSheet
        open={showChangePin}
        onClose={() => setShowChangePin(false)}
      />

      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Ubah Password">
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 pb-4">
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Masukkan password baru untuk akun Supabase Anda. Sesi akan tetap terjaga setelah perubahan.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold pl-1">Password Baru</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-sm font-medium outline-none"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-purple px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-purple-dark disabled:opacity-70 transition-colors"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-1 text-xs font-medium text-text-muted dark:text-text-muted-dark">
        {title}
      </p>
      <Card padded={false} className="divide-y divide-border dark:divide-border-dark overflow-hidden">
        {children}
      </Card>
    </div>
  );
}
