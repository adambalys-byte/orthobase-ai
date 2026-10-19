const fs = require('node:fs');
const path = require('node:path');

const CANONICAL = 'https://www.orthobase.pl/.well-known/security.txt';
const DAY = 24 * 60 * 60 * 1000;

function inspectSecurityTxt(text, now = new Date()) {
  const errors = [], warnings = [];
  const fields = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = /^([A-Za-z-]+):\s*(.+)$/.exec(line);
    if (!match) { errors.push('Malformed security.txt field.'); continue; }
    const name = match[1].toLowerCase();
    fields.set(name, [...(fields.get(name) || []), match[2].trim()]);
  }
  if (!(fields.get('contact') || []).some(value => /^mailto:[^\s@]+@[^\s@]+$/.test(value))) {
    errors.push('A usable mailto Contact is required.');
  }
  if (!(fields.get('canonical') || []).includes(CANONICAL)) {
    errors.push('Canonical must include the final HTTPS www URL.');
  }
  const expires = fields.get('expires') || [];
  const expiry = expires.length === 1 && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(expires[0])
    ? new Date(expires[0]) : new Date(NaN);
  let daysRemaining = null;
  if (!Number.isFinite(expiry.getTime()) || expiry.toISOString().replace('.000Z', 'Z') !== expires[0]) {
    errors.push('Exactly one valid UTC Expires field is required.');
  } else {
    daysRemaining = Math.ceil((expiry - now) / DAY);
    const oneYear = new Date(now);
    oneYear.setUTCFullYear(oneYear.getUTCFullYear() + 1);
    if (expiry <= now) errors.push('security.txt has expired; review the contact details and renew Expires.');
    else if (expiry > oneYear) errors.push('Expires must be no more than one year ahead (RFC 9116).');
    else if (expiry - now <= 30 * DAY) warnings.push(`security.txt expires in ${daysRemaining} days; review and renew it.`);
  }
  return { errors, warnings, daysRemaining };
}

if (require.main === module) {
  const text = fs.readFileSync(path.join(__dirname, '../public/.well-known/security.txt'), 'utf8');
  const result = inspectSecurityTxt(text);
  for (const warning of result.warnings) console.warn(`WARNING: ${warning}`);
  for (const error of result.errors) console.error(`ERROR: ${error}`);
  if (result.errors.length) process.exitCode = 1;
  else console.log(`security.txt valid; ${result.daysRemaining} days until expiry.`);
}

module.exports = { inspectSecurityTxt };
