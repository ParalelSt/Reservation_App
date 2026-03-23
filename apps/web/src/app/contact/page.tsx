import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pb-16">
      <h1 className="text-3xl font-bold text-gray-900">Kontakt</h1>
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
            <p className="text-gray-600">info@reservehub.com</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">Telefon</h2>
            <p className="text-gray-600">Kontakt broj će biti objavljen uskoro</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Za sva pitanja i rezervacije, slobodno nas kontaktirajte putem emaila.
        </p>
      </div>
    </div>
  );
}
