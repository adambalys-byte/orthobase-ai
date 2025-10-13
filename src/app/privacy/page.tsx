export default function Privacy() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-8 md:py-14">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/95 p-6 md:p-10 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Polityka prywatności – OrthoBase AI
        </h1>

        <p className="text-slate-800 mb-3 leading-relaxed">
          Administratorem danych osobowych jest <strong>Adam Bałys</strong> (OrthoBase AI). Kontakt:{" "}
          <a className="underline text-blue-700 hover:text-blue-800" href="mailto:kontakt@orthobase.pl">
            kontakt@orthobase.pl
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Cel i podstawa przetwarzania</h2>
        <ul className="list-disc pl-5 text-slate-800 space-y-1">
          <li>Lista Early Access i komunikacja dot. projektu – zgoda (art. 6 ust. 1 lit. a RODO).</li>
          <li>Obsługa zapytań e-mail – uzasadniony interes (art. 6 ust. 1 lit. f RODO).</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Zakres danych</h2>
        <p className="text-slate-800 leading-relaxed">
          Adres e-mail (opcjonalnie imię). Na tym etapie nie gromadzimy danych medycznych.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Okres przechowywania</h2>
        <p className="text-slate-800 leading-relaxed">
          Do czasu wycofania zgody lub zamknięcia programu Early Access, następnie maks. 30 dni.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Odbiorcy danych</h2>
        <p className="text-slate-800 leading-relaxed">
          Dostawcy hostingu i poczty w UE/EOG (OVH, Vercel). Dane nie są przekazywane poza EOG.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Prawa osób</h2>
        <ul className="list-disc pl-5 text-slate-800 space-y-1">
          <li>dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, przenoszenie;</li>
          <li>wycofanie zgody w dowolnym momencie (bez wpływu na wcześniejsze przetwarzanie);</li>
          <li>skarga do PUODO.</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Pliki cookies i analityka</h2>
        <p className="text-slate-800 leading-relaxed">
          Obecnie nie stosujemy narzędzi analitycznych. Informacja zostanie zaktualizowana po wdrożeniu analityki.
        </p>

        <p className="text-xs text-slate-500 mt-8">
          Wersja: {new Date().toISOString().slice(0, 10)}
        </p>
      </section>
    </main>
  );
}
