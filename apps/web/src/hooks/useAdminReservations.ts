'use client';

import { useState, useMemo, useCallback } from 'react';
import type { FacilityType, ReservationStatus } from '@/types/reservation';
import { useReservationStore } from '@/lib/store/reservationStore';

type FilterStatus = ReservationStatus | 'all';

/** Hook for managing the admin reservations view */
export function useAdminReservations() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterFacility, setFilterFacility] = useState<FacilityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const store = useReservationStore();

  const filteredReservations = useMemo(() => {
    let result = store.reservations;

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

    // Sort by creation date, newest first
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [store.reservations, filterStatus, filterFacility, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, pending: 0, confirmed: 0, declined: 0, cancelled: 0 };
    for (const reservation of store.reservations) {
      counts.all++;
      counts[reservation.status]++;
    }
    return counts;
  }, [store.reservations]);

  const handleConfirm = useCallback(
    (id: string) => {
      store.updateReservationStatus(id, 'confirmed');
    },
    [store],
  );

  const handleDecline = useCallback(
    (id: string) => {
      store.updateReservationStatus(id, 'declined');
    },
    [store],
  );

  const handleDelete = useCallback(
    (id: string) => {
      store.deleteReservation(id);
    },
    [store],
  );

  return {
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
  };
}
