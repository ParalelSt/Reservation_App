'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FacilityType, FacilitySelection, Reservation } from '@/types/reservation';
import { FACILITIES, DURATION_OPTIONS, OPERATING_HOURS, MAX_GUESTS, FIXED_PRICE_FACILITIES } from '@/lib/constants/facilities';
import { generateTimeSlots, calculateEndTime, hasTimeConflict } from '@/lib/helpers/timeSlots';
import { createReservation, getActiveReservationsByDate } from '@/lib/actions/reservations';
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
  const [existingBookings, setExistingBookings] = useState<{ startTime: string; endTime: string }[]>([]);

  // Fetch existing bookings for the selected date from the database
  useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      const reservations = await getActiveReservationsByDate(formState.date);
      if (!cancelled) {
        setExistingBookings(
          reservations.map((b) => ({ startTime: b.startTime, endTime: b.endTime })),
        );
      }
    }

    fetchBookings();
    return () => { cancelled = true; };
  }, [formState.date, submitSuccess]);

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
      const pricePerHour = facility?.minimumPricePerHour ?? 0;
      const isFixed = FIXED_PRICE_FACILITIES.includes(type);
      const multiplier = isFixed ? 1 : guestCount;
      return total + pricePerHour * formState.durationHours * multiplier;
    }, 0);
  }, [formState.facilities, formState.durationHours]);

  const timeSlots = useMemo(
    () => generateTimeSlots(existingBookings),
    [existingBookings],
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
    () => hasTimeConflict(formState.startTime, endTime, existingBookings),
    [formState.startTime, endTime, existingBookings],
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

      await createReservation(
        formState.facilities,
        formState.date,
        formState.startTime,
        formState.durationHours,
        formState.paymentAmount,
        formState.notes,
        userId,
        userName,
        userEmail,
      );

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
    [formState, isFormValid, selectedFacilityTypes],
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
