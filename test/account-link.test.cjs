const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/components/AccountLink.tsx'), 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

// Run the component's real effect with controlled hooks/network/browser events.
// No account endpoint or authentication provider is contacted by these tests.
function mount() {
  let state = 'unknown', effect;
  const requests = [], timers = new Map(), windowEvents = new Map(), documentEvents = new Map();
  let timerId = 0;
  const window = {
    addEventListener: (event, handler) => windowEvents.set(event, handler),
    removeEventListener: event => windowEvents.delete(event),
    setTimeout: handler => { timers.set(++timerId, handler); return timerId; },
    clearTimeout: id => timers.delete(id),
  };
  const document = {
    visibilityState: 'visible',
    addEventListener: (event, handler) => documentEvents.set(event, handler),
    removeEventListener: event => documentEvents.delete(event),
  };
  const context = vm.createContext({
    exports: {}, window, document, AbortController,
    fetch: (url, options) => new Promise((resolve, reject) => {
      requests.push({ url, options, resolve: (data, ok = true) => resolve({ ok, json: async () => data }), reject });
      options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
    }),
    require: name => {
      if (name === 'react') return { useState: () => [state, next => { state = next; }], useEffect: fn => { effect = fn; } };
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name.endsWith('.module.css')) return { default: {} };
      throw new Error('Unexpected dependency: ' + name);
    },
  });
  vm.runInContext(compiled, context);
  const render = () => context.exports.default();
  render();
  const cleanup = effect();
  const texts = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(texts).join(' ') : node?.props ? texts(node.props.children) : '';
  return { requests, timers, windowEvents, documentEvents, document, cleanup, render, text: () => texts(render()), state: () => state };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('The initial account link works without status; the only request is credentialed, uncached boolean status', async () => {
  const a = mount();
  assert.match(a.text(), /Konto Orthobase/);
  assert.equal(a.render().props.href, 'https://dyzury.orthobase.pl/konto?module=home');
  assert.equal(a.requests.length, 1);
  const { url, options } = a.requests[0];
  assert.equal(url, 'https://dyzury.orthobase.pl/api/account/status');
  assert.equal(options.credentials, 'include');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.headers.Accept, 'application/json');
  assert.equal(options.body, undefined);
  a.requests[0].resolve({ authenticated: true }); await settle();
  assert.match(a.text(), /Moje konto.*Sesja aktywna/);
  a.cleanup();
});

test('Pageshow and returning to a visible tab refresh status, including a later logout', async () => {
  const a = mount();
  a.requests[0].resolve({ authenticated: true }); await settle();
  void a.windowEvents.get('pageshow')();
  a.requests[1].resolve({ authenticated: false }); await settle();
  assert.match(a.text(), /Zaloguj się/);
  a.document.visibilityState = 'hidden';a.documentEvents.get('visibilitychange')();
  assert.equal(a.requests.length, 2);
  a.document.visibilityState = 'visible';a.documentEvents.get('visibilitychange')();
  a.requests[2].resolve({ authenticated: true }); await settle();
  assert.match(a.text(), /Moje konto/);
  a.cleanup();
});

test('Network failures and invalid or expanded payloads never falsely report logout or expose returned profile fields', async () => {
  for (const failure of ['network', 'http', 'timeout', 'extra', 'missing', 'wrongType']) {
    const a = mount();a.requests[0].resolve({ authenticated: true });await settle();
    void a.windowEvents.get('pageshow')();
    if (failure === 'network') a.requests[1].reject(new Error('Offline'));
    if (failure === 'http') a.requests[1].resolve({ authenticated: false }, false);
    if (failure === 'timeout') [...a.timers.values()][0]();
    if (failure === 'extra') a.requests[1].resolve({ authenticated: true, email: 'private@example.test' });
    if (failure === 'missing') a.requests[1].resolve({});
    if (failure === 'wrongType') a.requests[1].resolve({ authenticated: 'false' });
    await settle();
    assert.match(a.text(), /Konto Orthobase.*Status niedostępny/, failure);
    assert.doesNotMatch(a.text(), /Zaloguj się|private@example/, failure);
    a.cleanup();
  }
});

test('New checks supersede earlier requests and unmount removes listeners and ignores pending results', async () => {
  const a = mount();void a.windowEvents.get('pageshow')();
  assert.equal(a.requests[0].options.signal.aborted, true);
  a.requests[1].resolve({ authenticated: false });a.requests[0].resolve({ authenticated: true });await settle();
  assert.equal(a.state(), 'anonymous');
  void a.windowEvents.get('pageshow')();a.cleanup();
  assert.equal(a.requests[2].options.signal.aborted, true);
  a.requests[2].resolve({ authenticated: true });await settle();
  assert.equal(a.state(), 'anonymous');
  assert.equal(a.windowEvents.size, 0);assert.equal(a.documentEvents.size, 0);assert.equal(a.timers.size, 0);
});
