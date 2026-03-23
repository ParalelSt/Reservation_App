export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pb-16">
      <h1 className="text-3xl font-bold text-gray-900">O Nama</h1>
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          Dobrodošli u ReserveHub — vaše mjesto za privatne sesije u glazbenom studiju, sauni i teretani.
          Naš cilj je pružiti kvalitetan prostor gdje možete uživati bez gužve, u potpunoj privatnosti.
        </p>
        <p className="text-gray-600">
          Trenutno smo u procesu izgradnje i opremanja naših objekata.
          Pratite nas za najnovije informacije o otvaranju!
        </p>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Naša Vizija</h2>
          <p className="text-gray-600">
            Vjerujemo da svatko zaslužuje pristup kvalitetnim prostorima za kreativnost, opuštanje i fitness.
            Naš model &quot;plati koliko želiš&quot; osigurava da su naši objekti dostupni svima.
          </p>
        </div>
      </div>
    </div>
  );
}
