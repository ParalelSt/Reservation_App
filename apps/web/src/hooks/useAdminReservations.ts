'use client';

import { useState, useMemo, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { FacilityType, Reservation, ReservationStatus } from '@/types/reservation';
import {
  updateReservationStatus as updateStatusAction,
  deleteReservation as deleteAction,
} from '@/lib/actions/reservations';
import { createNotification } from '@/lib/actions/notifications';

type FilterStatus = ReservationStatus | 'all';

const FACILITY_LABELS: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
};

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

function getFacilityLabel(reservation: Reservation): string {
  return FACILITY_TYPES
    .filter((type) => reservation.facilities[type] > 0)
    .map((type) => FACILITY_LABELS[type])
    .join(', ');
}

interface Props {
  initialReservations: Reservation[];
}

/** Hook for managing the admin reservations view */
export function useAdminReservations({ initialReservations }: Props) {
  const [reservations, setReservations] = useState(initialReservations);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterFacility, setFilterFacility] = useState<FacilityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredReservations = useMemo(() => {
    let result = reservations;

    if (filterStatus !== 'all') {
      result = result.filter((r) => r.status === filterStatus);
    }

    if (filterFacility !== 'all') {
      result = result.filter((r) => r.facilities[filterFacility] > 0);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.userName.toLowerCase().includes(query) ||
          r.userEmail.toLowerCase().includes(query) ||
          r.date.includes(query),
      );
    }

    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [reservations, filterStatus, filterFacility, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, pending: 0, confirmed: 0, declined: 0, cancelled: 0 };
    for (const reservation of reservations) {
      counts.all++;
      counts[reservation.status]++;
    }
    return counts;
  }, [reservations]);

  const handleConfirm = useCallback(
    (id: string) => {
      const reservation = reservations.find((r) => r.id === id);
      if (!reservation) return;

      // Optimistic update
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'confirmed' as const } : r)),
      );

      startTransition(async () => {
        await updateStatusAction(id, 'confirmed');
        const facilityLabel = getFacilityLabel(reservation);
        const message = `Vaša rezervacija za ${facilityLabel} (${reservation.date}, ${reservation.startTime}) je prihvaćena! Posjetite profil da dodate termin u kalendar.`;
        await createNotification(reservation.userId, 'Rezervacija Prihvaćena', message, 'success', id, '/profile');
        router.refresh();
      });
    },
    [reservations, router],
  );

  const handleDecline = useCallback(
    (id: string) => {
      const reservation = reservations.find((r) => r.id === id);
      if (!reservation) return;

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'declined' as const } : r)),
      );

      startTransition(async () => {
        await updateStatusAction(id, 'declined');
        const facilityLabel = getFacilityLabel(reservation);
        const message = `Vaša rezervacija za ${facilityLabel} (${reservation.date}, ${reservation.startTime}) je odbijena.`;
        await createNotification(reservation.userId, 'Rezervacija Odbijena', message, 'danger', id, '/profile');
        router.refresh();
      });
    },
    [reservations, router],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setReservations((prev) => prev.filter((r) => r.id !== id));

      startTransition(async () => {
        await deleteAction(id);
        router.refresh();
      });
    },
    [router],
  );

  return {
    filteredReservations,
    statusCounts,
    filterStatus,
    filterFacility,
    searchQuery,
    isPending,
    setFilterStatus,
    setFilterFacility,
    setSearchQuery,
    handleConfirm,
    handleDecline,
    handleDelete,
  };
}
