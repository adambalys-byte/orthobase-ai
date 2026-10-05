"use client";

import { useEffect, useState } from "react";
import styles from "./AccountLink.module.css";

type AccountStatus = "unknown" | "authenticated" | "anonymous" | "unavailable";

export default function AccountLink() {
  const [status, setStatus] = useState<AccountStatus>("unknown");

  useEffect(() => {
    let disposed = false;
    let requestNumber = 0;
    let activeRequest: AbortController | undefined;

    async function refreshStatus() {
      const currentRequest = ++requestNumber;
      activeRequest?.abort();
      const controller = new AbortController();
      activeRequest = controller;
      const timeout = window.setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch("https://dyzury.orthobase.pl/api/account/status", {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Account status unavailable");
        const result: unknown = await response.json();
        if (
          !result || typeof result !== "object" || Array.isArray(result) ||
          Object.keys(result).length !== 1 ||
          !("authenticated" in result) || typeof result.authenticated !== "boolean"
        ) throw new Error("Invalid account status");

        if (!disposed && currentRequest === requestNumber) {
          setStatus(result.authenticated ? "authenticated" : "anonymous");
        }
      } catch {
        if (!disposed && currentRequest === requestNumber) setStatus("unavailable");
      } finally {
        window.clearTimeout(timeout);
      }
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") void refreshStatus();
    }

    void refreshStatus();
    window.addEventListener("pageshow", refreshStatus);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      disposed = true;
      activeRequest?.abort();
      window.removeEventListener("pageshow", refreshStatus);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const label = status === "authenticated" ? "Moje konto" : status === "anonymous" ? "Zaloguj się" : "Konto Orthobase";
  const detail = status === "authenticated" ? "Sesja aktywna" : status === "unavailable" ? "Status niedostępny" : "";

  return (
    <a className={styles.accountLink} href="https://dyzury.orthobase.pl/konto?module=home">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 20v-1.5a7 7 0 0 1 14 0V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className={styles.label} aria-live="polite" aria-atomic="true">
        {label}
        {detail && <small className={status === "authenticated" ? styles.active : styles.unavailable}>{detail}</small>}
      </span>
    </a>
  );
}
