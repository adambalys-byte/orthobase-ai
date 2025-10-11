// src/app/EarlyAccessForm.tsx
'use client';
import { useState } from 'react';

export default function EarlyAccessForm() {
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { alert('Zaznacz zgodę RODO'); return; }
    setStatus('loading');
    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, consent }),
      });
      setStatus(res.ok ? 'ok' : 'err');
      if (res.ok) { setEmail(''); setName(''); setConsent(false); }
    } catch {
      setStatus('err');
    }
  }

  const base =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">E-mail*</label>
        <input
          id="email"
          type="email"
          required
          placeholder="np. jan.nowak@szpital.pl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={base}
        />
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-700">Imię (opcjonalnie)</label>
        <input
          id="name"
          type="text"
          placeholder="np. Adam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={base}
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
        />
        <span>Wyrażam zgodę na kontakt w sprawie Early Access OrthoBase AI.</span>
      </label>

      <button
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {status === 'loading' ? 'Wysyłanie…' : 'Zapisz mnie'}
      </button>

      {status === 'ok'  && <p className="text-green-600 text-sm">Dziękujemy! Sprawdź skrzynkę.</p>}
      {status === 'err' && <p className="text-red-600 text-sm">Ups, coś poszło nie tak. Spróbuj ponownie.</p>}
    </form>
  );
}
