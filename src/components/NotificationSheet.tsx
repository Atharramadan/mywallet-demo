import { Bell, Info, RefreshCw, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { useNotificationStore, type AppNotification } from '../stores';
import { formatDateLong } from '../lib/formatters';

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationSheet({ open, onClose }: NotificationSheetProps) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const clearAllNotifications = useNotificationStore((s) => s.clearAllNotifications);
  
  const updateServiceWorker = (_reload?: boolean) => window.location.reload();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) {
      if (unreadCount > 0) {
        markAllAsRead();
      }
    }
    wasOpen.current = open;
  }, [open, unreadCount, markAllAsRead]);

  return (
    <Modal open={open} onClose={onClose} title="Notifikasi">
      {notifications.length > 0 && (
        <div className="mb-6 flex items-center justify-between px-1">
          <button
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
            className="text-sm font-semibold text-purple transition-all hover:text-purple/80 hover:underline disabled:opacity-50 disabled:hover:no-underline"
          >
            Tandai semua dibaca
          </button>
          <button
            onClick={() => clearAllNotifications()}
            className="text-sm font-semibold text-rose transition-all hover:text-rose/80 hover:underline"
          >
            Hapus semua
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted dark:text-text-muted-dark">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-purple/10 dark:bg-purple/20">
            <Bell size={36} className="text-purple opacity-80" />
          </div>
          <h3 className="font-display text-lg font-bold text-text dark:text-white">Belum ada notifikasi</h3>
          <p className="mt-2 text-sm max-w-62.5">Anda sudah membaca semua pemberitahuan terbaru.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-4">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={() => markAsRead(n.id)}
              onDelete={() => deleteNotification(n.id)}
              onAction={() => {
                if (n.action === 'RELOAD_SW') {
                  updateServiceWorker(true);
                }
              }}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

function NotificationItem({
  notification,
  onRead,
  onDelete,
  onAction,
}: {
  notification: AppNotification;
  onRead: () => void;
  onDelete: () => void;
  onAction: () => void;
}) {
  const isUpdate = notification.type === 'update';
  const isAlert = notification.type === 'alert';

  return (
    <div
      onClick={!notification.isRead ? onRead : undefined}
      className={clsx(
        'group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 ease-out',
        !notification.isRead
          ? 'bg-linear-to-br from-purple/10 to-purple/5 border border-purple/20 shadow-[0_8px_30px_rgb(139,92,246,0.12)] dark:shadow-[0_8px_30px_rgb(139,92,246,0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(139,92,246,0.2)] cursor-pointer'
          : 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark card-shadow hover:-translate-y-1 hover:border-purple/30 hover:shadow-xl'
      )}
    >
      <div className="flex gap-4">
        <div
          className={clsx(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:scale-110',
            isUpdate
              ? 'bg-linear-to-br from-purple/20 to-purple/10 text-purple ring-4 ring-purple/5'
              : isAlert
              ? 'bg-linear-to-br from-rose/20 to-rose/10 text-rose ring-4 ring-rose/5'
              : 'bg-linear-to-br from-blue/20 to-blue/10 text-blue ring-4 ring-blue/5'
          )}
        >
          {isUpdate ? <Sparkles size={22} /> : isAlert ? <AlertCircle size={22} /> : <Info size={22} />}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold text-text dark:text-white leading-tight">
              {notification.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <p className="rounded-md bg-bg px-2 py-1 text-[10px] font-medium text-text-muted dark:bg-bg-dark dark:text-text-muted-dark">
                {formatDateLong(notification.createdAt)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Hapus"
                className="rounded-full p-1.5 text-text-muted/40 opacity-0 transition-all hover:bg-rose/10 hover:text-rose group-hover:opacity-100 dark:text-text-muted-dark/40"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark leading-relaxed">
            {notification.message}
          </p>

          {notification.changelog && notification.changelog.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2.5 rounded-2xl bg-bg dark:bg-bg-dark p-4 text-[13px] text-text-muted dark:text-text-muted-dark border border-border/50 dark:border-border-dark/50 shadow-inner">
              {notification.changelog.map((log, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple shadow-[0_0_8px_rgb(139,92,246,0.6)]" />
                  <span className="flex-1 leading-relaxed">{log}</span>
                </li>
              ))}
            </ul>
          )}

          {notification.action === 'RELOAD_SW' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-linear-to-r from-purple to-purple-500 px-4 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-95"
            >
              <RefreshCw size={16} />
              Perbarui Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
