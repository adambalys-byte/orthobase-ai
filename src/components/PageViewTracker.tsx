"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const origins = new Set(["https://orthobase.pl", "https://www.orthobase.pl"]);
const publicPaths = new Set(["/", "/privacy"]);

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    // Preview hosts and unknown/private paths never send production statistics.
    if (!origins.has(window.location.origin) || !publicPaths.has(pathname)) return;

    void fetch("https://dyzury.orthobase.pl/api/public/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      cache: "no-store",
      redirect: "error",
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
