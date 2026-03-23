import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, CreditCard, Users } from 'lucide-react';
import { FACILITIES } from '@/lib/constants/facilities';
import { formatCurrency } from '@/lib/helpers/formatCurrency';

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Jednostavna Rezervacija',
    description: 'Rezervirajte svoj termin u samo par klikova.',
  },
  {
    icon: Users,
    title: 'Privatne Sesije',
    description: 'Jedna osoba u isto vrijeme — uživajte u cijelom prostoru.',
  },
  {
    icon: CreditCard,
    title: 'Plati Koliko Želiš',
    description: 'Platite koliko želite iznad minimalne cijene. Podržite prostor.',
  },
  {
    icon: Clock,
    title: 'Fleksibilno Radno Vrijeme',
    description: 'Otvoreno od 8:00 do 22:00. Rezervirajte sesije od 1-4 sata.',
  },
] as const;

export default function HomePage() {
  const featureCards = FEATURES.map((feature) => (
    <div key={feature.title} className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <feature.icon className="h-8 w-8 text-indigo-600" />
      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
      <p className="text-sm text-gray-600">{feature.description}</p>
    </div>
  ));

  const facilityCards = FACILITIES.map((facility) => (
    <div key={facility.type} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={facility.imageUrl}
          alt={facility.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {facility.name}
        </h3>
        <p className="text-sm text-gray-600">{facility.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-indigo-600">
            Od {formatCurrency(facility.minimumPricePerHour)}/sat
          </span>
          <Link
            href="/book"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Rezerviraj
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2">
          {facility.features.map((feat) => (
            <li key={feat} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-center gap-6 pt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Rezervirajte Svoj Prostor
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Rezervirajte privatne sesije u našem glazbenom studiju, sauni ili teretani.
          Jedna osoba u isto vrijeme — cijeli prostor je vaš.
          Platite koliko želite, počevši od minimalne cijene.
        </p>
        <Link
          href="/book"
          className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white transition-all duration-150 ease-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Napravi Rezervaciju
        </Link>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-center text-2xl font-bold text-gray-900">Kako Funkcionira</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-center text-2xl font-bold text-gray-900">Naši Objekti</h2>
        <p className="text-center text-gray-600">
          Trenutno u izgradnji — pratite nas za novosti! Već sada možete rezervirati termine.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {facilityCards}
        </div>
      </section>
    </div>
  );
}
