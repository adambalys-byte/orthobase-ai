const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { inspectSecurityTxt } = require('../scripts/check-security-txt.cjs');
const text = fs.readFileSync(path.join(__dirname, '../public/.well-known/security.txt'), 'utf8');
const at = value => new Date(`${value}T00:00:00Z`);
const withExpiry = value => text.replace(/^Expires:.*$/m, `Expires: ${value}`);

test('Published contact file has a future expiry within one year and the final canonical URL', () => {
  assert.deepEqual(inspectSecurityTxt(text, at('2026-10-19')).errors, []);
  assert.deepEqual(inspectSecurityTxt(text, at('2026-10-19')).warnings, []);
  assert.doesNotMatch(text, /^Encryption:/m, 'Do not advertise the confirmed missing PGP key.');
});

test('Expiry warning starts at 30 days and expired records fail at the exact instant', () => {
  assert.equal(inspectSecurityTxt(text, at('2027-08-31')).warnings.length, 0);
  assert.equal(inspectSecurityTxt(text, at('2027-09-01')).warnings.length, 1);
  assert.deepEqual(inspectSecurityTxt(text, at('2027-09-30')).errors, []);
  assert.match(inspectSecurityTxt(text, at('2027-10-01')).errors.join(' '), /expired/);
});

test('Missing, duplicate, invalid, normalized impossible and overly distant expiries fail', () => {
  for (const candidate of [
    text.replace(/^Expires:.*$/m, ''),
    text + '\nExpires: 2027-09-01T00:00:00Z\n',
    withExpiry('tomorrow'),
    withExpiry('2027-02-30T00:00:00Z'),
    withExpiry('2028-01-01T00:00:00Z'),
  ]) assert.ok(inspectSecurityTxt(candidate, at('2026-10-19')).errors.length > 0);
});

test('Contact and canonical errors remain visible even with a good expiry', () => {
  assert.match(inspectSecurityTxt(text.replace(/^Contact:.*$/m, ''), at('2026-10-19')).errors.join(' '), /Contact/);
  assert.match(inspectSecurityTxt(text.replace('Canonical: https://www.', 'Canonical: https://'), at('2026-10-19')).errors.join(' '), /Canonical/);
});
