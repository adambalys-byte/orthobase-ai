// Run against a locally started production build. All external requests are
// intercepted; account status uses fictional data. No forms or mail are sent.
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');

async function main() {
  const base = new URL(process.env.TEST_BASE_URL || 'http://127.0.0.1:3186');
  assert.ok(['127.0.0.1', 'localhost'].includes(base.hostname), 'Only a local test server is allowed.');
  const browser = await chromium.launch({ headless: true });
  const contexts = [];
  try {
    for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
      contexts.push(context);
      const unexpected = [];
      await context.route('**/*', async route => {
        const request = route.request(), url = new URL(request.url());
        if (url.origin === base.origin && request.method() === 'GET') return route.continue();
        if (url.href === 'https://dyzury.orthobase.pl/api/account/status' && request.method() === 'GET') {
          return route.fulfill({ status: 200, headers: {
            'Content-Type': 'application/json', 'Access-Control-Allow-Origin': base.origin,
            'Access-Control-Allow-Credentials': 'true',
          }, body: JSON.stringify({ authenticated: false }) });
        }
        unexpected.push({ origin: url.origin, method: request.method() });
        return route.abort();
      });
      await context.addInitScript(() => {
        window.__securityObservations = [];
        document.addEventListener('securitypolicyviolation', event => {
          window.__securityObservations.push({
            disposition: event.disposition,
            directive: event.effectiveDirective,
            blocked: event.blockedURI === 'eval' || event.blockedURI === 'inline' ? event.blockedURI : 'resource',
          });
        });
      });
      const page = await context.newPage(), pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      for (const pathname of ['/', '/privacy']) {
        const response = await page.goto(new URL(pathname, base).href, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        const headers = response.headers();
        assert.match(headers['content-security-policy'], /script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:/);
        const observation = headers['content-security-policy-report-only'];
        assert.ok(observation, 'Production report-only header must be present.');
        assert.match(observation, /script-src-attr 'none'/);
        assert.doesNotMatch(observation, /unsafe-eval|blob:|report-uri|report-to/);
        await page.locator('h1').first().waitFor();
        if (pathname === '/') {
          await page.getByRole('link', { name: /Zaloguj się/ }).waitFor();
          assert.equal(await page.locator('a[href="https://dyzury.orthobase.pl/"]').count(), 1);
          assert.equal(await page.locator('a[href="https://szkola.orthobase.pl/"]').count(), 1);
        }
        assert.deepEqual(await page.evaluate(() => window.__securityObservations), [], 'Normal page load should not violate the proposed policy.');
        console.log(`${viewport.width}px ${pathname}: headers and hydration pass.`);
      }
      assert.deepEqual(pageErrors, []);
      assert.deepEqual(unexpected, [], 'Unexpected traffic was blocked.');

      // Prove this is working observation, not silent enforcement. Each harmless
      // synthetic operation still executes under the preserved enforced policy.
      await page.evaluate(async () => {
        // Run eval from an actual page script. DevTools evaluation itself can
        // bypass eval CSP checks and would give a misleading test result.
        const evaluator = document.createElement('script');
        evaluator.textContent = "setTimeout(() => { (0, eval)('window.__observedEval = true'); }, 0)";
        document.body.append(evaluator); evaluator.remove();
        const button = document.createElement('button');
        button.setAttribute('onclick', 'window.__observedHandler = true');
        document.body.append(button); button.click(); button.remove();
        const blob = URL.createObjectURL(new Blob(['window.__observedBlob = true'], { type: 'text/javascript' }));
        const script = document.createElement('script'); script.src = blob;
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Synthetic blob script did not finish.')), 5000);
          script.onload = () => { clearTimeout(timer); resolve(); };
          script.onerror = () => { clearTimeout(timer); reject(new Error('Synthetic blob script was blocked.')); };
          document.body.append(script);
        });
        script.remove(); URL.revokeObjectURL(blob);
      });
      await page.waitForFunction(() => window.__securityObservations.length >= 3, null, { timeout: 5000 });
      const result = await page.evaluate(() => ({
        violations: window.__securityObservations,
        executed: [window.__observedEval, window.__observedHandler, window.__observedBlob],
      }));
      console.log(JSON.stringify({ viewport: viewport.width, synthetic: result }));
      assert.deepEqual(result.executed, [true, true, true]);
      assert.ok(result.violations.every(item => item.disposition === 'report'));
      assert.ok(result.violations.some(item => item.blocked === 'eval'));
      assert.ok(result.violations.some(item => item.directive === 'script-src-attr'));
      assert.ok(result.violations.some(item => item.directive === 'script-src-elem' && item.blocked === 'resource'));

      const contact = await context.request.get(new URL('/.well-known/security.txt', base).href);
      assert.equal(contact.status(), 200);
      assert.match(contact.headers()['content-type'], /text\/plain/);
      assert.match(await contact.text(), /Canonical: https:\/\/www\.orthobase\.pl\/\.well-known\/security\.txt/);
      const redirect = await context.request.get(new URL('/privacy?check=1', base).href, {
        headers: { host: 'orthobase.pl' }, maxRedirects: 0,
      });
      assert.equal(redirect.status(), 308);
      const target = new URL(redirect.headers().location);
      assert.equal(target.hostname, 'www.orthobase.pl');
      assert.equal(target.pathname + target.search, '/privacy?check=1');
      assert.match(redirect.headers()['strict-transport-security'], /includeSubDomains/);
      console.log(`${viewport.width}px: normal home/privacy hydration clean; eval, inline handler and blob script reported without blocking; contact file and apex redirect pass.`);
    }
  } finally {
    await Promise.all(contexts.map(context => context.close()));
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
