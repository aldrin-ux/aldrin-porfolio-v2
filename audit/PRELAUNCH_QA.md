# Prelaunch QA

Audit date: 2026-10-13

## Build Status

Final production build status: Passed outside sandbox.

Log:

- `audit/logs/sprint-npm-run-build-final-escalated.log`

Note: the sandboxed final build failed with Windows `spawn EPERM`, matching the prior environment-specific false-negative. The same `npm run build` command passed outside the sandbox and built 5 pages.

## Available Technical Checks

| Check | Result | Log |
| --- | --- | --- |
| Astro production build | Passed outside sandbox | `sprint-npm-run-build-final-escalated.log` |
| TypeScript `npx tsc --noEmit` | No project check; no `tsconfig.json`, so TypeScript printed help | `sprint-npx-tsc-noemit.log` |
| ESLint | Not configured | `sprint-eslint-availability.log` |
| Lighthouse | Not installed locally | `sprint-lighthouse-availability.log` |
| axe/pa11y | Not installed locally | `sprint-accessibility-availability.log` |

## Accessibility / Semantic Status

- Mobile nav has accessible button labels, `aria-expanded`, and `aria-controls`.
- Mobile nav dialog includes `role="dialog"` and `aria-modal="true"`.
- Focus-visible styling is defined globally.
- Every core route now has one `h1`.
- Contact inputs have visible labels.
- Images have alt text.

## SEO Status

Implemented:

- Title
- Meta description
- Canonical link
- Open Graph title, description, URL, image
- Twitter card metadata

Needs final production input:

- Replace `https://example.com` in `astro.config.mjs`.
- Add or generate `sitemap.xml`.
- Add `robots.txt`.
- Confirm final Open Graph image path and domain.

## Netlify Preview Readiness

Ready for Netlify preview: Yes, with caveats.

Caveats:

- Do not treat preview as production until `astro.config.mjs` has the approved real domain.
- Netlify form markup is present, but form handling should be verified in a Netlify deploy preview because local static preview cannot fully process Netlify Forms.
- Lighthouse/accessibility scores were not produced because tooling was unavailable locally.

## Remaining Differences / Risks

- Stitch visual comparison remains a human review task using the captured screenshots.
- About portrait is not transparent-background because no transparent asset was supplied.
- Some unverified employment dates remain intentionally labeled `To be confirmed`.

