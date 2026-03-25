import { pgTable, text, timestamp, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',
  'confirmed',
  'declined',
  'cancelled',
]);

export const reservations = pgTable('reservations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  studioGuests: integer('studio_guests').notNull().default(0),
  saunaGuests: integer('sauna_guests').notNull().default(0),
  gymGuests: integer('gym_guests').notNull().default(0),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  durationHours: integer('duration_hours').notNull(),
  minimumPrice: numeric('minimum_price', { precision: 10, scale: 2 }).notNull(),
  paidAmount: numeric('paid_amount', { precision: 10, scale: 2 }).notNull(),
  status: reservationStatusEnum('status').notNull().default('pending'),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
