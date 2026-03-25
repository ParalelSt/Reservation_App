'use server';

import { db, notifications } from '@reservation-app/database';
import { eq, and, desc } from 'drizzle-orm';
import { generateId } from '@/lib/helpers/generateId';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'danger' | 'info';
  link: string | null;
  reservationId: string | null;
  isRead: boolean;
  createdAt: string;
}

function rowToNotification(row: typeof notifications.$inferSelect): AppNotification {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    message: row.message,
    type: row.type as AppNotification['type'],
    link: row.link,
    reservationId: row.reservationId,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
  return rows.map(rowToNotification);
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'success' | 'danger' | 'info',
  reservationId?: string,
  link?: string,
): Promise<AppNotification> {
  const [row] = await db.insert(notifications).values({
    id: generateId(),
    userId,
    title,
    message,
    type,
    reservationId: reservationId ?? null,
    link: link ?? null,
  }).returning();

  return rowToNotification(row);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const rows = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return rows.length;
}
