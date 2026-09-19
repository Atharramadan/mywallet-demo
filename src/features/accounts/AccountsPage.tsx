import { useState } from 'react';
import { ArrowLeft, Plus, ArchiveRestore, Pencil, Scale, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppIcon } from '../../lib/icons';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { useAccountStore } from '../../stores/accountStore';
import { useToastStore } from '../../stores/toastStore';
import { formatCurrency } from '../../lib/formatters';
import { AddEditAccountSheet } from './AddEditAccountSheet';
import { AdjustBalanceSheet } from './AdjustBalanceSheet';
import type { Account } from '../../db/schema';

export function AccountsPage() {
  const accounts = useAccountStore((s) => s.accounts);
  const unarchiveAccount = useAccountStore((s) => s.unarchive);
  const removeAccount = useAccountStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [adjusting, setAdjusting] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const active = accounts.filter((a) => !a.isArchived);
  const archived = accounts.filter((a) => a.isArchived);

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/pengaturan" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Kelola Akun</h1>
      </div>

      {active.length === 0 ? (
        <Card>
          <EmptyState title="Belum ada akun" description="Tambahkan akun bank atau e-wallet" mood="idle" />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {active.map((acc) => (
            <Card key={acc.id} padded={false} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${acc.color}22` }}>
                  <AppIcon name={acc.icon} size={20} style={{ color: acc.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{acc.name}</p>
                  <p className="text-sm tabular-nums text-text-muted dark:text-text-muted-dark">{formatCurrency(acc.balance)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setAdjusting(acc)}
                    aria-label="Sesuaikan saldo"
                    className="rounded-full p-2 text-text-muted hover:bg-surface-muted dark:text-text-muted-dark dark:hover:bg-surface-muted-dark"
                  >
                    <Scale size={16} />
                  </button>
                  <button
                    onClick={() => setEditing(acc)}
                    aria-label="Edit akun"
                    className="rounded-full p-2 text-text-muted hover:bg-surface-muted dark:text-text-muted-dark dark:hover:bg-surface-muted-dark"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingAccount(acc)}
                    aria-label="Hapus akun"
                    className="rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button variant="secondary" fullWidth className="mt-4" onClick={() => setShowAdd(true)}>
        <Plus size={18} /> Tambah Akun
      </Button>

      {archived.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="text-xs font-medium text-text-muted dark:text-text-muted-dark"
          >
            {showArchived ? 'Sembunyikan' : 'Tampilkan'} akun diarsipkan ({archived.length})
          </button>
          {showArchived && (
            <div className="mt-3 flex flex-col gap-2">
              {archived.map((acc) => (
                <div key={acc.id} className="flex items-center gap-3 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-3 opacity-70">
                  <AppIcon name={acc.icon} size={18} style={{ color: acc.color }} />
                  <span className="flex-1 text-sm">{acc.name}</span>
                  <button
                    onClick={() => unarchiveAccount(acc.id!)}
                    aria-label="Kembalikan akun"
                    className="rounded-full p-1.5 text-text-muted dark:text-text-muted-dark"
                  >
                    <ArchiveRestore size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AddEditAccountSheet open={showAdd} onClose={() => setShowAdd(false)} />
      <AddEditAccountSheet open={!!editing} onClose={() => setEditing(null)} account={editing} />
      <AdjustBalanceSheet account={adjusting} onClose={() => setAdjusting(null)} />
      
      <Modal open={!!deletingAccount} onClose={() => setDeletingAccount(null)}>
        <h3 className="font-display text-lg font-semibold text-text dark:text-text-dark">
          Hapus Akun Permanen?
        </h3>
        <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark">
          Apakah Anda yakin ingin menghapus akun <strong>{deletingAccount?.name}</strong> secara permanen?
          <br />
          <br />
          Saldo dan semua koneksi transaksi akan hilang dari akun ini. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              if (deletingAccount) {
                removeAccount(deletingAccount.id!);
                showToast('Akun dihapus permanen', 'success');
              }
              setDeletingAccount(null);
            }}
          >
            Ya, Hapus Akun
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setDeletingAccount(null)}>
            Batal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
