import type { Reservation, FacilityType } from '@/types/reservation';

const FACILITY_NAMES: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
} as const;

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

/** Get a display string for selected facilities */
function getSelectedFacilityNames(reservation: Reservation): string {
  return FACILITY_TYPES
    .filter((type) => reservation.facilities[type] > 0)
    .map((type) => FACILITY_NAMES[type])
    .join(', ');
}

/** Format a date and time string into ICS datetime format (YYYYMMDDTHHMMSS) */
function toIcsDateTime(date: string, time: string): string {
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  return `${year}${month}${day}T${hours}${minutes}00`;
}

/** Generate an ICS calendar file content for a reservation */
export function generateIcsContent(reservation: Reservation): string {
  const facilityName = getSelectedFacilityNames(reservation);
  const summary = `Rezervacija - ${facilityName}`;
  const dtStart = toIcsDateTime(reservation.date, reservation.startTime);
  const dtEnd = toIcsDateTime(reservation.date, reservation.endTime);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ReserveHub//Reservation//HR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `DTSTAMP:${now}`,
    `UID:${reservation.id}@reservehub`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${reservation.notes || 'Privatna sesija'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${summary} počinje za 30 minuta`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/** Download an ICS file for a reservation */
export function downloadCalendarEvent(reservation: Reservation): void {
  const content = generateIcsContent(reservation);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `rezervacija-${reservation.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
