# ALD-117 — implementation verification

15 October 2026. **In Progress pending ChatGPT audit.** Isolated branch `ald-117-astro-sanity-integration`, based directly on PR #10 `5f181742dc7a31fae8e0c67b7d13cbddadae9deb`. Review PR targets `ald-116-sanity-schemas`, not main. PR #8 and #10 remain unmerged; PR #9 architecture was read without merging/cherry-picking. Verified GitHub main remains `88532ad18215c064a14e2824ec9f90b0e513d482`. PR #7 and existing untracked ALD-106 screenshots are preserved.

## Implemented

Build-only published query transport, explicit typed query contracts derived from PR #10, independent snapshot validation, protected approval interfaces, safe normalization, local source/derivative SHA-256 checks, explicit `CONTENT_SOURCE` opt-in, isolated CMS entry templates and one dynamic case-study route. No dependencies added; root and Studio lockfiles and Studio implementation unchanged. The existing GitHub build workflow receives one additive offline test step; triggers, permissions and deployment behavior are unchanged. Root `npm test` now runs the existing release validator and the new offline tests.

The public Astro config has **no live publication/media approval provider**. Live Sanity mode exits before network access, even with credentials. The local fixture config is separate, explicit, refuses Netlify, and authorizes only synthetic records. No live content, account settings or dataset access was tested. No tokens were created/read, no content migrated/published, no webhook/hosting change, no contact submission, merge or production deployment.

Architecture and release prerequisites: [integration documentation](ALD-117_SANITY_INTEGRATION.md).

## Automated evidence

Environment: Windows, Node **24.14.0**, npm **11.12.0**, existing Astro installation and Sanity **6.19.0**. Root GitHub CI uses Node 20 on Linux and installs only root dependencies. Root tests use plain JavaScript/JSON and no Studio runtime or TypeScript stripping. Live Sanity HTTP/account behavior is unverified.

| Check | Result |
| --- | --- |
| `npm run build` | Passed, default static output: nine public HTML routes plus 404 and sitemap. Final offline suite also builds static before and after fixture testing. |
| `npm run check` | Passed existing release validator. Existing `https://example.com` placeholder-domain warning retained deliberately. |
| `npm test` / `npm run test:content` | **44 tests passed**: 43 adapter/validation tests and one multi-build integration test. |
| Local TypeScript query-contract check | `node studio/node_modules/typescript/bin/tsc --project tests/content/tsconfig.json` passed; rejects an intentionally incorrect document-vs-image query assignment. Uses the already installed Studio compiler, not a new root dependency. |
| `npm --prefix studio run check` | Passed. Studio code unchanged. |
| `npm --prefix studio test` | **65 schema tests passed**, plus retained framework-parser compatibility check. |
| `node tests/content/groq-contract.mjs` | Passed using existing local Studio `groq-js`; parses/evaluates all three actual queries, excludes draft/version/unknown documents and validates their real projected null-bearing snapshot. Not required by root CI because Studio installation is separate. |
| Static baseline parity | **81/81 files SHA-256 identical**, zero added/removed/changed files against verified main. [Full hash evidence](ald-117/static-parity.json). Includes public assets/fonts, compiled hero animation, contact detector, robots, sitemap, headers, SEO/JSON-LD and canonical/noindex. |
| Fixture CMS build | Passed with all existing nine public routes, 404, sitemap and synthetic `/work/fixture-five/`. Listing count becomes 5 and sitemap includes the fifth route. No extra Astro case-study file. |
| Metadata and contact parity | Title, description, robots, canonical, all Open Graph/Twitter fields and parsed JSON-LD exactly match static for all nine existing public routes. Contact form markup exactly matches. |
| Failure builds | Invalid slug snapshot, unknown source flag and ordinary live Sanity mode all exit nonzero. No stale/static fallback. |
| Offline/secret assertions | Builds inherit a fetch-denial preload and have no Sanity target credentials. A fake secret sentinel, token variable name, cache variable, source/review metadata and synthetic approval notes do not appear in public HTML/JS/CSS/XML/text. No real secret used. |
| Scope/preservation | No diff to Studio, original pages, original content/image manifest, contact component, public assets, Netlify config or lockfiles. Both untracked ALD-106 screenshots retain their original hashes. |
| GitHub CI | New offline tests run in the existing PR workflow. Exact final-head run/check result is recorded in the PR and Linear after push; local results above do not substitute for remote CI. |

