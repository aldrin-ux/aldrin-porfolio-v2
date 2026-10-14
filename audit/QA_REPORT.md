# QA Report

Audit date: 2026-10-13

## Scope

This audit covers the local Astro Portfolio V2 implementation in:

`E:\Desktop\Digitalikha\Digitalikha\Portfolio\portfolio-v2-astro`

No website redesign, content edits, production deployment, or real contact-form submission was performed.

## Browser Checks

Browser automation was available through the Codex in-app browser Playwright API. A standalone project-level Playwright package was not installed in `node_modules`, so screenshots and runtime checks were captured through the available browser automation rather than a checked-in Playwright test suite.

Routes checked:

- `/`
- `/work/`
- `/work/dazlab/`
- `/about/`
- `/contact/`

Viewport checks:

- Desktop: 1440 x 900
- Mobile: 390 x 844

Results:

- All required routes loaded during browser QA.
- Full-page screenshots were captured for all required routes at both viewport sizes.
- Console errors/warnings: none captured during the browser route pass.
- Horizontal overflow: none detected at desktop or mobile.
- Contact form: present on `/contact/` with required `name`, `email`, and `message` fields, plus an email input type. The form was inspected without submission.
- Keyboard navigation: visible focusable elements were detected on all routes. The contact page includes focusable radio controls, text input, email input, textarea, submit button, and links.
- Mobile navigation: desktop nav links are hidden at mobile width, and no visible mobile menu button or bottom navigation is present. Footer links remain available later on the page. This is a functional/design gap if the approved mobile Stitch design expects persistent mobile navigation.
- Broken images: no missing local asset files were confirmed. Browser logs flagged some offscreen lazy images as not loaded in the Dazlab related-project section; the files exist in `public/assets/`, so this appears to be lazy-loading state rather than a missing file.

Raw browser QA data is saved in:

- `audit/logs/browser-functionality-checks.json`
- `audit/logs/browser-responsive-checks.json`

## Technical Checks

| Check | Result | Log |
| --- | --- | --- |
| `npm run build` in sandbox | Failed with Windows `spawn EPERM` from Astro/Vite | `audit/logs/npm-run-build.log`, `audit/logs/npm-run-build-rerun.log`, `audit/logs/npm-run-build-after-server-stop.log` |
| `npm run build` outside sandbox | Passed; 5 pages built | `audit/logs/npm-run-build-escalated.log` |
| `npx tsc --noEmit` | Did not run a project check; no `tsconfig.json` was available, so TypeScript printed help output | `audit/logs/npx-tsc-noemit.log` |
| `npx astro check` | Not completed because Astro prompted to install `@astrojs/check` and `typescript`; no dependency install was performed during audit | `audit/logs/npx-astro-check.log` |
| ESLint | Not available; no ESLint config or npm lint script found | `audit/logs/eslint-availability.log` |
| Accessibility audit tooling | Not available locally; no local axe/pa11y binary found | `audit/logs/accessibility-availability.log` |
| Lighthouse | Not available locally; no local Lighthouse binary found | `audit/logs/lighthouse-availability.log` |

## Issues And Risks

1. Mobile navigation does not match a design that expects a dedicated mobile nav control or persistent mobile nav.
   - Evidence: `audit/logs/browser-responsive-checks.json`
   - Impact: mobile users have top brand/avatar links and footer navigation, but no visible primary mobile nav near the top.

2. `/work/` does not expose an `h1` element.
   - Evidence: browser route data reports `h1: null` for `/work/`.
   - Impact: semantic structure and accessibility can be improved.

3. Only Dazlab has a dedicated case-study route.
   - Evidence: `src/pages/work/dazlab.astro`; project data for Mortar, Handl, and Tangilla points back to `/work/`.
   - Impact: project cards may imply case-study depth that is not implemented for three projects.

4. Build behavior depends on execution context.
   - Evidence: sandboxed builds failed with `spawn EPERM`; escalated build passed.
   - Impact: another reviewer running inside the same sandbox may see false-negative build failures.

5. Dedicated accessibility and Lighthouse audits were not available.
   - Evidence: availability logs.
   - Impact: no formal accessibility or performance scores are included in this audit.

## Positive Findings

- All required routes render locally.
- Full-page screenshots were captured for the requested desktop and mobile sizes.
- No horizontal overflow was detected at 1440px or 390px.
- Console checks did not capture runtime errors or warnings during route inspection.
- High-resolution Dazlab, Mortar, Handl, and Tangilla project images are present in `public/assets/`.
- The escalated production build completed successfully and generated 5 pages.

