import Image from "next/image";
import EarlyAccessForm from "./EarlyAccessForm";
import FancyButton from "@/components/FancyButton";


export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="container mx-auto px-6 pt-14 pb-10 flex flex-col items-center text-center">
        {/* Logo — SVG, bez żadnego tła */}
        <div className="mb-6">
          <Image
            src="/orthobase-logo.svg"
            alt="OrthoBase AI"
            width={420}
            height={420}
            priority
            className="select-none pointer-events-none"
          />
        </div>

        {/* Podtytuł pod logo */}
        <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-slate-200 md:text-slate-300">
          Inteligentny asystent ortopedii: szybkie opisy wizyt, kody i checklisty.
          Mniej klikania, więcej medycyny.
        </p>

        {/* CTA */}
        <div className="mt-12 mb-8">
  <FancyButton as="a" href="#early-access">
    Zapisz się na Early Access
  </FancyButton>
</div>



        {/* 3 wartości */}
        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 text-left">
          <Feature title="Dokumentacja w minuty" desc="Opisy wizyt, zalecenia i skierowania z gotowców." />
          <Feature title="Szablony procedur" desc="Złamania, unieruchomienia, artroskopia – wszystko pod ręką." />
          <Feature title="Med-grade od startu" desc="RODO-first, gotowe pod wrażliwe dane i skalowanie." />
        </div>
      </section>

      {/* FORMULARZ */}
      <section id="early-access" className="container mx-auto px-6 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur p-6 shadow-md">
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

      {/* STOPKA */}
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
      <p className="mt-1 text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
