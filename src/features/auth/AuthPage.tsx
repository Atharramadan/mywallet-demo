import { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';
import { Mascot } from '../../components/Mascot';
import { ToastHost } from '../../components/ToastHost';

export function AuthPage() {
  const showToast = useToastStore((s) => s.show);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Supabase belum dikonfigurasi. Cek .env Anda.", "error");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Login berhasil!", "success");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast("Registrasi berhasil! Silakan cek email Anda atau coba login.", "success");
        setIsLogin(true);
      }
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg dark:bg-bg-dark page-transition items-center justify-center">
      <ToastHost />
      <div className="flex-1 px-4 py-8 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="flex flex-col items-center mb-8">
          <Mascot mood="happy" size={80} />
          <h1 className="mt-4 font-display text-2xl font-bold text-center">
            {isLogin ? "Selamat Datang Kembali!" : "Buat Akun MyWallet"}
          </h1>
          <p className="mt-2 text-sm text-center text-text-muted dark:text-text-muted-dark">
            {isLogin 
              ? "Masuk untuk menyinkronkan data keuangan Anda dengan cloud." 
              : "Daftar untuk mengaktifkan fitur pencadangan awan otomatis."}
          </p>
        </div>

        <Card padded>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 pl-10 text-sm font-medium outline-none border border-transparent focus:border-purple/30 focus:ring-4 focus:ring-purple/10 transition-all"
                  placeholder="anda@email.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 pl-10 pr-10 text-sm font-medium outline-none border border-transparent focus:border-purple/30 focus:ring-4 focus:ring-purple/10 transition-all"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark hover:text-purple transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-purple to-purple-dark px-4 py-3.5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                "Memproses..."
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Masuk Sekarang
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Daftar Sekarang
                </>
              )}
            </button>
            <div className="mt-4 border-t border-border dark:border-border-dark pt-4 text-center">
              <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">
                {isLogin ? "Pengguna baru?" : "Sudah punya akun?"}
              </p>
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-purple hover:text-purple-dark transition-colors"
              >
                {isLogin ? "Buat Akun Sekarang" : "Masuk ke Akun Anda"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
