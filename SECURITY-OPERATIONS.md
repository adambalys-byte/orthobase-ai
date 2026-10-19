# Public security metadata and CSP observation

## security.txt

The public contact file is `public/.well-known/security.txt`. Its final URL is
`https://www.orthobase.pl/.well-known/security.txt`; the apex redirects to `www`.
The existing contact and privacy URL are preserved. On 19 October 2026 both
the advertised `https://orthobase.pl/pgp.txt` (after redirect) and the direct
`www` URL returned HTTP 404, so the `Encryption` field was removed. Add it back
only after publishing and verifying an owner-approved public key.

The reviewed expiry is 1 October 2027, less than one year from this review.
`npm run check:security` validates it, warns with 30 days remaining, and fails
for an expired or invalid date. The same check runs before `npm run build`.
This is a build/manual check, not a continuously scheduled monitor. Keep the
independent public monitor's expiry check enabled, and renew only after
reviewing that the contact details still work.

## CSP observation stage — not enforcement

Production responses now include `Content-Security-Policy-Report-Only` with
`script-src 'self' 'unsafe-inline'; script-src-attr 'none'; object-src 'none'`.
The existing enforced policy stays in place during this stage. The proposed
policy reports eval, blob scripts and inline event attributes without blocking
them. It **still permits inline script elements**, which Next.js uses for the
current static hydration. This does not claim strict XSS protection or a full
CSP repair. A nonce-based strict policy would require dynamic rendering and a
separate review of caching, hosting and performance. Development does not get
the report-only header because its runtime legitimately uses eval.

There is no reporting endpoint or external telemetry. Observations are visible
in browser developer tools and `securitypolicyviolation` events. No report
body, page URL, query string, code sample or user information is collected by
this change. Consequently, there is no central production violation dashboard.

Before enforcing the narrower directives, observe the production version in
target browsers during ordinary homepage/privacy navigation, account status
refresh and any active workshop notice. Treat browser extension/injected code
reports separately. Record genuine first-party violations and resolve them;
do not add broad sources simply to silence reports. Then deploy enforcement as
a separate reviewed change. Do not remove inline script permission until a
tested nonce/hash strategy exists.

## Isolated verification

1. `npm ci --ignore-scripts`
2. `npm run test:unit`
3. `npm run build`
4. Start `npm run start -- --hostname 127.0.0.1 --port 3186`.
5. In another terminal run `npm run test:security-browser`.

The browser check accepts localhost only, blocks service workers, intercepts
all outside traffic, and supplies fictional account state. It checks mobile
and desktop page hydration, headers, links, the contact file and the apex
redirect. Harmless injected eval/handler/blob examples demonstrate that the
proposed controls actually report while leaving execution unchanged. It does
not submit forms, send emails or test a real account.

References: [Next.js CSP guidance](https://nextjs.org/docs/app/guides/content-security-policy),
[RFC 9116](https://www.rfc-editor.org/rfc/rfc9116).
