const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../public/workshop.js'), 'utf8');
const END = Date.parse('2026-10-07T22:00:00.000Z');
const SIX_HOURS = 21600000;
const flush = () => new Promise(resolve => setImmediate(resolve));

function mount(options = {}) {
  let wall = options.now ?? Date.parse('2026-10-05T10:00:00.000Z'), monotonic = 0, serial = 0;
  let cookie = options.cookie || '';
  const writes = [], requests = [], timers = new Map(), storage = new Map();
  function events(target) {
    target.listeners = {};
    target.addEventListener = (type, handler) => (target.listeners[type] ||= []).push(handler);
    target.emit = (type, event = {}) => target.listeners[type]?.forEach(handler => handler(event));
    return target;
  }
  function node(tag) {
    return events({tag, className: '', textContent: '', hidden: false, children: [], attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      append(...children) { this.children.push(...children); },
      focus() { throw new Error('The notice must not steal focus'); }
    });
  }
  const document = events({readyState: options.readyState || 'complete', visibilityState: options.visibility || 'visible', body: node('body'), createElement: node, querySelector: () => null});
  Object.defineProperty(document, 'cookie', {get() { if (options.blockStorage) throw new Error('blocked'); return cookie; }, set(value) { if (options.blockStorage) throw new Error('blocked'); writes.push(value); cookie = value.split(';')[0]; }});
  const window = events({});
  const fetch = (url, config) => new Promise((resolve, reject) => {
    requests.push({url, config, resolve, reject});
    if (!options.ignoreAbort) config.signal.addEventListener('abort', () => reject(new Error('aborted')), {once: true});
  });
  class Clock extends Date { static now() { return wall; } }
  const context = vm.createContext({window, document, fetch, Date: Clock, performance: {now: () => monotonic},
    AbortController, location: {hostname: options.host || 'szkola.orthobase.pl'},
    sessionStorage: {getItem(key) { if (options.blockStorage) throw new Error('blocked'); return storage.get(key) || null; }, setItem(key, value) { if (options.blockStorage) throw new Error('blocked'); storage.set(key, value); }},
    setTimeout(fn, delay) { const id = ++serial; timers.set(id, {at: monotonic + delay, fn}); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  const run = () => vm.runInContext(source, context);
  run();
  async function advance(ms) {
    const target = monotonic + ms;
    for (;;) {
      const due = [...timers].filter(([, value]) => value.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      const delta = due[1].at - monotonic;
      wall += delta; monotonic = due[1].at; timers.delete(due[0]); due[1].fn(); await flush();
    }
    wall += target - monotonic; monotonic = target; await flush();
  }
  return {document, window, requests, writes, storage, run, advance,
    panel: () => document.body.children[0], now: () => wall,
    setWall: value => { wall = value; }, setCookie: value => { cookie = value; },
    fresh: (extra = {}) => ({active: true, expiresAt: new Date(END).toISOString(), serverNow: new Date(wall).toISOString(), ...extra})};
}
async function answer(request, body, options = {}) {
  request.resolve({ok: options.ok ?? true, headers: {get: () => options.age || null}, json: async () => body});
  await flush();
}
function close(ui) { ui.panel().children.find(node => node.tag === 'button').emit('click'); }

test('public notice uses only unauthenticated GET and the verified public registration link', async () => {
  const ui = mount(), request = ui.requests[0];
  assert.equal(request.url, 'https://dyzury.orthobase.pl/api/public/workshop-campaign');
  assert.equal(request.config.credentials, 'omit');
  assert.equal(request.config.method, 'GET');
  assert.equal(request.config.cache, 'no-store');
  assert.equal(request.config.redirect, 'error');
  assert.equal(request.config.referrerPolicy, 'no-referrer');
  assert.equal(request.config.body, undefined);
  await answer(request, ui.fresh());
  const panel = ui.panel();
  assert.equal(panel.hidden, false);
  assert.equal(panel.attributes['aria-labelledby'], 'obWorkshopTitle');
  const texts = panel.children.map(node => node.textContent).join(' ');
  assert(texts.includes('Artroskopia w praktyce. Dołącz 8 października.'));
  assert(texts.includes('Opieka: dr Ewa Tramś.'));
  assert(texts.includes('Udział wymaga potwierdzenia organizatorów.'));
  assert(!texts.includes('ostatnie'));
  assert.equal(panel.children.find(node => node.tag === 'a').href, 'https://docs.google.com/forms/d/e/1FAIpQLSdtQSAcaOjSdJZ6YIuXpAdGxRVRa-WWEZ70D2OHBtUc97gqIw/viewform');
  const cta = panel.children.find(node => node.tag === 'a');
  assert.equal(cta.target, '_blank');
  assert.equal(cta.rel, 'noopener');
  assert(cta.attributes['aria-label'].includes('w nowej karcie'));
});

test('false, malformed, expired and stale status never shows the notice', async () => {
  const failures = [
    fresh => ({...fresh, active: false}), fresh => ({...fresh, active: 'true'}),
    fresh => ({...fresh, expiresAt: 'invalid'}), fresh => ({...fresh, serverNow: 'invalid'}),
    fresh => ({...fresh, expiresAt: fresh.serverNow}),
    fresh => ({...fresh, serverNow: '2026-10-04T10:00:00.000Z'}),
    fresh => ({...fresh, serverNow: '2026-10-06T10:00:00.000Z'}), () => null
  ];
  for (const invalid of failures) {
    const ui = mount(); await answer(ui.requests[0], invalid(ui.fresh()));
    assert(!ui.panel() || ui.panel().hidden);
  }
  const cached = mount(); await answer(cached.requests[0], cached.fresh(), {age: '121'});
  assert(!cached.panel());
});

test('polling hides a previously active notice on inactive state and on network error', async () => {
  const ui = mount(); await answer(ui.requests[0], ui.fresh());
  await ui.advance(60000); assert.equal(ui.requests.length, 2);
  await answer(ui.requests[1], ui.fresh({active: false})); assert.equal(ui.panel().hidden, true);
  await ui.advance(60000); await answer(ui.requests[2], ui.fresh()); assert.equal(ui.panel().hidden, false);
  await ui.advance(60000); ui.requests[3].reject(new Error('offline')); await flush();
  assert.equal(ui.panel().hidden, true);
});

test('fixed Warsaw cutoff hides immediately and prohibits all subsequent requests', async () => {
  const ui = mount({now: END - 30000}); await answer(ui.requests[0], ui.fresh());
  await ui.advance(29999); assert.equal(ui.panel().hidden, false);
  await ui.advance(1); assert.equal(ui.panel().hidden, true);
  ui.window.emit('pageshow', {persisted: true}); ui.document.emit('visibilitychange');
  await ui.advance(120000); assert.equal(ui.requests.length, 1);
  const ended = mount({now: END}); assert.equal(ended.requests.length, 0); assert(!ended.panel());
});

test('server offset can shorten cutoff and clock rollback cannot extend the monotonic deadline', async () => {
  const ui = mount({now: END - 120000});
  await answer(ui.requests[0], ui.fresh({serverNow: new Date(END - 30000).toISOString()}));
  ui.setWall(ui.now() - 86400000);
  await ui.advance(30000); assert.equal(ui.panel().hidden, true);
  ui.window.emit('pageshow', {persisted: true}); await ui.advance(120000);
  assert.equal(ui.requests.length, 1);
});

test('late replies and timed-out replies cannot reopen an inactive notice', async () => {
  const ui = mount({ignoreAbort: true});
  ui.window.emit('pageshow', {persisted: true});
  assert.equal(ui.requests[0].config.signal.aborted, true);
  await answer(ui.requests[1], ui.fresh({active: false}));
  await answer(ui.requests[0], ui.fresh()); assert(!ui.panel());
  await ui.advance(60000); await answer(ui.requests[2], ui.fresh());
  await ui.advance(60000); await ui.advance(5000);
  assert.equal(ui.requests[3].config.signal.aborted, true); assert.equal(ui.panel().hidden, true);
  await answer(ui.requests[3], ui.fresh()); assert.equal(ui.panel().hidden, true);
});

test('closing saves a benign six-hour shared-domain preference and suppresses requests', async () => {
  const ui = mount(); await answer(ui.requests[0], ui.fresh()); close(ui);
  assert.equal(ui.panel().hidden, true);
  assert.equal(ui.writes.length, 1);
  assert(ui.writes[0].includes('Max-Age=21600; Domain=orthobase.pl; Path=/; Secure; SameSite=Lax'));
  assert(!ui.writes[0].includes('__Host-'));
  ui.window.emit('pageshow', {persisted: true}); ui.document.emit('visibilitychange');
  await ui.advance(SIX_HOURS - 1); assert.equal(ui.requests.length, 1);
  await ui.advance(1); assert.equal(ui.requests.length, 2);
});

test('a sibling-site dismissal is honored before a poll or page restoration', async () => {
  const ui = mount(); await answer(ui.requests[0], ui.fresh());
  ui.setCookie('obWorkshop20261008DismissedUntil=' + (ui.now() + SIX_HOURS));
  await ui.advance(60000); assert.equal(ui.panel().hidden, true); assert.equal(ui.requests.length, 1);
  const freshTab = mount({cookie: 'obWorkshop20261008DismissedUntil=' + (ui.now() + SIX_HOURS)});
  assert.equal(freshTab.requests.length, 0); assert(!freshTab.panel());
});

test('Escape closes without focus changes; localhost storage failure still remembers dismissal', async () => {
  for (const blockStorage of [false, true]) {
    const ui = mount({host: 'localhost', blockStorage}); await answer(ui.requests[0], ui.fresh());
    ui.document.emit('keydown', {key: 'Escape', defaultPrevented: true}); assert.equal(ui.panel().hidden, false);
    ui.document.emit('keydown', {key: 'Escape', defaultPrevented: false}); assert.equal(ui.panel().hidden, true);
    assert.equal(ui.writes.length, 0);
    if (!blockStorage) assert.equal(ui.storage.size, 1);
    ui.window.emit('pageshow', {persisted: true}); await flush(); assert.equal(ui.requests.length, 1);
  }
});

test('Escape intended for an open feedback dialog does not dismiss the notice', async () => {
  const ui = mount(); await answer(ui.requests[0], ui.fresh());
  ui.document.querySelector = selector => selector === 'dialog[open]' ? {} : null;
  ui.document.emit('keydown', {key: 'Escape', defaultPrevented: false});
  assert.equal(ui.panel().hidden, false); assert.equal(ui.writes.length, 0);
  close(ui); assert.equal(ui.panel().hidden, true);
});

test('lifecycle preserves public content, waits for DOM, avoids duplicate bootstrap and skips hidden polling', async () => {
  const ui = mount({readyState: 'loading'}); assert.equal(ui.requests.length, 0);
  ui.document.emit('DOMContentLoaded'); assert.equal(ui.requests.length, 1);
  await answer(ui.requests[0], ui.fresh()); ui.run(); assert.equal(ui.requests.length, 1);
  ui.window.emit('pageshow', {persisted: false}); assert.equal(ui.requests.length, 1);
  ui.document.visibilityState = 'hidden'; ui.document.emit('visibilitychange');
  await ui.advance(120000); assert.equal(ui.requests.length, 1); assert.equal(ui.panel().hidden, true);
  ui.document.visibilityState = 'visible'; ui.document.emit('visibilitychange');
  assert.equal(ui.requests.length, 2); await answer(ui.requests[1], ui.fresh());
  assert.equal(ui.document.body.children.length, 1); assert.equal(ui.panel().hidden, false);
});
