'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { formatCurrency } from '@/lib/helpers/formatCurrency';
import { formatTime } from '@/lib/helpers/timeSlots';
import { Card } from '@/components/shared/Card';
import type { Reservation, FacilityType } from '@/types/reservation';

const DAYS_IN_WEEK = 7;
const WEEKDAY_LABELS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'] as const;
const MONTH_LABELS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac',
] as const;

const FACILITY_LABELS: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
};

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Na čekanju',
  confirmed: 'Potvrđeno',
  declined: 'Odbijeno',
  cancelled: 'Otkazano',
};

const STATUS_DOT_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-green-500',
  declined: 'bg-red-400',
  cancelled: 'bg-gray-400',
};

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  const startDay = (firstDay.getDay() + 6) % DAYS_IN_WEEK;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }
  return days;
}

function formatDateKey(year: number, month: number, day: number): string {
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getFacilitySummary(reservation: Reservation): string {
  return FACILITY_TYPES
    .filter((type) => reservation.facilities[type] > 0)
    .map((type) => {
      const count = reservation.facilities[type];
      return `${FACILITY_LABELS[type]} (${count})`;
    })
    .join(', ');
}

interface Props {
  reservations: Reservation[];
}

export function AdminCalendar({ reservations }: Props) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const reservationsByDate = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of reservations) {
      const existing = map.get(r.date) ?? [];
      existing.push(r);
      map.set(r.date, existing);
    }
    return map;
  }, [reservations]);

  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const todayKey = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const selectedReservations = useMemo(() => {
    if (!selectedDate) return [];
    const dayReservations = reservationsByDate.get(selectedDate) ?? [];
    return [...dayReservations].sort(
      (a, b) => a.startTime.localeCompare(b.startTime),
    );
  }, [selectedDate, reservationsByDate]);

  const weekdayHeaders = WEEKDAY_LABELS.map((label) => (
    <div key={label} className="py-2 text-center text-xs font-semibold text-gray-500">
      {label}
    </div>
  ));

  const dayCells = calendarDays.map((day, index) => {
    if (day === null) {
      return <div key={`empty-${index}`} />;
    }

    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const dayReservations = reservationsByDate.get(dateKey) ?? [];
    const hasReservations = dayReservations.length > 0;
    const isToday = dateKey === todayKey;
    const isSelected = dateKey === selectedDate;
    const isHovered = dateKey === hoveredDate;

    const confirmedCount = dayReservations.filter((r) => r.status === 'confirmed').length;
    const pendingCount = dayReservations.filter((r) => r.status === 'pending').length;

    const dots = (
      <div className="flex justify-center gap-0.5">
        {confirmedCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
        {pendingCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />}
      </div>
    );

    const tooltip = isHovered && hasReservations ? (
      <div className={mergeClassNames(
        'absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2',
        'w-48 rounded-lg border border-gray-200 bg-white p-3 shadow-lg',
        'pointer-events-none',
      )}>
        <p className="mb-1 text-xs font-semibold text-gray-900">
          {dayReservations.length} {dayReservations.length === 1 ? 'rezervacija' : 'rezervacija'}
        </p>
        {dayReservations.slice(0, 3).map((r) => (
          <p key={r.id} className="truncate text-xs text-gray-600">
            {formatTime(r.startTime)} — {r.userName}
          </p>
        ))}
        {dayReservations.length > 3 && (
          <p className="text-xs text-gray-400">+{dayReservations.length - 3} više</p>
        )}
      </div>
    ) : null;

    return (
      <div key={dateKey} className="relative">
        <button
          type="button"
          onClick={() => setSelectedDate(isSelected ? null : dateKey)}
          onMouseEnter={() => setHoveredDate(dateKey)}
          onMouseLeave={() => setHoveredDate(null)}
          aria-label={`${day}. ${MONTH_LABELS[currentMonth]} — ${dayReservations.length} rezervacija`}
          className={mergeClassNames(
            'flex w-full flex-col items-center gap-1',
            'rounded-lg py-2',
            'text-sm transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500',
            isSelected
              ? 'bg-indigo-600 text-white'
              : isToday
                ? 'bg-indigo-50 font-semibold text-indigo-700'
                : hasReservations
                  ? 'font-medium text-gray-900 hover:bg-gray-100'
                  : 'text-gray-500 hover:bg-gray-50',
          )}
        >
          {day}
          {hasReservations && !isSelected ? dots : <div className="h-1.5" />}
        </button>
        {tooltip}
      </div>
    );
  });

  const selectedDateDisplay = (() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split('-').map(Number);
    return `${d}. ${MONTH_LABELS[m - 1]} ${y}`;
  })();

  const selectedPanel = selectedDate ? (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{selectedDateDisplay}</h3>
        <button
          type="button"
          onClick={() => setSelectedDate(null)}
          aria-label="Zatvori"
          className="rounded-lg p-1 text-gray-400 transition-all duration-150 ease-out hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {selectedReservations.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          Nema rezervacija za ovaj dan.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {selectedReservations.map((reservation) => (
            <Card key={reservation.id} padding="sm">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {reservation.userName}
                  </span>
                  <span className={mergeClassNames(
                    'inline-flex items-center rounded-full px-2 py-0.5',
                    'text-xs font-medium',
                    STATUS_BADGE_STYLES[reservation.status],
                  )}>
                    {STATUS_LABELS[reservation.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {formatTime(reservation.startTime)} — {formatTime(reservation.endTime)} ({reservation.durationHours}h)
                </p>
                <p className="text-sm text-gray-600">
                  {getFacilitySummary(reservation)}
                </p>
                <p className="text-sm text-gray-500">
                  {reservation.userEmail}
                </p>
                <p className="text-sm font-medium text-indigo-600">
                  Plaćeno: {formatCurrency(reservation.paidAmount)}
                </p>
                {reservation.notes && (
                  <p className="text-sm italic text-gray-400">
                    &quot;{reservation.notes}&quot;
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Prethodni mjesec"
              className="rounded-lg p-2 text-gray-600 transition-all duration-150 ease-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {MONTH_LABELS[currentMonth]} {currentYear}
            </h2>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Sljedeći mjesec"
              className="rounded-lg p-2 text-gray-600 transition-all duration-150 ease-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekdayHeaders}
            {dayCells}
          </div>
        </div>
      </Card>

      {selectedPanel}
    </div>
  );
}
