/** Status of a reservation */
type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled';

/** Type of facility that can be reserved */
type FacilityType = 'studio' | 'sauna' | 'gym';

/** Guest count per facility (0 = not using that facility) */
export interface FacilitySelection {
  studio: number;
  sauna: number;
  gym: number;
}

/** A single reservation record */
export interface Reservation {
  id: string;
  facilities: FacilitySelection;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  minimumPrice: number;
  paidAmount: number;
  status: ReservationStatus;
  createdAt: string;
  notes: string;
}

/** Form data for creating a new reservation */
export interface ReservationFormData {
  facilities: FacilitySelection;
  date: string;
  startTime: string;
  durationHours: number;
  paymentAmount: number;
  notes: string;
}

/** A time slot that can be booked */
export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

/** Facility information for display */
export interface FacilityInfo {
  type: FacilityType;
  name: string;
  description: string;
  minimumPricePerHour: number;
  imageUrl: string;
  features: string[];
}

export type { ReservationStatus, FacilityType };
