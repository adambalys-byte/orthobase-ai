import HomeLogo from "@/components/HomeLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prywatność | Orthobase",
  description: "Informacje o danych, wspólnym koncie, publicznych stronach Orthobase i formularzach Szkoły Kształcenia Rezydentów.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Prywatność | Orthobase", description: "Informacje o danych i usługach Orthobase.",
    url: "https://www.orthobase.pl/privacy", siteName: "Orthobase", locale: "pl_PL", type: "website",
    images: [{ url: "/orthobase-og.png", width: 1200, height: 630, alt: "Orthobase — narzędzia dla ortopedii" }],
  },
  twitter: { card: "summary_large_image", title: "Prywatność | Orthobase", description: "Informacje o danych i usługach Orthobase.", images: ["/orthobase-og.png"] },
};

export default function Privacy() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-8 md:py-14">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/95 p-6 md:p-10 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Polityka prywatności – Orthobase
        </h1>

        <p className="text-slate-800 mb-3 leading-relaxed">
          Administratorem danych osobowych jest <strong>Adam Bałys</strong> (Orthobase). Kontakt:{" "}
          <a className="underline text-blue-700 hover:text-blue-800" href="mailto:kontakt@orthobase.pl">
            kontakt@orthobase.pl
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Cele i podstawy przetwarzania</h2>
        <ul className="list-disc pl-5 text-slate-800 space-y-1">
          <li>Wcześniejsze zgłoszenia do zakończonego programu Early Access i komunikacja dot. projektu – zgoda (art. 6 ust. 1 lit. a RODO).</li>
          <li>Odpowiadanie na dobrowolne zapytania i wyjaśnianie zgłoszonych problemów – uzasadniony interes administratora polegający na obsłudze korespondencji (art. 6 ust. 1 lit. f RODO).</li>
          <li>Niezbędne zabezpieczanie serwisu przed nadużyciami, w tym krótkotrwałe ograniczanie sztucznych odsłon – uzasadniony interes administratora polegający na ochronie usługi (art. 6 ust. 1 lit. f RODO).</li>
        </ul>
        <p className="text-slate-800 leading-relaxed mt-3">
          Konto służy uwierzytelnieniu i weryfikacji lekarzy, Dyżury — zbieraniu propozycji i udostępnianiu grafików,
          a funkcje SKR — organizacji zajęć oraz ocenie szkolenia. Szczegółowy zakres opisujemy poniżej i w informacji o danych konta.
          Potwierdzenie poprawności profilu lub zapoznanie się z tą informacją nie stanowi zgody na dowolne wykorzystanie danych
          ani na nowe cele przetwarzania.
        </p>

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
          i propozycje dyżurowe, ankiety oraz listy obecności opisuje osobna{" "}
          <a className="underline text-blue-700 hover:text-blue-800" href="https://dyzury.orthobase.pl/prywatnosc">informacja o danych konta Orthobase</a>.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Strona SKR otrzymuje także informację, czy zalogowana osoba może otworzyć swoje ankiety, aby wyświetlić odpowiedni odnośnik.
          Nie pobiera w tym celu nazwiska, odpowiedzi ankiet ani pełnego profilu. Dostęp do danych sprawdza osobno serwis konta.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Okres przechowywania</h2>
        <p className="text-slate-800 leading-relaxed">
          Dla wcześniejszych zgłoszeń Early Access: do czasu wycofania zgody lub zamknięcia programu, następnie maks. 30 dni.
          Ten termin pozostaje zasadą dla tych zgłoszeń; nie wydłużamy go przez rozwój nowych modułów.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Wygaśnięcie kodu logowania lub sesji nie usuwa konta, propozycji, ankiet, list obecności ani historii wiadomości.
          Obecnie nie działa automatyczne usuwanie tych zbiorów według stałych okresów. Nowe okresy retencji są przedmiotem
          przygotowywanych zasad i nie zostały jeszcze wdrożone. W sprawie przechowywania, ograniczenia lub usunięcia swoich danych
          skontaktuj się z Administratorem. Informacje o działających mechanizmach konta znajdują się w jego informacji o danych.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Dane mogą znajdować się w kilku powiązanych miejscach: aplikacji, formularzach i arkuszach Google, historii korespondencji
          oraz kopiach pobranych przez uprawnione osoby. Samo zamknięcie konta nie usuwa automatycznie wszystkich tych kopii.
          Rozpatrując wniosek, uwzględniamy jego zakres, właściwe prawa osoby i ewentualne obowiązki dalszego przechowywania.
        </p>

        <h2 id="szkola" className="text-xl font-semibold text-slate-900 mt-6 mb-2">Szkoła, zgłoszenia i korespondencja</h2>
        <p className="text-slate-800 leading-relaxed">
          Program, terminy spotkań i materiały SKR są publiczne. Formularze zapisów na warsztaty,
          zgłoszeń prezentacji i materiałów otwierają się w Google Forms; odpowiedzi trafiają do arkuszy Google.
          Zakres wymaganych i opcjonalnych danych pokazuje dany formularz. Organizatorzy wykorzystują zgłoszenia
          do kontaktu z uczestnikami, organizacji wydarzeń i ustalenia programu. Wysłanie formularza nie oznacza
          automatycznego potwierdzenia miejsca. Odpowiedzi nie są publicznie wyświetlane na stronie SKR.
          W opublikowanym programie mogą pojawiać się nazwiska prowadzących i prelegentów oraz tematy wystąpień.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Korespondencja organizacyjna jest wysyłana przez Resend lub Google/Gmail. W panelu administratora Orthobase
          może być przechowywana kopia wysłanej wiadomości: jej treść, adresat, temat, czas i wynik próby wysyłki.
          Tę historię udostępniamy wyłącznie administratorowi. Nie oznacza to dostępu do poczty uczestników.
          W formularzach i przesyłanych materiałach nie podawaj danych identyfikujących pacjentów.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Formularze Google mają własny ekran logowania, niezależny od konta Orthobase. Przejście do formularza
          wiąże się z korzystaniem z usług Google zgodnie z jego{" "}
          <a className="underline text-blue-700 hover:text-blue-800" href="https://policies.google.com/privacy?hl=pl">polityką prywatności</a>.
          W sprawie własnego zgłoszenia lub jego korekty napisz na kontakt@orthobase.pl.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Ankiety, warsztaty i obecności</h2>
        <p className="text-slate-800 leading-relaxed">
          Ankiety po rotacji są imienne. Obejmują samoocenę i ocenę oddziału, powiązanie z listą rezydentów,
          oddział i okres szkolenia oraz daty zapisu i zatwierdzenia. Autor ma dostęp do własnych odpowiedzi.
          Zatwierdzone wyniki są dostępne Administratorowi i wyznaczonemu kontu prof. Marcina Tyrakowskiego;
          tylko te uprawnione osoby mogą pobierać zbiorcze pliki Excel, PDF lub Word. Cudze szkice nie są udostępniane im w interfejsie.
          Ankiety nie są anonimowe i nie publikujemy ich odpowiedzi na publicznej stronie SKR.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Rejestry zajęć obejmują imię i nazwisko, termin, obecność albo nieobecność, usprawiedliwienie oraz historię korekt.
          W odrębnym pilotażu warsztatów zapisujemy także zgłoszenie, dostępność, przydział, zaliczenie,
          poziom zaawansowania i notatki szkoleniowe. Obecność nie oznacza automatycznie zaliczenia.
          Listy zwykłych zajęć i ich eksporty są dostępne Administratorowi i przypisanemu uprawnionemu opiekunowi naukowemu;
          rezydent może sprawdzić własny status w dostępnym mu widoku. Prowadzący warsztat otrzymuje dostęp tylko do przydzielonych zajęć.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Nowe usprawiedliwienia obecności zapisujemy bez podawania przyczyny. W widokach i eksportach dostępny jest wyłącznie status nieobecności usprawiedliwionej.
          W starszych zapisach mogą pozostawać kategorie przyczyn, w tym informacja o zwolnieniu lekarskim dotycząca zdrowia; nie są ujawniane przez zwykłe widoki ani eksporty listy.
          Nie oznacza to automatycznego usunięcia starszych zapisów. Nie przesyłaj diagnoz, kodów choroby, skanów zwolnień ani dokumentacji pacjentów.
          W sprawie wyjaśnienia lub ograniczenia przetwarzania własnych danych skontaktuj się z Administratorem.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Skąd otrzymujemy dane</h2>
        <p className="text-slate-800 leading-relaxed">
          Dane otrzymujemy bezpośrednio z profilu, propozycji, ankiet, formularzy i korespondencji, a także z list szkolenia
          przekazanych przez organizatorów, udostępnionych grafików szpitala oraz rejestrów warsztatów.
          Dotyczy to również osób, które nie mają konta Orthobase. Ręczne powiązanie konta z listą pozwala przypisać właściwe dane do osoby;
          podobne nazwisko nie wystarcza do nadania dostępu. Możesz uzyskać informację o źródle danych odnoszących się do Ciebie
          i zgłosić pomyłkę pod adresem kontaktowym.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Dobrowolne wsparcie</h2>
        <p className="text-slate-800 leading-relaxed">
          Przycisk „Wesprzyj rozwój Orthobase” prowadzi do zewnętrznego profilu BuyCoffee.to.
          Płatność odbywa się w serwisie operatora; strony Orthobase nie przyjmują numerów kart ani kodów BLIK.
          Przed wpłatą zapoznaj się z informacją o prywatności i warunkami wyświetlanymi przez operatora.
          Wsparcie jest dobrowolne i nie wpływa na weryfikację konta ani dostęp do modułów.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Odbiorcy danych</h2>
        <p className="text-slate-800 leading-relaxed">
          Dostawcy hostingu strony głównej i poczty (Vercel, OVH). Usługi wykorzystywane przez konto Orthobase opisano w jego odrębnej informacji o danych.
        </p>

        <p className="text-slate-800 leading-relaxed mt-3">
          SKR i Dyżury korzystają z Sites i infrastruktury Cloudflare. Google obsługuje logowanie,
          formularze, arkusze i część korespondencji, a Resend — wiadomości automatyczne.
          Osoby upoważnione do organizacji dyżurów i SKR otrzymują dane potrzebne do obsługi tych zadań.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Korzystanie z dostawców międzynarodowych może wiązać się z przetwarzaniem danych poza Europejskim Obszarem Gospodarczym.
          Resend informuje, że przechowuje dane w USA, także przy wyborze europejskiego regionu wysyłki,
          i opisuje standardowe klauzule umowne w swojej{" "}
          <a className="underline text-blue-700 hover:text-blue-800" href="https://resend.com/legal/dpa">umowie powierzenia danych</a>.
          Okres przechowywania wiadomości u dostawcy jest odrębny od historii wiadomości w Orthobase.
          Informacje o zabezpieczeniach transferów dotyczących Twoich danych możesz uzyskać pod adresem kontaktowym.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Prawa osób</h2>
        <ul className="list-disc pl-5 text-slate-800 space-y-1">
          <li>Prawo dostępu do własnych danych i uzyskania ich kopii oraz sprostowania danych nieprawidłowych.</li>
          <li>Prawo usunięcia, ograniczenia, sprzeciwu lub przenoszenia danych — w przypadkach i na warunkach określonych w RODO, zależnie od podstawy i celu przetwarzania.</li>
          <li>Gdy podstawą jest zgoda: jej wycofanie w dowolnym momencie, bez wpływu na zgodność z prawem wcześniejszego przetwarzania.</li>
          <li>Prawo skargi do Prezesa Urzędu Ochrony Danych Osobowych: <a className="underline text-blue-700 hover:text-blue-800" href="https://uodo.gov.pl/">uodo.gov.pl</a>.</li>
        </ul>
        <p className="text-slate-800 leading-relaxed mt-3">
          Wniosek możesz przesłać na kontakt@orthobase.pl. Odpowiadamy co do zasady w ciągu miesiąca;
          o uzasadnionym przedłużeniu, jego przyczynach lub odmowie informujemy w tym terminie.
          Możemy poprosić o niezbędne potwierdzenie tożsamości, jeżeli istnieją uzasadnione wątpliwości.
          Zamknięcie listy lub zablokowanie samodzielnej edycji zatwierdzonej ankiety nie odbiera tych praw.
          Brak przycisku eksportu w koncie rezydenta nie ogranicza prawa otrzymania kopii własnych danych.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Pliki cookies i analityka</h2>
        <p className="text-slate-800 leading-relaxed">
          Prowadzimy zbiorcze liczniki odsłon strony głównej i tej informacji o prywatności. Nie służą identyfikacji użytkowników.
          Statystyki obejmują wyłącznie dzień w strefie Europe/Warsaw, jedną z dwóch ścieżek strony i liczbę odsłon;
          nie pokazują liczby unikalnych osób. Nie używają cookies ani identyfikatorów urządzenia, nie zapisują danych konta,
          parametrów adresu, źródła wejścia ani historii przeglądania. Przekazujemy je do własnego zaplecza Orthobase w serwisie Dyżury.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Aby ograniczyć sztuczne nabijanie liczników, zaplecze przetwarza adres IP wyłącznie do utworzenia krótkotrwałego,
          zmiennego co minutę skrótu zabezpieczonego tajnym kluczem. Nie zapisuje adresu IP w statystykach ani liczniku ograniczeń.
          Skrót nie jest łączony z kontem; limit wygasa najpóźniej po dwóch minutach, a przeterminowane wpisy są usuwane przy kolejnej
          obsłudze statystyk. Infrastruktura hostingowa może niezależnie przetwarzać dane techniczne połączenia.
        </p>
        <p className="text-slate-800 leading-relaxed mt-3">
          Zamknięcie komunikatu o warsztacie zapamiętujemy przez 6 godzin w pliku cookie wspólnym dla orthobase.pl i jego subdomen, zawierającym tylko czas zakończenia ukrycia komunikatu.
        </p>

        <p className="text-xs text-slate-500 mt-8">
          Ostatnia aktualizacja: 3 listopada 2026 r.
        </p>
        <div className="mt-6">
          <HomeLogo compact />
        </div>
      </section>
    </main>
  );
}
