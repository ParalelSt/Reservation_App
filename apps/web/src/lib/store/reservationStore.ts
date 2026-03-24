import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Reservation, ReservationFormData, FacilityType, FacilitySelection } from '@/types/reservation';
import { generateId } from '@/lib/helpers/generateId';
import { calculateEndTime } from '@/lib/helpers/timeSlots';
import { FACILITIES } from '@/lib/constants/facilities';

const FACILITY_TYPES: FacilityType[] = ['studio', 'sauna', 'gym'];

interface ReservationState {
  reservations: Reservation[];
  addReservation: (formData: ReservationFormData, userId: string, userName: string, userEmail: string) => Reservation;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  deleteReservation: (id: string) => void;
  getReservationsByFacility: (facilityType: FacilityType) => Reservation[];
  getReservationsByDate: (facilityType: FacilityType, date: string) => Reservation[];
  getAllReservationsByDate: (date: string) => Reservation[];
  getReservationsByUser: (userId: string) => Reservation[];
}

/** Calculate the minimum price based on selected facilities and duration */
function calculateMinimumPrice(facilities: FacilitySelection, durationHours: number): number {
  return FACILITY_TYPES.reduce((total, type) => {
    const guestCount = facilities[type];
    if (guestCount === 0) return total;
    const facility = FACILITIES.find((f) => f.type === type);
    return total + (facility?.minimumPricePerHour ?? 0) * durationHours * guestCount;
  }, 0);
}

/** Check if a reservation uses a specific facility */
function reservationUsesFacility(reservation: Reservation, facilityType: FacilityType): boolean {
  return reservation.facilities[facilityType] > 0;
}

/** Store for managing reservations with localStorage persistence */
export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservations: [],

      addReservation: (formData, userId, userName, userEmail) => {
        const minimumPrice = calculateMinimumPrice(formData.facilities, formData.durationHours);
        const endTime = calculateEndTime(formData.startTime, formData.durationHours);

        const reservation: Reservation = {
          id: generateId(),
          facilities: formData.facilities,
          userId,
          userName,
          userEmail,
          date: formData.date,
          startTime: formData.startTime,
          endTime,
          durationHours: formData.durationHours,
          minimumPrice,
          paidAmount: formData.paymentAmount,
          status: 'pending',
          createdAt: new Date().toISOString(),
          notes: formData.notes,
        };

        set((state) => ({
          reservations: [...state.reservations, reservation],
        }));

        return reservation;
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status } : r,
          ),
        }));
      },

      deleteReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.filter((r) => r.id !== id),
        }));
      },

      getReservationsByFacility: (facilityType) => {
        return get().reservations.filter((r) => reservationUsesFacility(r, facilityType));
      },

      getReservationsByDate: (facilityType, date) => {
        return get().reservations.filter(
          (r) =>
            reservationUsesFacility(r, facilityType) &&
            r.date === date &&
            r.status !== 'cancelled' &&
            r.status !== 'declined',
        );
      },

      getAllReservationsByDate: (date) => {
        return get().reservations.filter(
          (r) =>
            r.date === date &&
            r.status !== 'cancelled' &&
            r.status !== 'declined',
        );
      },

      getReservationsByUser: (userId) => {
        return get().reservations.filter((r) => r.userId === userId);
      },
    }),
    {
      name: 'reservation-storage',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { reservations?: Reservation[] };
        // Wipe old-format reservations — they used a different schema (single facilityType)
        return { reservations: state.reservations?.filter((r) => r.facilities) ?? [] };
      },
    },
  ),
);
