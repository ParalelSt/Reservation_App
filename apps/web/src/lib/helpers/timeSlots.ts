import { OPERATING_HOURS, TIME_SLOT_INTERVAL } from '@/lib/constants/facilities';
import type { TimeSlot } from '@/types/reservation';

/** Generate all available time slots for a day */
export function generateTimeSlots(
  existingBookings: { startTime: string; endTime: string }[],
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (let hour = OPERATING_HOURS.OPEN; hour < OPERATING_HOURS.CLOSE; hour++) {
    const intervalCount = 60 / TIME_SLOT_INTERVAL;

    for (let i = 0; i < intervalCount; i++) {
      const minutes = i * TIME_SLOT_INTERVAL;
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      const isBooked = existingBookings.some((booking) => {
        return time >= booking.startTime && time < booking.endTime;
      });

      slots.push({ time, isAvailable: !isBooked });
    }
  }

  return slots;
}

/** Check if a time range overlaps with any existing bookings */
export function hasTimeConflict(
  startTime: string,
  endTime: string,
  existingBookings: { startTime: string; endTime: string }[],
): boolean {
  return existingBookings.some(
    (booking) => startTime < booking.endTime && endTime > booking.startTime,
  );
}

/** Format a time string for display */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/** Calculate end time given a start time and duration in hours */
export function calculateEndTime(startTime: string, durationHours: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHour = hours + durationHours;
  return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
