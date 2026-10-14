# ALD-111 Security and Production Configuration Review

Date: 2026-10-14
Branch: `ald-111-security-review`
Dependency base: PR #2 / `ald-100-accessibility-audit`, stacked on PR #1 / `ald-98-responsive-audit`

## Dependency Audit

Commands run:

- `npm audit --json`
- `npm audit --omit=dev --json`
- `npm ls --all --depth=2`

Result:

- Current lockfile reports 0 vulnerabilities.
- Production-only audit reports 0 vulnerabilities.
- No exact vulnerable package/advisory is present in the current lockfile.

Observed direct dependencies:

- Production: `astro@5.18.2`
- Development: `@axe-core/playwright@4.13.0`, `@playwright/test@1.64.0`

Risk assessment:

- The ALD-100 npm-install warning for 1 low, 1 high, and 1 critical vulnerability did not reproduce after the lockfile was committed.
- No production dependency advisory is currently reported by npm audit.
- No breaking upgrade or `npm audit fix --force` was used.

## Environment and Secrets Review

Checks run:

- Searched source/config/public files for secret-like strings, private keys, Sanity variables, token names, `process.env`, and `import.meta.env`.
- Searched for committed `.env` files.
- Reviewed `.gitignore` secret exclusions.

Result:

- No `.env` files are present.
- No committed API keys, Sanity secrets, private keys, passwords, or write tokens were found.
- `.gitignore` excludes `.env`, `.env.*`, `secrets/`, and `local-secrets/`.
- The only environment references are local test base URLs in audit specs.

## Public Assets Review

Checks run:

- Listed all files under `public/`.
- Searched public/source/config files for inline script tags, event handlers, `javascript:` URLs, and secret-like strings.

Result:

- Public assets are images, SVG tool logos, and `robots.txt`.
- No scriptable SVG content or event-handler attributes were found in public assets.
- Large PNG source assets remain public; this is a performance/asset-size concern rather than a security vulnerability.

## Netlify Configuration Review

Existing safe controls:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Deploy-preview and branch-deploy `X-Robots-Tag: noindex, nofollow`
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

Fix added:

- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Cross-Origin-Opener-Policy: same-origin`
- `Content-Security-Policy` with:
  - `default-src 'self'`
  - `base-uri 'self'`
  - `object-src 'none'`
  - `frame-ancestors 'none'`
  - `form-action 'self'`
  - Google Fonts allowances
  - inline script/style allowances required by the current static Astro output
  - `upgrade-insecure-requests`

## Verification

- `npm audit --json`: 0 vulnerabilities.
- `npm audit --omit=dev --json`: 0 vulnerabilities.
- `npm run build`: passed.
- `npm run check`: passed with existing warnings for placeholder production domain and explicitly unverified experience dates.
- `npm test`: passed with the same existing warnings.
- ALD-100 Playwright + axe browser regression: 19/19 passed.
- ALD-98 responsive browser regression: 66/66 passed.

## Remaining Risks and Follow-ups

- The production site metadata still uses `https://example.com`, which keeps the existing release-validation warning and affects canonical/robots output. This is a launch configuration issue outside this security-header fix.
- The CSP uses `'unsafe-inline'` for scripts and styles because the current Astro output includes inline scripts and styles. A stricter nonce/hash CSP would require a separate implementation pass.
- PR review order remains stacked: PR #1, then PR #2, then ALD-111.
