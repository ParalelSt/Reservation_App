'use client';

import Image from 'next/image';
import { CalendarPlus } from 'lucide-react';
import { useReservationStore } from '@/lib/store/reservationStore';
import { formatCurrency } from '@/lib/helpers/formatCurrency';
import { formatTime } from '@/lib/helpers/timeSlots';
import { downloadCalendarEvent } from '@/lib/helpers/calendar';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { IconButton } from '@/components/shared/IconButton';
import type { Reservation, FacilityType, ReservationStatus } from '@/types/reservation';

const AVATAR_SIZE = 80;

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Na čekanju',
  confirmed: 'Potvrđeno',
  declined: 'Odbijeno',
  cancelled: 'Otkazano',
} as const;

const STATUS_VARIANTS: Record<ReservationStatus, 'warning' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  confirmed: 'success',
  declined: 'danger',
  cancelled: 'default',
} as const;

const FACILITY_NAMES: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
} as const;

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

const DURATION_SUFFIX = 'h';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
  };
}

function getSelectedFacilitySummary(reservation: Reservation): string {
  return FACILITY_TYPES
    .filter((type) => reservation.facilities[type] > 0)
    .map((type) => {
      const count = reservation.facilities[type];
      const suffix = count === 1 ? 'os.' : 'os.';
      return `${FACILITY_NAMES[type]} (${count} ${suffix})`;
    })
    .join(', ');
}

function sortByDateDescending(a: Reservation, b: Reservation): number {
  const dateComparison = b.date.localeCompare(a.date);
  if (dateComparison !== 0) return dateComparison;
  return b.startTime.localeCompare(a.startTime);
}

export function ProfilePageClient({ user }: Props) {
  const getReservationsByUser = useReservationStore((state) => state.getReservationsByUser);
  const updateReservationStatus = useReservationStore((state) => state.updateReservationStatus);

  const reservations = getReservationsByUser(user.id);
  const sortedReservations = [...reservations].sort(sortByDateDescending);

  const handleCancel = (reservationId: string) => {
    updateReservationStatus(reservationId, 'cancelled');
  };

  const emptyState = (
    <Card>
      <p className="py-8 text-center text-gray-500">Nemate nijednu rezervaciju.</p>
    </Card>
  );

  const reservationCards = sortedReservations.map((reservation) => {
    const isPending = reservation.status === 'pending';
    const isActive = reservation.status === 'pending' || reservation.status === 'confirmed';

    const cancelButton = isPending ? (
      <Button
        variant="danger"
        size="sm"
        aria-label="Otkaži rezervaciju"
        onClick={() => handleCancel(reservation.id)}
      >
        Otkaži
      </Button>
    ) : null;

    const calendarButton = isActive ? (
      <IconButton
        icon={<CalendarPlus className="h-4 w-4" />}
        size="sm"
        aria-label="Dodaj u kalendar"
        onClick={() => downloadCalendarEvent(reservation)}
      />
    ) : null;

    const facilitySummary = getSelectedFacilitySummary(reservation);

    return (
      <Card key={reservation.id} padding="sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {facilitySummary}
              </span>
              <Badge
                label={STATUS_LABELS[reservation.status]}
                variant={STATUS_VARIANTS[reservation.status]}
              />
            </div>
            <p className="text-sm text-gray-600">
              {reservation.date}
            </p>
            <p className="text-sm text-gray-600">
              {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)} ({reservation.durationHours}{DURATION_SUFFIX})
            </p>
            <p className="text-sm font-medium text-gray-700">
              {formatCurrency(reservation.paidAmount)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {calendarButton}
            {cancelButton}
          </div>
        </div>
      </Card>
    );
  });

  const hasReservations = sortedReservations.length > 0;
  const reservationContent = hasReservations ? (
    <div className="flex flex-col gap-4">{reservationCards}</div>
  ) : (
    emptyState
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-8">
      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Image
            src={user.picture}
            alt={user.name}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </Card>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Moje Rezervacije</h2>
        {reservationContent}
      </section>

      <div>
        <a
          href="/auth/logout"
          aria-label="Odjava iz aplikacije"
          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 transition-all duration-150 ease-out hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Odjava
        </a>
      </div>
    </div>
  );
}
