# Astro + Sanity — current local setup

Review-only consolidation of PRs #8, #10, #11 and #12. Static Astro is the default; no public CMS or hosted Studio is activated. Production writes, merges and deployments require separate approval, including resolution of the ALD-109 deployment gate.

## Supported modes

| Mode | Entry point | Content and boundaries |
| --- | --- | --- |
| Default static | `npm run build` | Existing source content, four case studies, nine public routes; no Sanity request or credential required. |
| Isolated local sample | `astro.local.config.mjs` | Exactly `p9xrr86a/ald118-test`, one published synthetic project; static globals and existing projects retained. Rejects hosting/CI and production. |
| Full-site CMS adapter | `CONTENT_SOURCE=sanity` | Existing published-only snapshot adapter and dynamic routes retained, but public config has no publication/media policy and fails before live reads. Not activation-ready; no ledger is added here. |

An unavailable/invalid CMS read fails the selected CMS build; it does not silently replace CMS content with static content. Static mode remains an explicit, separate choice.

## Standalone Studio

Astro and `studio/` have independent packages and lockfiles. Root CI remains Node 20; Studio requires Node 22.12+ (local consolidation checks use Node 24.14.0). Install reviewed dependencies with `npm ci` and `npm --prefix studio ci` if needed. Do not run dependency upgrades as part of setup.

Use a dedicated PowerShell terminal for the isolated editor:

```powershell
$env:SANITY_STUDIO_PROJECT_ID='p9xrr86a'
$env:SANITY_STUDIO_DATASET='ald118-test'
npm --prefix studio run dev
```

Open http://localhost:3333 and sign in directly. Confirm **ALD-118 — ISOLATED SYNTHETIC TEST** before editing. The isolated view reuses the project title, stable slug, summary and image fields; it requires no portfolio profile or page documents. The ordinary full schema set remains available for the configured production target, but these editable forms do not grant permission to write there. Existing ignored local env files are not overwritten by this guide.

The previously approved private test dataset exists; its one synthetic sample is unpublished and its original synthetic PNG remains. The real Studio publish/edit/unpublish proof already passed in PR #12. Consolidation does not rerun it or create datasets, content, assets, credentials or account settings. Use only the approved test target for any later separately authorized live test. Existing localhost CORS was sufficient for the proof; no new origin or permission is needed by this consolidation.

## Local published-content build

Requires installed Studio dependencies and the existing CLI login; no new API token. Use a separate dedicated terminal:

```powershell
$env:CONTENT_SOURCE='static'
$env:CONTENT_LOCAL_TEST='1'
$env:SANITY_PROJECT_ID='p9xrr86a'
$env:SANITY_DATASET='ald118-test'
npm run build -- --config astro.local.config.mjs
npm run preview -- --config astro.local.config.mjs --host localhost --port 4323
```

Output goes to ignored `test-results/ald-118-live/`. `/work/sample-project/` exists only when the sample is published; it currently returns 404. A fresh build drops unpublished routes, Work listing entries, sitemap entries and the copied PNG. Draft changes remain excluded until publication. Close dedicated terminals afterward so their test flags do not carry into normal commands.

CLI authentication stays in its normal user-profile storage and is consumed only by the explicit local build configuration. Never put tokens in `SANITY_STUDIO_*`, public documents, browser code, Git or chat. Only public identifiers belong in Studio variables. Local env files, dependencies, caches and output remain ignored. The isolated media path accepts a PNG from the exact test dataset, with alt text, rights status and dimensions; delivery stays local without changing the site's CSP.

## Essential content contract from PR #9

- One `project` owns its card and embedded `caseStudy`; do not create a second independently published case-study document. Keep card/narrative summaries distinct and attribution factual.
- Preserve `/work/dazlab/`, `/work/mortar/`, `/work/handl/` and `/work/tangilla/`. Derive project routes from stable slugs; published slug changes require a separately reviewed redirect.
- `professionalExperience` stores year-only dates and referenced records; do not invent months, claims or project dates. Site settings, profile, navigation and fixed pages are separate documents in the retained full model.
- Use Sanity-generated ordinary document IDs, strong references and stable array keys. Singletons alone use controlled IDs. Keep private rights evidence, credentials, contact data and infrastructure settings out of CMS content.
- Studio validation helps editors but does not enforce API permissions. Build-time validation, published-only queries, safe text/links and resolved references remain necessary. Bounded existing section objects are retained; no generalized page builder is introduced.
- Canonical origin, noindex, contact handling, security headers and release approval remain code/account controlled. Full migration and production image rights remain unapproved.

Detailed field inventory is preserved in [PR #9's pinned migration mapping](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_MIGRATION_MAPPING.md). Its proposed enterprise workflow/ledger is historical, not a prerequisite for the accepted local sample or an implementation request. The retained full-site adapter's existing policy hooks remain dormant; consolidation neither adds a ledger nor removes safety checks without a scoped review.

## Verification and release limits

Use `npm test`, `npm --prefix studio run check`, `npm --prefix studio test` and `npm --prefix studio run build`. Content tests build offline fixtures and cover invalid data, published-only retrieval, routes, title changes, unpublish and static restoration. Default output must match the recorded 81-file main baseline in `docs/ald-117/static-parity.json`.

Known dependency advisories and deferred production account/access verification remain release blockers; see [consolidation report](ASTRO_SANITY_CONSOLIDATION.md). Local sample success does not certify production roles, asset rights, hosting or ALD-109. Existing static/CMS template duplication is retained to preserve output; later visual edits must consider both sets. No broad browser matrix or live editing repeat is needed for this consolidation.
