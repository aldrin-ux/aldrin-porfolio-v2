# ALD-118 — local case-study editor

Review-only follow-up on draft PR #13, branch `ald-118-cms-consolidation`. The previous isolated Studio view explicitly filtered projects to four fields, hiding the already-defined embedded case study. This change exposes that model in the private local editor; production schema and default static behavior remain unchanged.

## Fields and rendering

| Editor | Stored field / local Astro rendering |
| --- | --- |
| Project Details | Existing `title`, `slug`, `cardSummary`, `cardRole` (Role), `tags` (Platforms), optional `externalUrl`; card, route and details. |
| Project Overview | Existing `caseStudy.summary`; plain-text introduction, falling back to card summary when absent. |
| The Challenge / My Contribution / Development Approach / Outcome | Existing `caseStudy.sections[]` with `heading` and Portable Text `body`; existing renderer produces ordinary paragraphs, bold and emphasis under section headings. These are named narrative items, not separate new fields. |
| Optional heading / small label | Existing `caseStudy.heading` / `eyebrow`; defaults to project title / isolated-test label. |
| Media | Existing `cardImage`, optional `caseStudy.heroImage`, `mediaUsage` alt/decorative/caption and rights status/credit. Caption is plain image text, never narrative or Markdown input. |
| SEO | Existing `caseStudy.seo.title`, `description`, `socialImage`; fallback title and overview/card summary, image fallback to case-study image/cover. Local noindex remains forced. |
| Additional screenshots | **Only new stored field:** optional project `screenshots[]`, reusing `mediaUsage`. The existing model had no project screenshot collection. Added only to the isolated editor/query, without a new content type or page builder. |

The project-level Case Study Content and SEO tabs expose the same embedded object. Inside it, choose Narrative, Case-study image or SEO. My Contribution uses the same narrative-section structure as the other sections; no duplicated attribution field is introduced into the local view.

The published-only local query retrieves these fields, validates text, keyed sections and media, and normalizes them into the existing CMS layout. Optional absent narrative/SEO does not break older projects. Supplied invalid content produces document-specific field errors. Rich bodies require nonempty ordinary paragraphs and allow bold/emphasis; links, lists, HTML and arbitrary blocks remain unsupported. Media retains exact dataset, approved rights, dimensions, signature/type and 2 MB delivery checks. No caption conversion or document migration occurs.

Multiple projects, draft/version exclusion, slug collisions, static portfolio routes, listing and sitemap behavior are preserved. Only local test output receives the narrative/media extension; the static source pages are untouched.

## Verification

- Root content tests: **53/53 passed**, including synthetic JSON content round-trip, actual Astro narrative/SEO/media rendering, optional fallbacks and invalid required fields.
- Offline lifecycle builds: **0 → 1 → 2 → 1 → 0** projects; routes/listing/sitemap and stale media removal verified.
- Studio: **66/66 schema tests**, TypeScript, parser checks and isolated Studio build passed. Existing full schema validation remains covered.
- Query TypeScript and actual GROQ evaluation passed, including local narrative/media projection and draft/version exclusion.
- Default Astro build: **all 81 generated files match the recorded main baseline byte-for-byte**, with no additions/removals.
- Read-only Content Lake build succeeded with the published MCFLY and synthetic sample routes. MCFLY's latest manually published overview/title rendered successfully. No live editing lifecycle was repeated.
- Read-only Studio check confirmed all four editor groups and visible narrative fields. No extensive browser matrix.

No assistant document/asset writes were performed. MCFLY was manually edited and published during verification, so its revisions changed; those concurrent edits were preserved, not restored or automatically migrated. No dependencies, credentials, account settings, Netlify configuration, PR #7 or production content were changed. Existing untracked audit files retain their hashes.

## Populate MCFLY manually

1. Open localhost:3333 and confirm **ALD-118 — ISOLATED SYNTHETIC TEST**, then open the existing MCFLY project. Keep its stable `mcfly-industries` slug.
2. Save a personal copy of any prose still in Media → Project cover image → Public caption, and any prose already in Project Overview. Do not assume either is Markdown or Portable Text.
3. In Case Study Content → Case study narrative and SEO → Narrative, put a brief introductory paragraph in Project Overview. This is plain text; remove literal Markdown heading markers manually if present.
4. Add narrative items headed **The Challenge**, **My Contribution**, **Development Approach** and **Outcome**. Paste the appropriate prose into each rich-text body as ordinary paragraphs. Apply bold/emphasis using the toolbar; do not paste HTML or expect `##`/Markdown conversion. Use only accurate claims.
5. In Media, retain an image-specific caption (or clear it) only after confirming the prose is saved in the intended narrative fields. Add optional screenshots with alt/decorative choice and approved rights. Under the embedded object's SEO tab, optionally set SEO title, description and social image.
6. Review and publish manually, then rebuild from the repository root in the dedicated local terminal:

```powershell
$env:CONTENT_SOURCE='static'
$env:CONTENT_LOCAL_TEST='1'
$env:SANITY_PROJECT_ID='p9xrr86a'
$env:SANITY_DATASET='ald118-test'
npm run build -- --config astro.local.config.mjs
```

Refresh http://localhost:4323/work/mcfly-industries/ with the existing preview running. If needed, start it with `npm run preview -- --config astro.local.config.mjs --host localhost --port 4323`. Draft edits remain invisible until you publish. The build writes only ignored local output.

No code blocker remains for local narrative editing. Narrative section population and publication are manual account actions; this task grants no assistant content-write approval. Existing dependency advisories, unverified production permissions/rights, dormant full-site policy gate and ALD-109 deployment restrictions remain release blockers, as recorded in the consolidation report. No merge, deployment or public CMS activation is authorized.
