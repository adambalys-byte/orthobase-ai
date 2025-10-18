import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/OrthoBase|Ortho Base|Ortho/i);
});

test('CTA for Early Access is visible (tolerant)', async ({ page }) => {
  await page.goto('/');

  const candidates = [
    page.getByRole('link', { name: /early access|wczesny.*dostęp|zapis|dołącz|join|sign.*up/i }),
    page.getByRole('button', { name: /zapis|dołącz|join|sign.*up/i }),
    page.locator('a[href*="early"]'),
    page.locator('a:has-text("Early")'),
    page.locator('a:has-text("dostęp")'),
  ];

  let foundVisible = false;
  for (const c of candidates) {
    try {
      const el = c.first();
      if (await el.isVisible()) { foundVisible = true; break; }
    } catch { /* ignore */ }
  }

  expect(foundVisible, 'CTA (link lub button) powinien być widoczny na stronie głównej').toBeTruthy();
});

test('subtitle (tagline) is present', async ({ page }) => {
  await page.goto('/');
  const maybeSubtitle = page.locator('p, h2, h3').filter({ hasText: /inteligentny|asystent|ortoped/i });
  await expect(maybeSubtitle.first()).toBeVisible();
});
