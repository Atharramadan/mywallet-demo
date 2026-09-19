import { create } from 'zustand';

export type NotificationType = 'info' | 'update' | 'alert';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  changelog?: string[];
  action?: 'RELOAD_SW';
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (
    title: string,
    message: string,
    type: NotificationType,
    changelog?: string[],
    action?: 'RELOAD_SW'
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (title, message, type, changelog, action) =>
    set((state) => ({
      notifications: [
        {
          id: String(Date.now()),
          title,
          message,
          type,
          isRead: false,
          createdAt: new Date(),
          changelog,
          action,
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAllNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
