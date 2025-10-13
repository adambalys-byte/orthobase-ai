// src/components/FancyButton.tsx
import React from "react";

type FancyAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
  href: string;
  className?: string;
};

type FancyButtonElProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button";
  className?: string;
};

type FancyButtonProps = FancyAnchorProps | FancyButtonElProps;

export default function FancyButton(props: FancyButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl " +
    "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 " +
    "text-white font-medium px-6 py-3 " +
    "shadow-[0_8px_20px_-6px_rgba(2,132,199,0.45)] " +
    "ring-1 ring-white/10 " +
    "transition duration-200 ease-out " +
    "hover:brightness-110 hover:shadow-[0_12px_26px_-6px_rgba(2,132,199,0.55)] " +
    "active:translate-y-[1px] active:shadow-[0_6px_16px_-6px_rgba(2,132,199,0.55)] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70";

  const sheen =
    "before:absolute before:inset-0 before:rounded-xl before:pointer-events-none " +
    "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_40%,transparent_100%)] " +
    "before:opacity-95";

  if (props.as === "a") {
    const { as, href, children, className = "", ...rest } = props as FancyAnchorProps;
    return (
      <a href={href} className={`${base} ${sheen} ${className}`} {...rest}>
        <span className="relative z-10">{children}</span>
      </a>
    );
  }

  const { as, children, className = "", ...rest } = props as FancyButtonElProps;
  return (
    <button className={`${base} ${sheen} ${className}`} {...rest}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
