import AccountLink from "@/components/AccountLink";
import HomeLogo from "@/components/HomeLogo";
import styles from "./page.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="7" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 14h22M11 3v8M21 3v8M11 20h3m4 0h3m-10 4h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 9c-3-3-8-4-12-3v20c4-1 9 0 12 3m0-20c3-3 8-4 12-3v20c-4-1-9 0-12 3V9Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12c1.5 0 3 .4 4 1m-4 4c1.5 0 3 .4 4 1m8-5c1-.6 2.5-1 4-1m-4 6c1-.6 2.5-1 4-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#moduly">Przejdź do narzędzi</a>
      <header className={styles.header}>
        <HomeLogo priority />
        <nav className={styles.headerLinks} aria-label="Konto i kontakt">
          <AccountLink />
          <a className={styles.contactLink} href="mailto:kontakt@orthobase.pl">Kontakt</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}><span aria-hidden="true" />Narzędzia dla ortopedii</p>
          <h1 id="page-title" className={styles.title}>Twoje narzędzia.<br /><span>Jedno miejsce.</span></h1>
          <p className={styles.intro}>Codzienna praca i wspólna nauka. Wybierz moduł, który jest Ci teraz potrzebny.</p>
        </section>

        <section id="moduly" className={styles.modules} aria-label="Narzędzia Orthobase" tabIndex={-1}>
          <a href="https://dyzury.orthobase.pl/" className={[styles.card, styles.duties].join(" ")} aria-labelledby="duties-title" aria-describedby="duties-description duties-access">
            <div className={styles.cardTop}>
              <span className={styles.icon}><CalendarIcon /></span>
              <span className={styles.category}>Organizacja pracy</span>
            </div>
            <h2 id="duties-title" className={styles.cardTitle}>Dyżury</h2>
            <p id="duties-description" className={styles.cardDescription}>Zgłoś dyspozycyjność, wybierz preferowane dyżury i zobacz próbny grafik zespołu.</p>
            <p id="duties-access" className={styles.cardDetail}>Dostęp po zalogowaniu i zatwierdzeniu konta.</p>
            <span className={styles.cardAction}>Otwórz Dyżury <span className={styles.arrow}><Arrow /></span></span>
          </a>

          <a href="https://szkola.orthobase.pl/" className={[styles.card, styles.school].join(" ")} aria-labelledby="school-title" aria-describedby="school-description">
            <div className={styles.cardTop}>
              <span className={styles.icon}><BookIcon /></span>
              <span className={styles.category}>Wspólna nauka</span>
            </div>
            <h2 id="school-title" className={styles.cardTitle}>Szkoła rezydentów</h2>
            <p id="school-description" className={styles.cardDescription}>Program szkoły, terminy spotkań i informacje dla uczestników. Bądź na bieżąco.</p>
            <p className={styles.cardDetail}>Sprawdź program i kolejne spotkania.</p>
            <span className={styles.cardAction}>Otwórz Szkołę <span className={styles.arrow}><Arrow /></span></span>
          </a>
        </section>

        <p className={styles.future}><span aria-hidden="true" />Jedno konto Orthobase. Google lub kod e-mail.</p>
      </main>
    </div>
  );
}

