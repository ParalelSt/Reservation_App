import type { FacilityInfo } from '@/types/reservation';

/** Minimum price per hour for each facility type (in EUR) */
export const FACILITY_MINIMUM_PRICES = {
  STUDIO: 10,
  SAUNA: 6,
  GYM: 8,
} as const;

/** Available duration options in hours */
export const DURATION_OPTIONS = [1, 2, 3, 4] as const;

/** Maximum number of guests per facility type */
export const MAX_GUESTS = {
  studio: 5,
  sauna: 2,
  gym: 2,
} as const;

/** Operating hours */
export const OPERATING_HOURS = {
  OPEN: 8,
  CLOSE: 22,
} as const;

/** Time slot interval in minutes */
export const TIME_SLOT_INTERVAL = 60;

/** All facility information */
export const FACILITIES: FacilityInfo[] = [
  {
    type: 'studio',
    name: 'Glazbeni Studio',
    description:
      'Profesionalni glazbeni studio s vrhunskom opremom. Savršen za snimanje, miksanje i probe. Trenutno se opremamo najnovijom opremom.',
    minimumPricePerHour: FACILITY_MINIMUM_PRICES.STUDIO,
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    features: [
      'Profesionalna oprema za snimanje',
      'Zvučno izolirane prostorije',
      'Mikseta',
      'Razni instrumenti',
      'Monitor zvučnici',
    ],
  },
  {
    type: 'sauna',
    name: 'Sauna',
    description:
      'Opustite se i obnovite energiju u našoj premium sauni. Uživajte u toplinskoj terapiji u čistom, privatnom okruženju. Trenutno u izgradnji.',
    minimumPricePerHour: FACILITY_MINIMUM_PRICES.SAUNA,
    imageUrl: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=800&q=80',
    features: [
      'Finska suha sauna',
      'Privatne sesije',
      'Tuš kabine',
      'Usluga ručnika',
      'Prostor za opuštanje',
    ],
  },
  {
    type: 'gym',
    name: 'Teretana',
    description:
      'Privatne sesije u teretani s kvalitetnom opremom. Trenirajte bez gužve u svom vlastitom terminu. Oprema se trenutno instalira.',
    minimumPricePerHour: FACILITY_MINIMUM_PRICES.GYM,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    features: [
      'Slobodni utezi',
      'Kardio sprave',
      'Sprave za otpor',
      'Privatne sesije',
      'Svlačionice',
    ],
  },
];