`npm run check` is the repository's custom release validator, not the standalone `astro check` type checker. Root `@astrojs/check`/TypeScript are not installed; no package was added for that command. Astro compilation, independent runtime tests, query-contract type checking and existing Studio TypeScript checks were run. The typed declarations express expected projected schema shapes; they do not make remote JSON trusted. Runtime validation remains authoritative.

### Validation coverage and limits

Positive published snapshot, missing settings/pages, duplicate singletons/IDs/slugs, changed retained slugs, traversal/reserved routes, draft and release records, missing/unpublished/weak references, invalid HTTPS/credential URLs, alt text, unapproved rights, missing/wrong attribution, required SEO/provisional notices, four-digit year precision/reversed years, nested section order, unsupported Portable Text/HTML, unexpected private fields, invalid anchors, cross-project assets, protected revision digest mismatch, unapproved local asset eligibility, source/derivative hash mismatch and fixture environment restriction.

Media approval fields alone cannot authorize publication. Required credit/caption presentation and changed crop/hotspot derivatives fail closed rather than being ignored. SEO length remains warning-only, preserving approved wording. Automated checks cannot establish employment facts, legal reuse rights, client endorsement, editorial authority or actual account roles. A revision recheck is a race detector, not a transaction; future approval must bind asset revision/content/usage and local derivative manifests. Live API responses, private dataset read permissions and hosted preview access are not proven by mocks or local GROQ evaluation.

## Local browser evidence

`node tests/content/browser-qa.mjs` uses a loopback-only file server and blocks external requests. **Chromium 156.0.8078.4**: **57 route/viewport checks** (nine static routes and ten fixture CMS routes at **390×844**, **768×1024**, **1440×900**). All return 200, with loaded images, no horizontal overflow and no page exceptions. Reduced-motion hero remains visible; normal desktop animation reaches completion; JavaScript-disabled hero/content remain usable. Mobile menu opens and closes by Escape. **Zero forms submitted.** [Machine-readable results](ald-117/browser-results.json).

Twelve screenshot pairs are byte-identical between static and fixture CMS: hero viewport, full About, full Contact and full Dazlab case study, each at mobile/tablet/desktop widths. The full homepage/work listing intentionally show a clearly synthetic fifth test card; this is not a proposed public portfolio entry. Firefox, WebKit, other viewport sizes, formal axe checks, Lighthouse and field Core Web Vitals were not run for this integration task; no scores, INP or cross-browser completion are claimed.

Representative **offline fixture** screenshots (existing images remain provisional; these screenshots establish layout only):

- [Desktop hero](ald-117/cms-hero-1440.png)
- [Mobile About](ald-117/cms-about-390.png)
- [Tablet case study](ald-117/cms-work-dazlab-768.png)
- [Mobile Contact](ald-117/cms-contact-390.png)

The local file server is not Netlify. Security/cache/CSP preservation is established by unchanged Netlify configuration and identical published header/asset bytes, not a new production-response inspection. Canonical/noindex protection remains exactly as before, including the placeholder-domain guard.

## Remaining gates

1. **Protected publication ledger and media policy:** not approved or implemented for live use. Public CMS builds stay blocked. New asset ingestion, required attribution/captions and crop/hotspot treatment require review. Do not treat fixture rights as permission.
2. **Migration and actual published content:** not performed. Need separately authorized migration and live read verification before any CMS enablement.
3. **ALD-115 security:** retained prior findings, not resolved or re-audited here: Studio **16 affected entries (7 high, 9 moderate)** across braces/sprintf-js/uuid advisory families; existing root audit **3 affected entries (1 critical, 1 high, 1 low)** in Astro/Sharp/esbuild. Dependency versions and both lockfiles unchanged. See [security review](ALD-115_SECURITY_REVIEW.md). No new dependency or advisory remediation claim.
4. **Account checks — Pending manual verification:** roles, dataset visibility, credentialed read/write permissions, CORS credential policy and token inventory/scope. Previously confirmed Studio sign-in is historical evidence only. No further sign-in or user interaction requested.
5. **ALD-109:** independent automatic production-deployment gate remains unresolved and In Progress. This PR does not trigger, repair or certify production deployment.
6. **Stacked review/release approval:** ALD-117 remains In Progress pending ChatGPT audit. PR #8/#10 dependency reviews, preview access controls, merge and deployment approval remain separate. No production CMS enablement is authorized by this implementation.
