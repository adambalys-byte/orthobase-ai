import { NextResponse } from "next/server";

function closedEarlyAccess() {
  return NextResponse.json(
    {
      ok: false,
      error: "Program Early Access został zakończony. Skorzystaj z dostępnych modułów Orthobase.",
      links: {
        dyzury: "https://dyzury.orthobase.pl/",
        szkola: "https://szkola.orthobase.pl/",
      },
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}

// Retired endpoint: do not read form data, create records or send email.
export function POST() {
  return closedEarlyAccess();
}

export function GET() {
  return closedEarlyAccess();
}

