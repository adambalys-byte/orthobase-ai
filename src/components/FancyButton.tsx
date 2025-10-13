// src/components/FancyButton.tsx
import React from "react";

type FancyButtonProps =
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never });

export default function FancyButton(props: FancyButtonProps) {
  const { as = "button", children, className = "", ...rest } = props as any;

  // baza: gradient, delikatny połysk, 3D, animacje hover/active
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl " +
    "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 " +
    "text-white font-medium px-6 py-3 " +
    "shadow-[0_8px_20px_-6px_rgba(2,132,199,0.45)] " + // głęboki cień (3D)
    "ring-1 ring-white/10 " +
    "transition duration-200 ease-out " +
    "hover:brightness-110 hover:shadow-[0_12px_26px_-6px_rgba(2,132,199,0.55)] " +
    "active:translate-y-[1px] active:shadow-[0_6px_16px_-6px_rgba(2,132,199,0.55)] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70";

  const sheen =
    "before:absolute before:inset-0 before:rounded-xl before:pointer-events-none " +
    "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_40%,transparent_100%)] " +
    "before:opacity-95";

  if (as === "a") {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href!} className={`${base} ${sheen} ${className}`} {...anchorRest}>
        <span className="relative z-10">{children}</span>
      </a>
    );
  }
  return (
    <button className={`${base} ${sheen} ${className}`} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
