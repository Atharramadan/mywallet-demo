import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';
import { CurrencyInput } from '../../components/CurrencyInput';
import { IconPicker } from '../../components/IconPicker';
import { ColorPicker } from '../../components/ColorPicker';
import { Modal } from '../../components/Modal';
import { useAccountStore } from '../../stores/accountStore';
import { useToastStore } from '../../stores/toastStore';
import type { Account } from '../../db/schema';

export function AddEditAccountSheet({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account?: Account | null;
}) {
  const createAccount = useAccountStore((s) => s.create);
  const updateAccount = useAccountStore((s) => s.update);
  const removeAccount = useAccountStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [icon, setIcon] = useState('wallet');
  const [color, setColor] = useState('#7C6FE0');
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setIcon(account.icon);
      setColor(account.color);
      setBalance(account.balance);
    } else {
      setName('');
      setIcon('wallet');
      setColor('#7C6FE0');
      setBalance(0);
    }
  }, [account, open]);

  async function handleSubmit() {
    if (!name.trim()) return showToast('Nama akun tidak boleh kosong', 'error');
    
    setIsLoading(true);
    try {
      if (account) {
        await updateAccount(account.id!, { name: name.trim(), icon, color });
      } else {
        await createAccount({ name: name.trim(), icon, color, balance });
      }
      showToast(account ? 'Akun diperbarui' : 'Akun ditambahkan', 'success');
      onClose();
    } catch (error: any) {
      console.error(error);
      showToast(`Gagal: ${error.message || 'Terjadi kesalahan'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    await removeAccount(account!.id!);
    showToast('Akun dihapus permanen', 'success');
    setShowDeleteConfirm(false);
    onClose();
  }

  return (
    <>
      <Sheet open={open} onClose={onClose} title={account ? 'Edit Akun' : 'Tambah Akun'}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Nama Akun</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bank Mandiri"
              className="w-full rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-sm outline-none"
            />
          </div>

          {!account && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Saldo Awal</label>
              <CurrencyInput value={balance} onChange={setBalance} />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Warna</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Ikon</label>
            <IconPicker value={icon} onChange={setIcon} color={color} />
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <Button onClick={handleSubmit} fullWidth size="lg" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Akun'}
            </Button>
            
            {account && (
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} fullWidth size="lg">
                <Trash2 size={18} /> Hapus Akun Permanen
              </Button>
            )}
          </div>
        </div>
      </Sheet>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <h3 className="font-display text-lg font-semibold text-text dark:text-text-dark">
          Hapus Akun Permanen?
        </h3>
        <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark">
          Apakah Anda yakin ingin menghapus akun <strong>{account?.name}</strong> secara permanen?
          <br />
          <br />
          Saldo dan semua koneksi transaksi akan hilang dari akun ini. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="danger" fullWidth onClick={handleDelete}>
            Ya, Hapus Akun
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setShowDeleteConfirm(false)}>
            Batal
          </Button>
        </div>
      </Modal>
    </>
  );
}
