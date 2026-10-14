# ALD-98 Responsive Visual and UX Audit

Date: 2026-10-14
Branch: `ald-98-responsive-audit`
Base reviewed: `https://aldrin-camacho.netlify.app`
Local verification URL: `http://127.0.0.1:4173`

## Scope

Routes audited:

- `/`
- `/work/`
- `/work/dazlab/`
- `/work/mortar/`
- `/work/handl/`
- `/work/tangilla/`
- `/about/`
- `/contact/`

Viewport widths audited:

- 320
- 375
- 390
- 430
- 768
- 1024
- 1440
- 1920

## Findings

### High: Mortar case-study hero overflowed at 320px

Reproduction:

1. Open `https://aldrin-camacho.netlify.app/work/mortar/`.
2. Set viewport to 320px wide.
3. Observe horizontal page overflow from the case-study hero heading and eyebrow text.

Evidence:

- Live audit measured `documentElement.scrollWidth` as 341px against a 320px viewport.
- Overflowing elements included the hero eyebrow text `Case Study / Interior-design SaaS` and the `h1` text `Mortar - Webflow Implementation & CMS Setup.`
- Screenshot evidence path after local verification: `audit/ald-98/screenshots/mortar-320.png`.

Fix:

- Allowed case-study hero grid children to shrink below min-content width.
- Allowed long case-study hero heading and mobile eyebrow text to wrap safely.

### Medium: Mobile navigation did not move focus into the opened dialog

Reproduction:

1. Open `/` at 390px wide.
2. Activate the menu button.
3. The dialog opens, but focus does not land on the visible Close button.

Evidence:

- Playwright keyboard test failed because `.menu-close` was not focused after opening the mobile menu.
- Root cause: the hidden backdrop button matched the focusable selector even though it has `tabindex="-1"`.

Fix:

- Updated the mobile navigation focus selector to ignore elements with `tabindex="-1"`.

## Passing Verification

- `npm run build`: passed.
- `npm run check`: passed with existing warnings for placeholder production domain and explicitly unverified experience dates.
- `npm test`: passed with the same release-validation warnings.
- Playwright responsive audit: 66/66 passed locally against the built Astro output.

## Screenshot Evidence

Representative screenshots were captured for each audited route at:

- 320px
- 768px
- 1440px
- 1920px

Screenshots are stored in `audit/ald-98/screenshots/`.

## Remaining Blockers

- The live production site still reflects `main` until this branch is reviewed and merged.
- Final production verification should be repeated on the Netlify deploy preview or post-merge deployment before launch approval.
- Existing non-ALD-98 warnings remain: placeholder production domain and unverified experience dates.
