import HomeLogo from "@/components/HomeLogo";

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
          <li>Wcześniejsze zgłoszenia do zakończonego programu Early Access i komunikacja dot. projektu – zgoda (art. 6 ust. 1 lit. a RODO).</li>
          <li>Obsługa zapytań e-mail – uzasadniony interes (art. 6 ust. 1 lit. f RODO).</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Zakres danych</h2>
        <p className="text-slate-800 leading-relaxed">
          Wcześniejsze zgłoszenia Early Access obejmowały adres e-mail i opcjonalnie imię. Strona główna nie przyjmuje już tych zgłoszeń ani danych pacjentów.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Konto Orthobase i moduły</h2>
        <p className="text-slate-800 leading-relaxed">
          Konto Orthobase jest dostępne pod adresem dyzury.orthobase.pl. Możesz logować się przez Google lub jednorazowym kodem e-mail.
          Strona główna odczytuje wyłącznie informację, czy sesja konta jest aktywna, aby odpowiednio opisać odnośnik do konta.
          Nie otrzymuje z niego imienia, adresu e-mail, danych profilu ani tokenów logowania. Publiczne treści strony pozostają dostępne bez logowania.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Przeglądarka przekazuje plik sesji bezpośrednio do serwisu konta podczas sprawdzania statusu. Dane konta, logowanie, weryfikację lekarzy
          i propozycje dyżurowe opisuje osobna{" "}
          <a className="underline text-blue-700 hover:text-blue-800" href="https://dyzury.orthobase.pl/prywatnosc">informacja o danych konta Orthobase</a>.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Okres przechowywania</h2>
        <p className="text-slate-800 leading-relaxed">
          Dla wcześniejszych zgłoszeń Early Access: do czasu wycofania zgody lub zamknięcia programu, następnie maks. 30 dni.
          Informacje dotyczące przechowywania danych konta znajdują się w informacji o danych konta Orthobase.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Odbiorcy danych</h2>
        <p className="text-slate-800 leading-relaxed">
          Dostawcy hostingu strony głównej i poczty (Vercel, OVH). Usługi wykorzystywane przez konto Orthobase opisano w jego odrębnej informacji o danych.
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
        <p className="text-slate-800 leading-relaxed mt-3">
          Zamknięcie komunikatu o warsztacie zapamiętujemy przez 6 godzin w pliku cookie wspólnym dla orthobase.pl i jego subdomen, zawierającym tylko czas zakończenia ukrycia komunikatu.
        </p>

        <p className="text-xs text-slate-500 mt-8">
          Wersja: {new Date().toISOString().slice(0, 10)}
        </p>
        <div className="mt-6">
          <HomeLogo compact />
        </div>
      </section>
    </main>
  );
}
