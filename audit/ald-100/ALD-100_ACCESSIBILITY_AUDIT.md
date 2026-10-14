# ALD-100 Accessibility and Interaction Audit

Date: 2026-10-14
Branch: `ald-100-accessibility-audit`
Dependency base: PR #1 / `ald-98-responsive-audit`

## Coordination With ALD-98

ALD-98 remains in unmerged PR #1. This branch is stacked on `ald-98-responsive-audit` so it preserves the Mortar 320px overflow fix and mobile menu focus fix without duplicating or overwriting them. The ALD-100 PR should be reviewed after, or against, PR #1.

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

Checks performed:

- Axe-core WCAG 2 A/AA, WCAG 2.1 A/AA, and best-practice scan.
- Single H1 per route.
- Accessible link and button names.
- Image alt attributes.
- Skip-link keyboard behavior.
- Mobile navigation focus trap and Escape return.
- Contact form group, labels, and required browser validation.

## Findings Fixed

### Serious: Tool marquee used `aria-label` on non-role `div` elements

The home page failed axe with `aria-prohibited-attr` on decorative tool-logo wrappers. The marquee now exposes one focusable, labelled region and hides the visual scrolling track from assistive technologies.

### Serious: Workflow step numbers failed color contrast

White step numbers on the orange workflow badges measured below WCAG AA contrast. The step numbers now use the ink color with a heavier weight on the existing orange badge.

### Serious: Muted hero links failed color contrast during audit

Small muted text links measured below the 4.5:1 AA threshold. The global muted token was darkened from `#626975` to `#4f5661`.

### Moderate: Work archive heading order skipped from H1 to H3

The work archive had a hidden H1 after a visible H2, then project-card H3 headings. The archive section heading now renders as the page H1, and project cards on that page render as H2.

### Keyboard: No skip link to main content

Keyboard users had no direct bypass to main content. A visible-on-focus skip link now targets the main element.

### Form semantics: Contact radio group lacked a fieldset and durable ids

The contact form radio options are now wrapped in a fieldset with legend. Visible fields have stable `id`/`for` label associations, autocomplete attributes where appropriate, and a required-fields note.

## Verification

- `npm run build`: passed.
- `npm run check`: passed with existing warnings for placeholder production domain and explicitly unverified experience dates.
- `npm test`: passed with the same existing warnings.
- ALD-100 Playwright + axe audit against local built output: 19/19 passed.

## Evidence

Screenshots were captured for each audited route at desktop and mobile sizes:

- `audit/ald-100/screenshots/*-desktop.png`
- `audit/ald-100/screenshots/*-mobile.png`

## Remaining Blockers

- This branch is stacked on unmerged PR #1. Review/merge sequencing should keep PR #1 before ALD-100, or ALD-100 should be rebased after PR #1 lands.
- Existing release-validation warnings remain outside ALD-100 scope: placeholder production domain and explicitly unverified experience dates.
- `npm install` reported existing dependency audit findings: 1 low, 1 high, and 1 critical vulnerability. No automatic remediation was applied because it may require breaking changes and is outside ALD-100 scope.
