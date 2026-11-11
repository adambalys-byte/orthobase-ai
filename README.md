This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tests

- `npm test` runs the unit tests.
- `npm run ci:test` runs unit tests, validates `security.txt`, and builds the site.
- `npm run test:e2e` runs the browser checks against an already running local
  production server (by default `127.0.0.1:3186`). Install Playwright Chromium
  first with `npx playwright install chromium` if it is not already available.
  See [SECURITY-OPERATIONS.md](SECURITY-OPERATIONS.md) for the manual steps and
  safety limits.

These commands do not create recurring jobs. The browser checks use fictional
account data, block external requests, and do not send forms or emails.
The test commands use the project scripts directly, without an extra server orchestration dependency.

Dependency security updates stay on the Next.js 15.5 maintenance line. Two
scoped overrides cover upstream pins: Next.js uses PostCSS 8.5.23, and the
TypeScript ESLint parser uses minimatch 11.0.1. Recheck these overrides when
upgrading the parent packages. Verify lockfile changes with the unit tests,
production build (including lint and types), and isolated browser checks.
The retired Early Access endpoint remains closed and has no mail dependency.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
