const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/components/PageViewTracker.tsx'), 'utf8'), {
  compilerOptions: {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;

function mount(origin = 'https://www.orthobase.pl', pathname = '/', fail = false) {
  let effect, currentPath = pathname;
  const ref = {current: null}, requests = [];
  const context = vm.createContext({exports: {}, window: {location: {origin, search: '?private=marker', hash: '#private-marker'}},
    fetch: (url, options) => {requests.push({url, options}); return fail ? Promise.reject(new Error('Offline')) : Promise.resolve({status: 204});},
    require: name => {
      if (name === 'react') return {useRef: () => ref, useEffect: fn => {effect = fn;}};
      if (name === 'next/navigation') return {usePathname: () => currentPath};
      throw new Error('Unexpected import: ' + name);
    },
  });
  vm.runInContext(compiled, context);
  function render(next = currentPath) {currentPath = next; assert.equal(context.exports.default(), null); effect();}
  render();
  return {requests, render};
}

test('StrictMode repeats do not duplicate a mount; real path changes count once', () => {
  const tracker = mount(); tracker.render(); tracker.render();
  assert.equal(tracker.requests.length, 1);
  tracker.render('/privacy'); tracker.render('/privacy'); tracker.render('/');
  assert.deepEqual(tracker.requests.map(row => JSON.parse(row.options.body)), [{path:'/'},{path:'/privacy'},{path:'/'}]);
});

test('only production roots and allowlisted public paths emit; preview QA never changes real counts', () => {
  for (const origin of ['http://localhost:3000','https://preview.vercel.app','https://szkola.orthobase.pl','http://orthobase.pl']) {
    assert.equal(mount(origin).requests.length, 0);
  }
  for (const pathname of ['/konto','/unknown','/?private=marker']) assert.equal(mount(undefined, pathname).requests.length, 0);
  assert.equal(mount('https://orthobase.pl').requests.length, 1);
});

test('payload excludes identifiers and URL parameters; requests omit credentials and referrer', () => {
  const {url, options} = mount().requests[0];
  assert.equal(url, 'https://dyzury.orthobase.pl/api/public/analytics');
  assert.equal(options.body, '{"path":"/"}'); assert.equal(options.credentials, 'omit');
  assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.redirect, 'error');
  assert.equal(options.cache, 'no-store'); assert.equal(options.method, 'POST');
  assert.deepEqual(Object.keys(options.headers), ['Content-Type']);
});

test('failed telemetry does not retry or interrupt the page', async () => {
  const tracker = mount(undefined, '/', true);
  await new Promise(resolve => setImmediate(resolve)); tracker.render();
  assert.equal(tracker.requests.length, 1);
});
