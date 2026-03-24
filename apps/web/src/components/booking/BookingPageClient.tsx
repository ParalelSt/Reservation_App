'use client';

import { Music, Flame, Dumbbell, Clock, CreditCard, FileText, Users, Minus } from 'lucide-react';
import { useBookingForm } from '@/hooks/useBookingForm';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { formatCurrency } from '@/lib/helpers/formatCurrency';
import { formatTime } from '@/lib/helpers/timeSlots';
import { FACILITIES, DURATION_OPTIONS, MAX_GUESTS } from '@/lib/constants/facilities';
import { NumberStepper } from '@/components/shared/NumberStepper';
import { SuccessModal } from '@/components/shared/SuccessModal';
import type { FacilityType } from '@/types/reservation';

const FACILITY_ICONS: Record<FacilityType, typeof Music> = {
  studio: Music,
  sauna: Flame,
  gym: Dumbbell,
};

interface Props {
  user: { id: string; name: string; email: string } | null;
  today: string;
}

export function BookingPageClient({ user, today }: Props) {
  const {
    formState,
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
  } = useBookingForm(today);

  const loginPrompt = !user ? (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
      <p className="text-amber-800">
        Morate se prijaviti da biste napravili rezervaciju.
      </p>
      <a
        href="/auth/login"
        className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Prijava
      </a>
    </div>
  ) : null;

  const successModal = (
    <SuccessModal
      isOpen={submitSuccess}
      onClose={resetSuccess}
      title="Rezervacija Poslana!"
      message="Vaša rezervacija je uspješno poslana i čeka odobrenje. Možete pratiti status na stranici profila."
    />
  );

  const facilitySelectors = FACILITIES.map((facility) => {
    const Icon = FACILITY_ICONS[facility.type];
    const maxGuests = MAX_GUESTS[facility.type];
    const currentGuests = formState.facilities[facility.type];
    const isSelected = currentGuests > 0;
    const pricePerHour = facility.minimumPricePerHour;

    const guestButtons = Array.from({ length: maxGuests }, (_, i) => i + 1).map((count) => {
      const isActive = currentGuests === count;
      return (
        <button
          key={count}
          type="button"
          onClick={() => setFacilityGuests(facility.type, count)}
          aria-label={`${count} ${count === 1 ? 'osoba' : 'osobe'} za ${facility.name}`}
          className={mergeClassNames(
            'h-8 w-8 rounded-lg',
            'text-sm font-medium',
            'border transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            isActive
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300',
          )}
        >
          {count}
        </button>
      );
    });

    return (
      <div
        key={facility.type}
        className={mergeClassNames(
          'flex flex-col gap-3',
          'rounded-lg border p-4',
          'transition-all duration-150 ease-out',
          isSelected
            ? 'border-indigo-300 bg-indigo-50'
            : 'border-gray-200 bg-white',
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-gray-900">{facility.name}</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatCurrency(pricePerHour)}/sat po osobi
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Broj osoba</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFacilityGuests(facility.type, 0)}
              aria-label={`Isključi ${facility.name}`}
              className={mergeClassNames(
                'flex h-8 w-8 items-center justify-center',
                'rounded-lg',
                'text-sm font-medium',
                'border transition-all duration-150 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                !isSelected
                  ? 'border-gray-300 bg-white text-gray-600'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300',
              )}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            {guestButtons}
          </div>
        </div>

        {isSelected && (
          <p className="text-xs text-indigo-600">
            {formatCurrency(pricePerHour * currentGuests * formState.durationHours)} za {currentGuests} {currentGuests === 1 ? 'osobu' : 'osobe'} × {formState.durationHours}h
          </p>
        )}
      </div>
    );
  });

  const facilitySection = (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">
        Odaberite objekte i broj osoba
      </label>
      {facilitySelectors}
      {!hasAnyFacility && (
        <p className="text-sm text-amber-600">
          Odaberite barem jedan objekt
        </p>
      )}
    </div>
  );

  const dateInput = (
    <div className="flex flex-col gap-2">
      <label htmlFor="booking-date" className="text-sm font-medium text-gray-700">
        Datum
      </label>
      <input
        id="booking-date"
        type="date"
        value={formState.date}
        onChange={(e) => setDate(e.target.value)}
        min={today}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-all duration-150 ease-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  const availableSlots = timeSlots.filter((slot) => slot.isAvailable);

  const timeSelector = (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Clock className="h-4 w-4" />
        Vrijeme početka
      </label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {availableSlots.map((slot) => {
          const isSelected = formState.startTime === slot.time;
          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => setStartTime(slot.time)}
              aria-label={`Odaberi ${formatTime(slot.time)}`}
              className={mergeClassNames(
                'rounded-lg px-3 py-2',
                'text-sm font-medium',
                'border transition-all duration-150 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300',
              )}
            >
              {formatTime(slot.time)}
            </button>
          );
        })}
      </div>
    </div>
  );

  const durationSelector = (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Trajanje (sati)</label>
      <div className="flex gap-2">
        {DURATION_OPTIONS.map((hours) => {
          const isSelected = formState.durationHours === hours;
          return (
            <button
              key={hours}
              type="button"
              onClick={() => setDurationHours(hours)}
              aria-label={`${hours} ${hours === 1 ? 'sat' : 'sata'}`}
              className={mergeClassNames(
                'rounded-lg px-4 py-2.5',
                'text-sm font-medium',
                'border transition-all duration-150 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300',
              )}
            >
              {hours}h
            </button>
          );
        })}
      </div>
      {!isEndTimeValid && (
        <p className="text-sm text-red-500">
          Sesija prelazi radno vrijeme (do 22:00)
        </p>
      )}
      {hasConflict && isEndTimeValid && (
        <p className="text-sm text-red-500">
          Odabrano vrijeme se preklapa s postojećom rezervacijom
        </p>
      )}
    </div>
  );

  const endTimeNotice = isEndTimeValid && !hasConflict ? (
    <p className="text-sm text-gray-500">
      {formatTime(formState.startTime)} — {formatTime(endTime)}
    </p>
  ) : null;

  const paymentSection = hasAnyFacility ? (
    <div className="flex flex-col gap-2">
      <label htmlFor="payment-amount" className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <CreditCard className="h-4 w-4" />
        Iznos plaćanja (EUR)
      </label>
      <p className="text-xs text-gray-500">
        Minimalna cijena: {formatCurrency(minimumPrice)}
      </p>
      <NumberStepper
        id="payment-amount"
        value={formState.paymentAmount}
        onChange={setPaymentAmount}
        min={minimumPrice}
        step={0.5}
        placeholder={`Min. ${minimumPrice.toFixed(2)}`}
        hasError={!isPaymentValid && formState.paymentAmount > 0}
        label="Iznos plaćanja"
      />
      {!isPaymentValid && formState.paymentAmount > 0 && (
        <p className="text-sm text-red-500">
          Iznos mora biti najmanje {formatCurrency(minimumPrice)}
        </p>
      )}
    </div>
  ) : null;

  const notesSection = (
    <div className="flex flex-col gap-2">
      <label htmlFor="booking-notes" className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <FileText className="h-4 w-4" />
        Napomene (opcionalno)
      </label>
      <textarea
        id="booking-notes"
        value={formState.notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Dodatne napomene ili zahtjevi..."
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-all duration-150 ease-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  const submitButton = user ? (
    <button
      type="button"
      disabled={!isFormValid || isSubmitting}
      onClick={() => handleSubmit(user.id, user.name, user.email)}
      aria-label="Pošalji rezervaciju"
      className={mergeClassNames(
        'w-full rounded-lg px-6 py-3',
        'text-base font-medium text-white',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isFormValid
          ? 'bg-indigo-600 hover:bg-indigo-700'
          : 'bg-gray-400',
      )}
    >
      {isSubmitting ? 'Slanje...' : 'Pošalji Rezervaciju'}
    </button>
  ) : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Rezervacija</h1>
        <p className="text-gray-600">
          Odaberite objekte, datum i vrijeme za vašu privatnu sesiju.
        </p>
      </div>

      {loginPrompt}
      {successModal}

      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {facilitySection}
        {dateInput}
        {timeSelector}
        {durationSelector}
        {endTimeNotice}
        {paymentSection}
        {notesSection}
        {submitButton}
      </div>
    </div>
  );
}
