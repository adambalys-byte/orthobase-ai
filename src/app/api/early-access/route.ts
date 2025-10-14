import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const payloadSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(100).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, { message: "Consent required" }),
  website: z.string().optional().or(z.literal("")),
});

/** Prosty limiter (w zasięgu modułu, bez globalThis) */
const memory: Map<string, { ts: number; count: number }> = new Map();
const WINDOW_MS = 60_000;
const MAX_REQ = 5;

function rateLimit(ip: string) {
  const now = Date.now();
  const rec = memory.get(ip) ?? { ts: now, count: 0 };
  if (now - rec.ts > WINDOW_MS) {
    rec.ts = now;
    rec.count = 0;
  }
  rec.count++;
  memory.set(ip, rec);
  return rec.count <= MAX_REQ;
}

/** Wczytywanie szablonów z repo */
async function loadTemplate(rel: string) {
  const full = path.join(process.cwd(), rel.replace(/^\.?\//, ""));
  return fs.readFile(full, "utf8");
}

export async function POST(req: Request) {
  try {
    // IP tylko z nagłówka (bez castów)
    const fwd = req.headers.get("x-forwarded-for") ?? "";
    const ip = fwd.split(",")[0]?.trim() || "0.0.0.0";

    if (!rateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }

    const json = await req.json();
    const parsed = payloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const { email, name, consent, website } = parsed.data;

    // Honeypot
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // 1) Powiadomienie do Ciebie
    await transporter.sendMail({
      from: `"OrthoBase AI" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO || process.env.SMTP_USER,
      subject: `Nowy zapis Early Access: ${email}`,
      text: `Email: ${email}\nImię: ${name || "-"}\nZgoda: ${consent ? "TAK" : "NIE"}\nIP: ${ip}`,
    });

    // 2) Autoresponder (HTML+TXT z szablonów)
    const year = new Date().getFullYear().toString();
    const htmlTpl = await loadTemplate("docs/automation/emails/ea_welcome_v1.html");
    const txtTpl = await loadTemplate("docs/automation/emails/ea_welcome_v1.txt");

    const html = htmlTpl.replace(/{{\s*email\s*}}/g, email).replace(/{{\s*year\s*}}/g, year);
    const text = txtTpl.replace(/{{\s*email\s*}}/g, email).replace(/{{\s*year\s*}}/g, year);

    await transporter.sendMail({
      from: `"OrthoBase AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Dziękujemy za zapis do OrthoBase AI – Early Access",
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Błąd serwera" }, { status: 500 });
  }
}
