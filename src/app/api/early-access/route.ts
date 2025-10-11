import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name, consent } = await req.json();
    if (!email || !consent) {
      return NextResponse.json({ ok: false, error: 'Brak emaila lub zgody' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,     // ssl0.ovh.net
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // powiadomienie do Ciebie
    await transporter.sendMail({
      from: `"OrthoBase AI" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO || process.env.SMTP_USER,
      subject: `Nowy zapis Early Access: ${email}`,
      text: `Email: ${email}\nImię: ${name || '-'}\nZgoda: ${consent ? 'TAK' : 'NIE'}`,
    });

    // automatyczna odpowiedź (opcjonalnie)
    await transporter.sendMail({
      from: `"OrthoBase AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Dziękujemy za zapis do Early Access',
      text: 'Dzięki za zgłoszenie! Wkrótce odezwiemy się z zaproszeniem do testów.',
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Błąd serwera' }, { status: 500 });
  }
}
