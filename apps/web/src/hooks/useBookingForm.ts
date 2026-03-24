'use client';

import { useState, useCallback, useMemo } from 'react';
import type { FacilityType, FacilitySelection, Reservation, ReservationFormData } from '@/types/reservation';
import { FACILITIES, DURATION_OPTIONS, OPERATING_HOURS, MAX_GUESTS } from '@/lib/constants/facilities';
import { useReservationStore } from '@/lib/store/reservationStore';
import { generateTimeSlots, calculateEndTime, hasTimeConflict } from '@/lib/helpers/timeSlots';
import { useHydrated } from '@/hooks/useHydrated';
import {
  requestNotificationPermission,
  showBookingConfirmation,
  scheduleReservationReminder,
} from '@/lib/helpers/notifications';

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

const FACILITY_LABELS: Record<FacilityType, string> = {
  studio: 'Glazbeni Studio',
  sauna: 'Sauna',
  gym: 'Teretana',
};

const EMPTY_FACILITIES: FacilitySelection = {
  studio: 0,
  sauna: 0,
  gym: 0,
};

interface BookingFormState {
  facilities: FacilitySelection;
  date: string;
  startTime: string;
  durationHours: number;
  paymentAmount: number;
  notes: string;
}

/** Hook for managing the reservation booking form */
export function useBookingForm(today: string) {
  const [formState, setFormState] = useState<BookingFormState>({
    facilities: { ...EMPTY_FACILITIES },
    date: today,
    startTime: `${OPERATING_HOURS.OPEN.toString().padStart(2, '0')}:00`,
    durationHours: DURATION_OPTIONS[0],
    paymentAmount: 0,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastReservation, setLastReservation] = useState<Reservation | null>(null);

  const hydrated = useHydrated();
  const store = useReservationStore();

  const selectedFacilityTypes = useMemo(
    () => FACILITY_TYPES.filter((type) => formState.facilities[type] > 0),
    [formState.facilities],
  );

  const hasAnyFacility = selectedFacilityTypes.length > 0;

  const minimumPrice = useMemo(() => {
    return FACILITY_TYPES.reduce((total, type) => {
      const guestCount = formState.facilities[type];
      if (guestCount === 0) return total;
      const facility = FACILITIES.find((f) => f.type === type);
      return total + (facility?.minimumPricePerHour ?? 0) * formState.durationHours * guestCount;
    }, 0);
  }, [formState.facilities, formState.durationHours]);

  // All bookings for the selected date — shared space, so any booking blocks the time
  // Use empty array until hydrated to avoid server/client mismatch
  const allExistingBookings = useMemo(
    () => {
      if (!hydrated) return [];
      return store
        .getAllReservationsByDate(formState.date)
        .map((b) => ({ startTime: b.startTime, endTime: b.endTime }));
    },
    [store, formState.date, hydrated],
  );

  const timeSlots = useMemo(
    () => generateTimeSlots(allExistingBookings),
    [allExistingBookings],
  );

  const endTime = useMemo(
    () => calculateEndTime(formState.startTime, formState.durationHours),
    [formState.startTime, formState.durationHours],
  );

  const isEndTimeValid = useMemo(() => {
    const endHour = parseInt(endTime.split(':')[0], 10);
    return endHour <= OPERATING_HOURS.CLOSE;
  }, [endTime]);

  const hasConflict = useMemo(
    () => hasTimeConflict(formState.startTime, endTime, allExistingBookings),
    [formState.startTime, endTime, allExistingBookings],
  );

  const isPaymentValid = useMemo(
    () => formState.paymentAmount >= minimumPrice,
    [formState.paymentAmount, minimumPrice],
  );

  const isFormValid = useMemo(
    () =>
      hasAnyFacility &&
      isEndTimeValid &&
      isPaymentValid &&
      !hasConflict &&
      formState.date >= today,
    [hasAnyFacility, isEndTimeValid, isPaymentValid, hasConflict, formState.date, today],
  );

  const resetSuccess = useCallback(() => {
    setSubmitSuccess(false);
  }, []);

  const setFacilityGuests = useCallback((facilityType: FacilityType, count: number) => {
    const max = MAX_GUESTS[facilityType];
    const clamped = Math.max(0, Math.min(count, max));
    setFormState((prev) => ({
      ...prev,
      facilities: { ...prev.facilities, [facilityType]: clamped },
    }));
    setSubmitSuccess(false);
  }, []);

  const setDate = useCallback((date: string) => {
    setFormState((prev) => ({ ...prev, date }));
    setSubmitSuccess(false);
  }, []);

  const setStartTime = useCallback((startTime: string) => {
    setFormState((prev) => ({ ...prev, startTime }));
    setSubmitSuccess(false);
  }, []);

  const setDurationHours = useCallback((durationHours: number) => {
    setFormState((prev) => ({ ...prev, durationHours }));
    setSubmitSuccess(false);
  }, []);

  const setPaymentAmount = useCallback((paymentAmount: number) => {
    setFormState((prev) => ({ ...prev, paymentAmount }));
    setSubmitSuccess(false);
  }, []);

  const setNotes = useCallback((notes: string) => {
    setFormState((prev) => ({ ...prev, notes }));
  }, []);

  const handleSubmit = useCallback(
    async (userId: string, userName: string, userEmail: string) => {
      if (!isFormValid) return;

      setIsSubmitting(true);

      const formData: ReservationFormData = {
        facilities: formState.facilities,
        date: formState.date,
        startTime: formState.startTime,
        durationHours: formState.durationHours,
        paymentAmount: formState.paymentAmount,
        notes: formState.notes,
      };

      const reservation = store.addReservation(formData, userId, userName, userEmail);
      setLastReservation(reservation);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Send push notification and schedule reminder
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const facilityNames = selectedFacilityTypes.map((t) => FACILITY_LABELS[t]).join(', ');
        showBookingConfirmation(facilityNames, formState.date, formState.startTime);
        scheduleReservationReminder(facilityNames, formState.date, formState.startTime);
      }

      // Reset payment and notes after submit
      setFormState((prev) => ({ ...prev, paymentAmount: 0, notes: '' }));
    },
    [formState, isFormValid, store, selectedFacilityTypes],
  );

  return {
    formState,
    selectedFacilityTypes,
    hasAnyFacility,
    minimumPrice,
    timeSlots,
    endTime,
    isEndTimeValid,
    hasConflict,
    isPaymentValid,
    isFormValid,
    isSubmitting,
    submitSuccess,
    lastReservation,
    resetSuccess,
    setFacilityGuests,
    setDate,
    setStartTime,
    setDurationHours,
    setPaymentAmount,
    setNotes,
    handleSubmit,
  };
}
