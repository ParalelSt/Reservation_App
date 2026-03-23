import Image from 'next/image';
import Link from 'next/link';
import { Clock, CreditCard, Users, CheckCircle } from 'lucide-react';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';
import { formatCurrency } from '@/lib/helpers/formatCurrency';
import { MAX_GUESTS } from '@/lib/constants/facilities';
import type { FacilityInfo } from '@/types/reservation';

interface Props {
  facility: FacilityInfo;
}

/** Detailed view of a single facility with features and booking CTA */
export function FacilityDetail({ facility }: Props) {
  const highlights = [
    {
      icon: Users,
      title: 'Privatne Sesije',
      description: `Do ${MAX_GUESTS[facility.type]} osobe istovremeno — cijeli prostor je vaš.`,
    },
    {
      icon: CreditCard,
      title: 'Plati Koliko Želiš',
      description: `Minimalna cijena od ${formatCurrency(facility.minimumPricePerHour)}/sat. Platite više ako želite podržati prostor.`,
    },
    {
      icon: Clock,
      title: 'Fleksibilni Termini',
      description: 'Sesije od 1 do 4 sata, od 08:00 do 22:00.',
    },
  ];

  const highlightCards = highlights.map((highlight) => (
    <div key={highlight.title} className="flex items-start gap-3">
      <highlight.icon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-900">{highlight.title}</h3>
        <p className="text-sm text-gray-600">{highlight.description}</p>
      </div>
    </div>
  ));

  const featureList = facility.features.map((feature) => (
    <li key={feature} className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
      <span className="text-sm text-gray-700">{feature}</span>
    </li>
  ));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-16">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={facility.imageUrl}
            alt={facility.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>

        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{facility.name}</h1>
            <p className="text-lg text-gray-600">{facility.description}</p>
          </div>

          <div className={mergeClassNames(
            'flex items-center gap-4',
            'rounded-lg bg-indigo-50 px-4 py-3',
          )}>
            <span className="text-2xl font-bold text-indigo-700">
              {formatCurrency(facility.minimumPricePerHour)}
            </span>
            <span className="text-sm text-indigo-600">/ sat (minimalno)</span>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Što nudimo</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {featureList}
            </ul>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Kako funkcionira</h2>
            <div className="flex flex-col gap-4">
              {highlightCards}
            </div>
          </div>

          <Link
            href="/book"
            className={mergeClassNames(
              'w-full rounded-lg px-6 py-3',
              'text-center text-base font-medium text-white',
              'bg-indigo-600 hover:bg-indigo-700',
              'transition-all duration-150 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            )}
          >
            Rezerviraj {facility.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
