// src/app/EarlyAccessForm.tsx
'use client';
import { useState } from 'react';
import FancyButton from '@/components/FancyButton';

type Status = 'idle' | 'loading' | 'ok' | 'err';

export default function EarlyAccessForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});

  function validate(): boolean {
    const next: typeof errors = {};
    const emailTrim = email.trim();
    const emailRegex =
      // prosty, praktyczny regex do e-mail
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!emailTrim) {
      next.email = 'Podaj adres e-mail.';
    } else if (!emailRegex.test(emailTrim)) {
      next.email = 'Wpisz poprawny adres e-mail (np. jan.nowak@szpital.pl).';
    }
    if (!consent) {
      next.consent = 'Aby kontynuować, zaznacz zgodę na kontakt.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), consent, website: hp }),
      });
      setStatus(res.ok ? 'ok' : 'err');
      if (res.ok) {
        setEmail('');
        setName('');
        setConsent(false);
        setHp('');
        setErrors({});
      }
    } catch {
      setStatus('err');
    }
  }

  const baseInput =
    'mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm ' +
    'transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400';
  const errorInput = 'border-red-400 focus:ring-red-400 focus:border-red-400';
  const helpText = 'mt-1 text-sm text-slate-500';
  const errorText = 'mt-1 text-sm text-red-600 flex items-center gap-2';

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      {/* Pasek statusu (sukces/błąd) */}
      {status === 'ok' && (
        <div
          role="alert"
          className="rounded-lg border border-emerald-300 bg-emerald-50/80 px-4 py-2 text-emerald-800 shadow-sm"
        >
          ✅ Dziękujemy! Wysłaliśmy potwierdzenie na podany adres.
        </div>
      )}
      {status === 'err' && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50/80 px-4 py-2 text-red-700 shadow-sm"
        >
          ⚠️ Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę.
        </div>
      )}

      {/* E-mail */}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          E-mail*
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          placeholder="np. jan.nowak@szpital.pl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${baseInput} border-slate-300 ${errors.email ? errorInput : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : 'email-help'}
        />
        {!errors.email ? (
          <p id="email-help" className={helpText}>
            Na ten adres wyślemy potwierdzenie i zaproszenie do testów.
          </p>
        ) : (
          <p id="email-error" className={errorText}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Imię (opcjonalne) */}
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Imię (opcjonalnie)
        </label>
        <input
          id="name"
          type="text"
          placeholder="np. Adam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${baseInput} border-slate-300`}
        />
        <p className={helpText}>Pomoże nam spersonalizować komunikację (opcjonalne).</p>
      </div>

      {/* Honeypot dla botów (ukryte) */}
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        name="website"
      />

      {/* Zgoda RODO */}
      <label className="flex items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className={`mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 ${
            errors.consent ? 'ring-1 ring-red-400' : ''
          }`}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <span>
          Wyrażam zgodę na kontakt w sprawie Early Access OrthoBase AI. Szczegóły w{' '}
          <a className="underline text-blue-700 hover:text-blue-800" href="/privacy">
            Polityce prywatności
          </a>
          .
        </span>
      </label>
      {!!errors.consent && (
        <p id="consent-error" className={errorText}>
          {errors.consent}
        </p>
      )}

      {/* Przyciski */}
      <FancyButton as="button" type="submit" disabled={status === 'loading'} className="w-full mt-2">
        {status === 'loading' ? 'Wysyłanie…' : 'Zapisz mnie'}
      </FancyButton>
    </form>
  );
}
