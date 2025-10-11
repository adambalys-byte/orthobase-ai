import Image from "next/image";
import EarlyAccessForm from "./EarlyAccessForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="container mx-auto px-6 pt-16 pb-10 flex flex-col items-center text-center">
        {/* Logo – JEDYNE źródło nazwy, duże */}
        <div className="mb-6">
          <Image
            src="/orthobase-logo.svg"   // ← dopasuj nazwę pliku w /public
            alt="OrthoBase AI"
            width={440}                 // ← większe logo
            height={440}
            priority
            className="drop-shadow-sm"
          />
        </div>

        {/* Krótki opis (bez powtórzonego tytułu) */}
        <p className="max-w-2xl text-lg md:text-xl text-slate-700">
          Inteligentny asystent ortopedii: szybkie opisy wizyt, kody i checklisty.
          Mniej klikania, więcej medycyny.
        </p>

        <a
          href="#early-access"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white text-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Zapisz się na Early Access
        </a>

        {/* 3 powody – lekki podgląd wartości */}
        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 text-left">
          <Feature title="Dokumentacja w minuty" desc="Opisy wizyt, zalecenia i skierowania z gotowców." />
          <Feature title="Szablony procedur" desc="Złamania, unieruchomienia, artroskopia – wszystko pod ręką." />
          <Feature title="Projekt med-grade" desc="RODO-first, gotowy na wrażliwe dane i skalowanie." />
        </div>
      </section>

      {/* FORMULARZ w karcie */}
      <section id="early-access" className="container mx-auto px-6 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-slate-900">Dołącz do listy Early Access</h2>
          <p className="mt-1 mb-4 text-slate-600">
            Zostaw e-mail – damy znać o starcie i zaprosimy do testów.
          </p>

          <EarlyAccessForm />

          <p className="mt-3 text-xs text-slate-500">
            Szczegóły w <a href="/privacy" className="underline">Polityce prywatności</a>.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/70">
        <div className="container mx-auto px-6 py-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} OrthoBase AI • Warsaw, Poland</span>
          <nav className="flex items-center gap-4">
            <a href="/privacy" className="hover:underline">Prywatność</a>
            <a href="mailto:kontakt@orthobase.pl" className="hover:underline">kontakt@orthobase.pl</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-slate-600">{desc}</p>
    </div>
  );
}
