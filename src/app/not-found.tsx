import HomeLogo from "@/components/HomeLogo";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 py-16 text-center md:py-24">
      <HomeLogo priority />
      <p className="mt-10 text-sm font-semibold tracking-widest text-teal-200">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Nie znaleźliśmy tej strony
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
        Kliknij logo Orthobase, aby wrócić do strony głównej i wybrać potrzebne narzędzie.
      </p>
    </main>
  );
}
