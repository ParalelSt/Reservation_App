'use client';

import { Search, Check, X, Trash2 } from 'lucide-react';
import { useAdminReservations } from '@/hooks/useAdminReservations';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { formatCurrency } from '@/lib/helpers/formatCurrency';
import { formatTime } from '@/lib/helpers/timeSlots';
import { AdminCalendar } from '@/components/admin/AdminCalendar';
import type { FacilityType, ReservationStatus } from '@/types/reservation';

const STATUS_FILTERS = [
  { value: 'all' as const, label: 'Sve' },
  { value: 'pending' as const, label: 'Na čekanju' },
  { value: 'confirmed' as const, label: 'Potvrđeno' },
  { value: 'declined' as const, label: 'Odbijeno' },
  { value: 'cancelled' as const, label: 'Otkazano' },
];

const FACILITY_FILTERS = [
  { value: 'all' as const, label: 'Svi objekti' },
  { value: 'studio' as FacilityType, label: 'Glazbeni Studio' },
  { value: 'sauna' as FacilityType, label: 'Sauna' },
  { value: 'gym' as FacilityType, label: 'Teretana' },
];

const STATUS_BADGE_STYLES: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Na čekanju',
  confirmed: 'Potvrđeno',
  declined: 'Odbijeno',
  cancelled: 'Otkazano',
};

const FACILITY_LABELS: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
};

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

function getSelectedFacilitySummary(reservation: Reservation): string {
  return FACILITY_TYPES
    .filter((type) => reservation.facilities[type] > 0)
    .map((type) => {
      const count = reservation.facilities[type];
      return `${FACILITY_LABELS[type]} (${count})`;
    })
    .join(', ');
}

import type { Reservation } from '@/types/reservation';

interface AdminPageProps {
  initialReservations: Reservation[];
}

export function AdminPageClient({ initialReservations }: AdminPageProps) {
  const {
    filteredReservations,
    statusCounts,
    filterStatus,
    filterFacility,
    searchQuery,
    setFilterStatus,
    setFilterFacility,
    setSearchQuery,
    handleConfirm,
    handleDecline,
    handleDelete,
  } = useAdminReservations({ initialReservations });

  const searchBar = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Pretraži po imenu, emailu ili datumu..."
        aria-label="Pretraži rezervacije"
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all duration-150 ease-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  const statusFilter = (
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map((filter) => {
        const isSelected = filterStatus === filter.value;
        const count = statusCounts[filter.value];
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => setFilterStatus(filter.value)}
            aria-label={`Filtriraj po statusu: ${filter.label}`}
            className={mergeClassNames(
              'rounded-full px-3 py-1.5',
              'text-xs font-medium',
              'border transition-all duration-150 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              isSelected
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300',
            )}
          >
            {filter.label} ({count})
          </button>
        );
      })}
    </div>
  );

  const facilityFilter = (
    <div className="flex flex-wrap gap-2">
      {FACILITY_FILTERS.map((filter) => {
        const isSelected = filterFacility === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => setFilterFacility(filter.value)}
            aria-label={`Filtriraj po objektu: ${filter.label}`}
            className={mergeClassNames(
              'rounded-full px-3 py-1.5',
              'text-xs font-medium',
              'border transition-all duration-150 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              isSelected
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300',
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );

  const emptyState = filteredReservations.length === 0 ? (
    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <p className="text-gray-500">Nema rezervacija za prikaz.</p>
    </div>
  ) : null;

  const reservationList = filteredReservations.length > 0 ? (
    <div className="flex flex-col gap-4">
      {filteredReservations.map((reservation) => {
        const isPending = reservation.status === 'pending';

        const actionButtons = isPending ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleConfirm(reservation.id)}
              aria-label="Potvrdi rezervaciju"
              className="rounded-lg bg-green-600 p-2 text-white transition-all duration-150 ease-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDecline(reservation.id)}
              aria-label="Odbij rezervaciju"
              className="rounded-lg bg-red-600 p-2 text-white transition-all duration-150 ease-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleDelete(reservation.id)}
            aria-label="Obriši rezervaciju"
            className="rounded-lg border border-gray-300 p-2 text-gray-500 transition-all duration-150 ease-out hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        );

        return (
          <div
            key={reservation.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {reservation.userName}
                </span>
                <span className={mergeClassNames(
                  'inline-flex items-center rounded-full px-2.5 py-0.5',
                  'text-xs font-medium',
                  STATUS_BADGE_STYLES[reservation.status],
                )}>
                  {STATUS_LABELS[reservation.status]}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>{getSelectedFacilitySummary(reservation)}</span>
                <span>{reservation.date}</span>
                <span>
                  {formatTime(reservation.startTime)} — {formatTime(reservation.endTime)}
                </span>
                <span>{reservation.durationHours}h</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-500">{reservation.userEmail}</span>
                <span className="font-medium text-indigo-600">
                  Plaćeno: {formatCurrency(reservation.paidAmount)}
                </span>
                <span className="text-gray-400">
                  (min: {formatCurrency(reservation.minimumPrice)})
                </span>
              </div>
              {reservation.notes && (
                <p className="text-sm italic text-gray-500">
                  &quot;{reservation.notes}&quot;
                </p>
              )}
            </div>
            {actionButtons}
          </div>
        );
      })}
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Upravljajte rezervacijama i pratite aktivnosti.</p>
      </div>

      <AdminCalendar reservations={initialReservations} />

      <div className="flex flex-col gap-4">
        {searchBar}
        {statusFilter}
        {facilityFilter}
      </div>

      {emptyState}
      {reservationList}
    </div>
  );
}
