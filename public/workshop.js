/* Public, optional workshop notice. It never reads the Orthobase account. */
(() => {
  'use strict';
  if (window.__obWorkshop20261008) return;
  window.__obWorkshop20261008 = true;
  const END = Date.parse('2026-10-07T22:00:00.000Z');
  const STATUS = 'https://dyzury.orthobase.pl/api/public/workshop-campaign';
  const FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdtQSAcaOjSdJZ6YIuXpAdGxRVRa-WWEZ70D2OHBtUc97gqIw/viewform';
  const COOKIE = 'obWorkshop20261008DismissedUntil';
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const POLL = 60 * 1000, FRESHNESS = 2 * 60 * 1000;
  const steady = () => performance.now();

  function start() {
    if (Date.now() >= END || typeof fetch !== 'function' || typeof AbortController !== 'function') return;
    const host = location.hostname;
    const sharedDomain = host === 'orthobase.pl' || host.endsWith('.orthobase.pl');
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(host);
    let stopAt = steady() + (END - Date.now());
    let stopped = false, panel = null, inMemoryDismissal = 0;
    let nextTimer, expiryTimer, activeRequest = null, generation = 0;

    function hide() { if (panel) panel.hidden = true; }
    function cancelRequest() { generation++; activeRequest?.abort(); activeRequest = null; }
    function stop() {
      stopped = true;
      hide(); cancelRequest(); clearTimeout(nextTimer); clearTimeout(expiryTimer);
    }
    function ended() {
      if (stopped) return true;
      if (Date.now() >= END || steady() >= stopAt) { stop(); return true; }
      return false;
    }
    function armExpiry() {
      clearTimeout(expiryTimer);
      const remaining = Math.min(END - Date.now(), stopAt - steady());
      if (remaining <= 0) stop();
      else expiryTimer = setTimeout(stop, Math.min(remaining, 2147483647));
    }
    function dismissal() {
      let saved = null;
      try {
        if (sharedDomain) {
          saved = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
        } else if (local) saved = sessionStorage.getItem(COOKIE);
      } catch { /* Storage is optional; this visit still remembers dismissal. */ }
      const until = /^\d{13}$/.test(saved || '') ? Number(saved) : 0;
      return Math.max(inMemoryDismissal, until);
    }
    function schedule(delay = POLL) {
      clearTimeout(nextTimer);
      if (!ended()) nextTimer = setTimeout(refresh, Math.min(Math.max(1, delay), stopAt - steady(), END - Date.now(), 2147483647));
    }
    function dismiss() {
      inMemoryDismissal = Date.now() + SIX_HOURS;
      try {
        if (sharedDomain) document.cookie = COOKIE + '=' + inMemoryDismissal + '; Max-Age=21600; Domain=orthobase.pl; Path=/; Secure; SameSite=Lax';
        else if (local) sessionStorage.setItem(COOKIE, String(inMemoryDismissal));
      } catch { /* The notice still closes when storage is unavailable. */ }
      hide(); cancelRequest(); schedule(SIX_HOURS);
    }
    function element(tag, className, text) {
      const node = document.createElement(tag);
      node.className = className;
      if (text) node.textContent = text;
      return node;
    }
    function show() {
      if (ended() || dismissal() > Date.now()) { hide(); return; }
      if (!panel) {
        panel = element('section', 'obWorkshop');
        panel.setAttribute('aria-labelledby', 'obWorkshopTitle');
        const close = element('button', 'obWorkshopClose', '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Zamknij informację o warsztacie na 6 godzin');
        close.addEventListener('click', dismiss);
        const eyebrow = element('p', 'obWorkshopEyebrow', '8 PAŹDZIERNIKA · WARSZTAT');
        const title = element('h2', 'obWorkshopTitle', 'Artroskopia w praktyce. Dołącz 8 października.');
        title.id = 'obWorkshopTitle';
        const description = element('p', 'obWorkshopDescription', 'Podstawy + FAST · 09:00–11:00 · Collegium Orthopaedicum. Kameralna grupa do 9 osób. Opieka: dr Ewa Tramś.');
        const cta = element('a', 'obWorkshopLink', 'Zgłoś dostępność na 8.10');
        cta.href = FORM;
        cta.target = '_blank';
        cta.rel = 'noopener';
        cta.setAttribute('aria-label', 'Zgłoś dostępność na 8.10 — formularz w nowej karcie');
        const note = element('p', 'obWorkshopNote', 'W formularzu wybierz 8 października. Udział wymaga potwierdzenia organizatorów.');
        panel.append(close, eyebrow, title, description, cta, note);
        document.body.append(panel);
      }
      panel.hidden = false;
    }
    async function refresh() {
      clearTimeout(nextTimer);
      if (ended()) return;
      const until = dismissal();
      if (until > Date.now()) { hide(); cancelRequest(); schedule(until - Date.now()); return; }
      if (document.visibilityState === 'hidden') { hide(); cancelRequest(); return; }
      cancelRequest();
      const current = generation, controller = new AbortController(), started = steady();
      activeRequest = controller;
      const timeout = setTimeout(() => { controller.abort(); if (current === generation) hide(); }, 5000);
      try {
        const response = await fetch(STATUS, {
          method: 'GET', credentials: 'omit', mode: 'cors', cache: 'no-store',
          redirect: 'error', referrerPolicy: 'no-referrer', signal: controller.signal
        });
        if (!response.ok) throw new Error('Campaign status unavailable');
        const data = await response.json();
        if (current !== generation || ended()) return;
        if (controller.signal.aborted) throw new Error('Campaign status timed out');
        const serverNow = typeof data?.serverNow === 'string' ? Date.parse(data.serverNow) : NaN;
        const expires = typeof data?.expiresAt === 'string' ? Date.parse(data.expiresAt) : NaN;
        if (typeof data?.active !== 'boolean' || !Number.isFinite(serverNow) || !Number.isFinite(expires)) throw new Error('Invalid campaign status');
        // Never extend the local cutoff. Count from request start to avoid adding network delay.
        stopAt = Math.min(stopAt, started + Math.min(expires, END) - serverNow);
        armExpiry();
        if (ended()) return;
        if (Math.abs(Date.now() - serverNow) > FRESHNESS || steady() - started > 5000 || Number(response.headers?.get('Age') || 0) > 120) throw new Error('Stale campaign status');
        if (data.active) show(); else hide();
      } catch {
        if (current === generation) hide();
      } finally {
        clearTimeout(timeout);
        if (current === generation) { activeRequest = null; schedule(); }
      }
    }
    function resume() { hide(); refresh(); }
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !event.defaultPrevented && panel && !panel.hidden && !document.querySelector('dialog[open]')) dismiss();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resume();
      else { hide(); cancelRequest(); clearTimeout(nextTimer); }
    });
    window.addEventListener('pageshow', event => { if (event.persisted) resume(); });
    armExpiry();
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
