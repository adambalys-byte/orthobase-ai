// src/app/api/early-access/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

/** Walidacja payloadu */
const payloadSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(100).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, { message: "Consent required" }),
  website: z.string().optional().or(z.literal("")), // honeypot
});

/** Prosty limiter (w pamięci procesu) */
const memory: Map<string, { ts: number; count: number }> = new Map();
const WINDOW_MS = 60_000;
const MAX_REQ = 5;

function rateLimit(ip: string): boolean {
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

export async function POST(req: Request) {
  try {
    // IP z nagłówka (Vercel/Proxy)
    const fwd = req.headers.get("x-forwarded-for") ?? "";
    const ip = fwd.split(",")[0]?.trim() || "0.0.0.0";

    // Rate-limit
    if (!rateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }

    // Payload
    const json = await req.json();
    const parsed = payloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
    const { email, name, consent, website } = parsed.data;

    // Honeypot – jeśli bot, kończymy „success”
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // SMTP (OVH)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // 1) Powiadomienie do administratora
    await transporter.sendMail({
      from: `"OrthoBase AI" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO || process.env.SMTP_USER,
      subject: `Nowy zapis Early Access: ${email}`,
      text: `Email: ${email}\nImię: ${name || "-"}\nZgoda: ${consent ? "TAK" : "NIE"}\nIP: ${ip}`,
    });

    // 2) Autoresponder z szablonów w public/emails (działa na Vercel)
    const year = new Date().getFullYear().toString();
    const htmlPath = path.join(process.cwd(), "public", "emails", "ea_welcome_v1.html");
    const txtPath = path.join(process.cwd(), "public", "emails", "ea_welcome_v1.txt");

    const [htmlTpl, txtTpl] = await Promise.all([
      fs.readFile(htmlPath, "utf8"),
      fs.readFile(txtPath, "utf8"),
    ]);

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Błąd serwera" }, { status: 500 });
  }
}
