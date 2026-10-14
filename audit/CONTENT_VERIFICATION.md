# Content Verification

Audit date: 2026-10-13

## Source Files Reviewed

- `src/content/site.ts`
- `src/pages/index.astro`
- `src/pages/work/index.astro`
- `src/pages/work/dazlab.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`

## Employment Dates

| Item | Current content | Verification status |
| --- | --- | --- |
| Dazlab | `Jul 2025 - Sep 2025` | Needs external/user confirmation. |
| B+ Studio | `To be confirmed` | Explicitly unverified. |
| MCFLY Industries | `To be confirmed` | Explicitly unverified. |
| Earlier UI/UX & Product Roles | `To be confirmed` | Explicitly unverified. |

## Project Contributions To Verify

The following claims should be confirmed with source material, contracts, portfolio notes, client approval, or production examples:

- Dazlab: Webflow development, CMS architecture, responsive implementation, technical SEO foundations, integrations, website maintenance, and scalable website system outcome.
- Mortar: Figma-to-Webflow implementation, CMS configuration, technical SEO, and healthcare technology company description.
- Handl: Webflow implementation, integrations, and agency billing/operations SaaS platform description.
- Tangilla: Dashboard-to-Webflow development, responsive implementation, CMS configuration, and member-management platform description.
- General service claims: technical SEO, schema markup, third-party integrations, performance audits, launch readiness, AI-assisted refinement.

## Metrics And Quantitative Claims

The implemented site itself has limited quantitative claims. The visible `All Work (4)` count is supported by the four entries in `src/content/site.ts`.

The high-resolution project screenshot assets contain their own product/marketing metrics and claims. Those appear inside images and were not independently verified during this audit.

## External Links

The project data includes these external URLs:

- `https://dazlab.digital/`
- `https://mortar.design/`
- `https://handl.works/`
- `https://tangilla.com/`
- `https://www.linkedin.com/in/drin-camacho/`

This audit checked local href presence, not external site availability or ownership.

## Contact Form

The contact form includes:

- Required `name` field
- Required `email` field with `type="email"`
- Required `message` field
- Scope radio options
- Submit button text: `Send Inquiry ↗`

No real form submission was performed. The form currently has no explicit `action` or `method` attributes in the browser inspection result.

## Content Risks

- Replace or substantiate all `To be confirmed` employment dates before public launch.
- Confirm Dazlab date range before public launch.
- Verify client names, project roles, and contribution scope before using as marketing claims.
- Verify whether the project screenshot content can be publicly displayed.
- Confirm whether project screenshots include third-party claims or metrics that require permission or disclaimers.

