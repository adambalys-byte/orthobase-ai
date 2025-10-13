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

    // 2) autoresponder do użytkownika (HTML + tekst)
await transporter.sendMail({
  from: `"OrthoBase AI" <${process.env.SMTP_USER}>`,
  to: email,
  subject: "Dziękujemy za zapis do OrthoBase AI – Early Access",
  // prosty fallback tekstowy (na wypadek wyłączenia HTML)
  text:
    "Dziękujemy za zapis do OrthoBase AI!\n\n" +
    "Wkrótce wyślemy zaproszenie do testów oraz instrukcję pierwszego logowania.\n\n" +
    "Pozdrawiamy,\nZespół OrthoBase AI\nhttps://orthobase.pl",
  html: `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f8fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e6eaf2;border-radius:14px;box-shadow:0 8px 28px rgba(16,24,40,.08);overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 0 24px;" align="center">
              <img src="https://orthobase.pl/orthobase-logo.png" alt="OrthoBase AI" width="96" height="96" style="display:block;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 0 24px;" align="center">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:28px;color:#0f172a;font-weight:700;">
                Dziękujemy za dołączenie do Early Access
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px 0 24px;" align="center">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#334155;">
                Wkrótce otrzymasz od nas zaproszenie do testów OrthoBase&nbsp;AI oraz krótką instrukcję startową.
              </p>
            </td>
          </tr>

          <!-- karta podsumowania -->
          <tr>
            <td style="padding:20px 24px 0 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e6eaf2;border-radius:12px;background:#f8fafc;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#0f172a;font-weight:600;">
                      Twoje zgłoszenie
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#475569;">
                      E-mail: <strong style="color:#0f172a;">${email}</strong><br>
                      Status: zapis przyjęty ✔
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA / kontakt -->
          <tr>
            <td style="padding:20px 24px 0 24px;" align="center">
              <a href="https://orthobase.pl" style="display:inline-block;background:linear-gradient(135deg,#38bdf8,#2563eb);color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;box-shadow:0 10px 24px rgba(37,99,235,0.35);">
                Odwiedź orthobase.pl
              </a>
              <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;">
                W razie pytań: <a href="mailto:kontakt@orthobase.pl" style="color:#2563eb;text-decoration:none;">kontakt@orthobase.pl</a>
              </p>
            </td>
          </tr>

          <!-- stopka -->
          <tr>
            <td style="padding:20px 24px 24px 24px;" align="center">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} OrthoBase AI • Warsaw, Poland
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`,
});


    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Błąd serwera' }, { status: 500 });
  }
}
