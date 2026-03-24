'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notificationStore';
import type { AppNotification } from '@/lib/store/notificationStore';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

const MAX_VISIBLE_NOTIFICATIONS = 10;

const ICON_MAP = {
  success: CheckCircle,
  danger: XCircle,
  info: Info,
} as const;

const ICON_COLOR_MAP = {
  success: 'text-green-500',
  danger: 'text-red-500',
  info: 'text-blue-500',
} as const;

function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMinutes = Math.floor((now - then) / 60000);

  if (diffMinutes < 1) return 'Upravo';
  if (diffMinutes < 60) return `Prije ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Prije ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Prije ${diffDays}d`;
}

interface NotificationItemProps {
  notification: AppNotification;
  onRead: (id: string) => void;
  onNavigate: (link: string) => void;
}

function NotificationItem({ notification, onRead, onNavigate }: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type];
  const iconColor = ICON_COLOR_MAP[notification.type];

  const handleClick = () => {
    onRead(notification.id);
    if (notification.link) {
      onNavigate(notification.link);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={mergeClassNames(
        'flex w-full items-start gap-3',
        'px-4 py-3 text-left',
        'transition-all duration-150 ease-out',
        'hover:bg-gray-50',
        !notification.isRead ? 'bg-indigo-50/50' : '',
      )}
    >
      <Icon className={mergeClassNames('mt-0.5 h-5 w-5 shrink-0', iconColor)} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className={mergeClassNames(
            'text-sm',
            !notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700',
          )}>
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
          )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
        <span className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</span>
      </div>
    </button>
  );
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const visibleNotifications = notifications.slice(0, MAX_VISIBLE_NOTIFICATIONS);
  const hasNotifications = visibleNotifications.length > 0;

  const badge = unreadCount > 0 ? (
    <span className={mergeClassNames(
      'absolute -right-1 -top-1',
      'flex h-4 min-w-4 items-center justify-center',
      'rounded-full bg-red-500 px-1',
      'text-xs font-bold text-white',
    )}>
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  ) : null;

  const emptyState = (
    <div className="px-4 py-8 text-center">
      <Bell className="mx-auto h-8 w-8 text-gray-300" />
      <p className="mt-2 text-sm text-gray-500">Nema obavijesti</p>
    </div>
  );

  const handleNavigate = (link: string) => {
    setIsOpen(false);
    router.push(link);
  };

  const notificationItems = visibleNotifications.map((notification) => (
    <NotificationItem
      key={notification.id}
      notification={notification}
      onRead={markAsRead}
      onNavigate={handleNavigate}
    />
  ));

  const markAllButton = unreadCount > 0 ? (
    <button
      type="button"
      onClick={markAllAsRead}
      className="text-xs font-medium text-indigo-600 transition-all duration-150 ease-out hover:text-indigo-700"
    >
      Označi sve pročitanim
    </button>
  ) : null;

  const dropdown = isOpen ? (
    <div className={mergeClassNames(
      'absolute right-0 top-full mt-2',
      'w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-lg',
      'overflow-hidden',
    )}>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Obavijesti</h3>
        {markAllButton}
      </div>
      <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
        {hasNotifications ? notificationItems : emptyState}
      </div>
    </div>
  ) : null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Obavijesti"
        className={mergeClassNames(
          'relative flex items-center justify-center',
          'h-9 w-9 rounded-lg',
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        )}
      >
        <Bell className="h-5 w-5" />
        {badge}
      </button>
      {dropdown}
    </div>
  );
}
