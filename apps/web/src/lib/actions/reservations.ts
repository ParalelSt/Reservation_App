'use server';

import { db, reservations } from '@reservation-app/database';
import { eq, and, ne, desc } from 'drizzle-orm';
import { generateId } from '@/lib/helpers/generateId';
import { calculateEndTime } from '@/lib/helpers/timeSlots';
import { FACILITIES, FIXED_PRICE_FACILITIES } from '@/lib/constants/facilities';
import type { FacilitySelection, Reservation, ReservationStatus, FacilityType } from '@/types/reservation';

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

function calculateMinimumPrice(facilities: FacilitySelection, durationHours: number): number {
  return FACILITY_TYPES.reduce((total, type) => {
    const guestCount = facilities[type];
    if (guestCount === 0) return total;
    const facility = FACILITIES.find((f) => f.type === type);
    const pricePerHour = facility?.minimumPricePerHour ?? 0;
    const multiplier = FIXED_PRICE_FACILITIES.includes(type) ? 1 : guestCount;
    return total + pricePerHour * durationHours * multiplier;
  }, 0);
}

function rowToReservation(row: typeof reservations.$inferSelect): Reservation {
  return {
    id: row.id,
    facilities: {
      studio: row.studioGuests,
      sauna: row.saunaGuests,
      gym: row.gymGuests,
    },
    userId: row.userId,
    userName: row.userName,
    userEmail: row.userEmail,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    durationHours: row.durationHours,
    minimumPrice: Number(row.minimumPrice),
    paidAmount: Number(row.paidAmount),
    status: row.status as ReservationStatus,
    createdAt: row.createdAt.toISOString(),
    notes: row.notes,
  };
}

export async function createReservation(
  facilities: FacilitySelection,
  date: string,
  startTime: string,
  durationHours: number,
  paymentAmount: number,
  notes: string,
  userId: string,
  userName: string,
  userEmail: string,
): Promise<Reservation> {
  const id = generateId();
  const endTime = calculateEndTime(startTime, durationHours);
  const minimumPrice = calculateMinimumPrice(facilities, durationHours);

  const [row] = await db.insert(reservations).values({
    id,
    userId,
    userName,
    userEmail,
    studioGuests: facilities.studio,
    saunaGuests: facilities.sauna,
    gymGuests: facilities.gym,
    date,
    startTime,
    endTime,
    durationHours,
    minimumPrice: minimumPrice.toFixed(2),
    paidAmount: paymentAmount.toFixed(2),
    status: 'pending',
    notes,
  }).returning();

  return rowToReservation(row);
}

export async function getAllReservations(): Promise<Reservation[]> {
  const rows = await db.select().from(reservations).orderBy(desc(reservations.createdAt));
  return rows.map(rowToReservation);
}

export async function getReservationsByUser(userId: string): Promise<Reservation[]> {
  const rows = await db
    .select()
    .from(reservations)
    .where(eq(reservations.userId, userId))
    .orderBy(desc(reservations.createdAt));
  return rows.map(rowToReservation);
}

export async function getActiveReservationsByDate(date: string): Promise<Reservation[]> {
  const rows = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.date, date),
        ne(reservations.status, 'cancelled'),
        ne(reservations.status, 'declined'),
      ),
    );
  return rows.map(rowToReservation);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<void> {
  await db
    .update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, id));
}

export async function deleteReservation(id: string): Promise<void> {
  await db.delete(reservations).where(eq(reservations.id, id));
}
