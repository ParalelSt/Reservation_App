import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/helpers/generateId';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'danger' | 'info';
  link?: string;
  isRead: boolean;
  createdAt: string;
  reservationId: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type: AppNotification['type'], reservationId: string, link?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

/** Store for managing in-app notifications with localStorage persistence */
export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (title, message, type, reservationId, link) => {
        const notification: AppNotification = {
          id: generateId(),
          title,
          message,
          type,
          link,
          isRead: false,
          createdAt: new Date().toISOString(),
          reservationId,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },
    }),
    {
      name: 'notification-storage',
    },
  ),
);

export type { AppNotification };
