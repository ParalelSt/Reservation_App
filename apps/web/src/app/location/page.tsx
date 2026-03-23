import { MapPin, Clock } from 'lucide-react';

export default function LocationPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pb-16">
      <h1 className="text-3xl font-bold text-gray-900">Lokacija</h1>
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">Adresa</h2>
            <p className="text-gray-600">Adresa će biti objavljena uskoro</p>
            <p className="text-sm text-gray-500">Lokacija je trenutno u pripremi</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">Radno Vrijeme</h2>
            <p className="text-gray-600">Ponedjeljak — Nedjelja: 08:00 — 22:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
