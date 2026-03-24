'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReservationStore } from '@/lib/store/reservationStore';
import { formatCurrency } from '@/lib/helpers/formatCurrency';
import { formatTime } from '@/lib/helpers/timeSlots';
import { downloadCalendarEvent } from '@/lib/helpers/calendar';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { IconButton } from '@/components/shared/IconButton';
import type { Reservation, FacilityType, ReservationStatus } from '@/types/reservation';

const AVATAR_SIZE = 80;
const ITEMS_PER_PAGE = 5;

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

export function ProfilePageClient({ user }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  const getReservationsByUser = useReservationStore((state) => state.getReservationsByUser);
  const updateReservationStatus = useReservationStore((state) => state.updateReservationStatus);

  const reservations = getReservationsByUser(user.id);

  // Newest first by creation date
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalPages = Math.max(1, Math.ceil(sortedReservations.length / ITEMS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages - 1);
  const startIndex = clampedPage * ITEMS_PER_PAGE;
  const paginatedReservations = sortedReservations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCancel = (reservationId: string) => {
    updateReservationStatus(reservationId, 'cancelled');
  };

  const emptyState = (
    <Card>
      <p className="py-8 text-center text-gray-500">Nemate nijednu rezervaciju.</p>
    </Card>
  );

  const reservationCards = paginatedReservations.map((reservation) => {
    const isPending = reservation.status === 'pending';
    const isConfirmed = reservation.status === 'confirmed';
    const isCancellable = isPending || isConfirmed;

    const cancelButton = isCancellable ? (
      <Button
        variant="danger"
        size="sm"
        aria-label="Otkaži rezervaciju"
        onClick={() => handleCancel(reservation.id)}
      >
        Otkaži
      </Button>
    ) : null;

    const calendarButton = isConfirmed ? (
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
            <div className="flex flex-wrap items-center gap-2">
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
  const showPagination = sortedReservations.length > ITEMS_PER_PAGE;

  const pagination = showPagination ? (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, sortedReservations.length)} od {sortedReservations.length}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={clampedPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
          aria-label="Prethodna stranica"
          className={mergeClassNames(
            'flex items-center justify-center',
            'h-8 w-8 rounded-lg border',
            'text-sm transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'border-gray-300 text-gray-600 hover:bg-gray-100',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-700">
          {clampedPage + 1} / {totalPages}
        </span>
        <button
          type="button"
          disabled={clampedPage >= totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
          aria-label="Sljedeća stranica"
          className={mergeClassNames(
            'flex items-center justify-center',
            'h-8 w-8 rounded-lg border',
            'text-sm transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'border-gray-300 text-gray-600 hover:bg-gray-100',
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : null;

  const reservationContent = hasReservations ? (
    <div className="flex flex-col gap-4">
      {reservationCards}
      {pagination}
    </div>
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
