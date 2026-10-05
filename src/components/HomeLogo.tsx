import Image from "next/image";
import Link from "next/link";
import styles from "./HomeLogo.module.css";

type HomeLogoProps = {
  compact?: boolean;
  priority?: boolean;
};

export default function HomeLogo({ compact = false, priority = false }: HomeLogoProps) {
  return (
    <Link
      href="/"
      className={[styles.link, compact ? styles.compact : ""].filter(Boolean).join(" ")}
      aria-label="Orthobase — strona główna"
      title="Strona główna Orthobase"
    >
      <Image
        src="/orthobase-logo.svg"
        alt=""
        width={176}
        height={133}
        priority={priority}
        className={styles.image}
      />
    </Link>
  );
}
