import styles from "./SupportSection.module.css";

type SupportSectionProps = {
  href?: string | null;
};

function supportUrl(href: SupportSectionProps["href"]): string | null {
  if (!href || !/^https:\/\//i.test(href) || /[\s\\]/.test(href)) return null;

  try {
    const url = new URL(href);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export default function SupportSection({ href }: SupportSectionProps) {
  const destination = supportUrl(href);
  if (!destination) return null;

  return (
    <section className={styles.section} aria-labelledby="support-title">
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M6 12h16v8a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-8Zm16 2h2a4 4 0 0 1 0 8h-2M4 28h22M11 4v4m6-4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <h2 id="support-title" className={styles.title}>
          <a href={destination} rel="noreferrer">
            Wesprzyj rozwój Orthobase
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </h2>
        <p className={styles.text}>
          Jeśli Orthobase ułatwia Ci pracę, możesz dorzucić się do serwera i narzędzi
          do jego rozwoju. <span className={styles.signature}>Dzięki! — Adam</span>
        </p>
      </div>
    </section>
  );
}
