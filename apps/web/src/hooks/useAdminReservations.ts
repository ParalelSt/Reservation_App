'use client';

import { useState, useMemo, useCallback } from 'react';
import type { FacilityType, ReservationStatus } from '@/types/reservation';
import { useReservationStore } from '@/lib/store/reservationStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { showNotification } from '@/lib/helpers/notifications';

type FilterStatus = ReservationStatus | 'all';

const FACILITY_LABELS: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
};

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

/** Hook for managing the admin reservations view */
export function useAdminReservations() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterFacility, setFilterFacility] = useState<FacilityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const store = useReservationStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

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

  const getFacilityLabel = useCallback((reservationId: string): string => {
    const reservation = store.reservations.find((r) => r.id === reservationId);
    if (!reservation) return '';
    return FACILITY_TYPES
      .filter((type) => reservation.facilities[type] > 0)
      .map((type) => FACILITY_LABELS[type])
      .join(', ');
  }, [store.reservations]);

  const handleConfirm = useCallback(
    (id: string) => {
      const facilityLabel = getFacilityLabel(id);
      const reservation = store.reservations.find((r) => r.id === id);
      store.updateReservationStatus(id, 'confirmed');

      const message = `Vaša rezervacija za ${facilityLabel} (${reservation?.date}, ${reservation?.startTime}) je prihvaćena! Posjetite profil da dodate termin u kalendar.`;
      addNotification('Rezervacija Prihvaćena', message, 'success', id, '/profile');
      showNotification('Rezervacija Prihvaćena', message);
    },
    [store, addNotification, getFacilityLabel],
  );

  const handleDecline = useCallback(
    (id: string) => {
      const facilityLabel = getFacilityLabel(id);
      const reservation = store.reservations.find((r) => r.id === id);
      store.updateReservationStatus(id, 'declined');

      const message = `Vaša rezervacija za ${facilityLabel} (${reservation?.date}, ${reservation?.startTime}) je odbijena.`;
      addNotification('Rezervacija Odbijena', message, 'danger', id, '/profile');
      showNotification('Rezervacija Odbijena', message);
    },
    [store, addNotification, getFacilityLabel],
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
