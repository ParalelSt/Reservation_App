import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const notificationTypeEnum = pgEnum('notification_type', [
  'success',
  'danger',
  'info',
]);

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: notificationTypeEnum('type').notNull(),
  link: text('link'),
  reservationId: text('reservation_id'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
