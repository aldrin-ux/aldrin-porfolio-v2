# ALD-118 — isolated Sanity editing test

Status: **In Progress; PR #12 remains draft.** Updated 15 October 2026. Latest Linear authorization and the original PR #12 simplification report were read before implementation. No merge or production deployment.

## Implemented

- Standalone Studio accepts only project `p9xrr86a` with `production` or explicitly selected `ald118-test`. Existing saved production configuration is unchanged. The test Studio is labeled **ALD-118 — ISOLATED SYNTHETIC TEST** and exposes only the existing project title, slug, summary and media fields; production schemas remain unchanged.
- `astro.local.config.mjs` is an explicit local build configuration. It requires `CONTENT_LOCAL_TEST=1`, static overlay mode and exactly `p9xrr86a/ald118-test`; hosting/CI and production targets are rejected. Ordinary builds remain static.
- Reuses existing case-study rendering and project cards. Static globals and four portfolio projects remain in source; no full-site Sanity snapshot or client import is needed. Work listing and sitemap include only the currently published sample.
- Uses the installed Studio CLI's existing authenticated session server-side, without creating a token or putting credentials into browser data. Fetches with explicit `published` perspective, excludes drafts/versions, and does not fall back on query failure.
- Supports one synthetic PNG asset with alt text, rights flag, dimensions and an exact test-dataset URL boundary. Downloads it only for local output; no public asset/CSP changes, ledger, framework extraction or general image pipeline.

## Actual live operations

These were **real Content Lake operations through the authenticated CLI/client**, not offline fixtures or Studio button interactions:

| Operation | Result |
| --- | --- |
| Target/access check | Existing CLI login could list project datasets; only production initially existed. All write clients explicitly verified `p9xrr86a/ald118-test`. |
| Create dataset | User separately approved initial private visibility in chat. Created `ald118-test` with `aclMode: private`; no fallback to public. No existing visibility, roles, tokens or CORS changed. |
| Create media | Uploaded one original, locally generated 640×400 synthetic green PNG. No client image or existing asset modified. |
| Create/publish sample | Created one published synthetic project; Sanity generated ID `Ipn4L1Z0ARS4KqooNLzbaX`, slug `sample-project`. Initial create and publish were one API operation. |
| Local published build | `/work/sample-project/`, Work listing and sitemap appeared. HTML title/H1, noindex and sample image checked; browser displayed the project. |
| Draft edit | Changed title to **Synthetic sample project — edited** in a draft. A fresh published-only build retained the original title and excluded the draft title. |
| Republish | Published the edited draft with its revision precondition. Next build and browser showed the edited title/H1 at the same URL. |
| Unpublish | Used Sanity's unpublish action on this sample only. Next clean build removed its route, listing, sitemap entry and copied image; browser showed 404. |
| Final state | Zero published projects; one synthetic draft plus its PNG asset remain in the test dataset. Sanity-managed system records were left untouched. Anonymous raw project query returned an empty array (HTTP 200); authenticated raw query sees the one draft. |

Synthetic asset: `image-9f907712663df782486ce1c1b7239d835be4ba44-640x400-png`. No writes were issued to production. Local lifecycle helper files and content caches are ignored under `.cache/ald-118/`; no credentials are stored in them or committed.

## Studio UI verification

Local Studio started at **http://localhost:3333**. Existing CORS already permits that origin with credentials; no CORS change was needed. The prior local Studio process from this repository was restarted with process-scoped test dataset variables, leaving saved env files unchanged. Its isolated title and login screen were verified.

After the user signed in directly, the existing synthetic draft was opened in the isolated Studio. Through the actual UI, its title was reset to **Synthetic sample project** and published; the next Astro build showed it. The title was then edited to **Synthetic sample project — Studio edited** and republished; the next build and browser showed that exact title/H1. Studio's Published view → Unpublish → Unpublish now removed the published version. The next build removed the route, listing, sitemap entry and PNG; browser showed 404. Initial creation/media upload used the CLI, then the same single document completed the UI editing lifecycle. No second project was created. **No remaining blocker or manual action is required for this test.**

## Local commands

Use a dedicated PowerShell terminal. For Studio, set `SANITY_STUDIO_PROJECT_ID=p9xrr86a` and `SANITY_STUDIO_DATASET=ald118-test`, then run `npm --prefix studio run dev`. The existing isolated Studio is already running on port 3333.

For actual published-content Astro builds (requires the existing local CLI login and installed Studio dependencies):

```powershell
$env:CONTENT_SOURCE='static'
$env:CONTENT_LOCAL_TEST='1'
$env:SANITY_PROJECT_ID='p9xrr86a'
$env:SANITY_DATASET='ald118-test'
npm run build -- --config astro.local.config.mjs
npm run preview -- --config astro.local.config.mjs --host localhost --port 4323
```

Open http://localhost:4323/work/sample-project/ when published. It currently returns 404 because the sample was intentionally unpublished. Close the dedicated terminal afterward so test flags do not carry into normal commands. Default `npm run build` uses static source.

## Verification and future scope

- **48/48 content tests**, release validator, Astro static/offline/live builds, **65/65 existing Studio schema tests**, parser checks, Studio TypeScript and isolated Studio build passed. Local Node 24.14.0/Windows. No extensive browser matrix.
- **81/81 default static output hashes match the recorded verified main `88532ad` baseline.** The local injected route changes shared stylesheet bundle links, so byte parity is not claimed for local overlay HTML. Original pages match static HTML after normalizing stylesheet links; route/content/form preservation was checked. Initial strict overlay hash assertion exposed that bundle-link difference and was corrected to distinguish it from default static parity.
- Actual live draft exclusion, edited title and unpublish removal passed. Scanned all 17 generated text files after unpublish: no CLI credential or unpublished sample title. Local media loaded; remaining related-work images were lazy and were not part of an extensive image/browser audit.
- Existing placeholder-domain warning and historical dependency findings remain. No remediation/security re-audit claimed.
- KEEP Studio/project schema, routes/rendering, published-only retrieval, basic validation and static rollback. SIMPLIFY the local workflow as above. DEFER page builders, reusable client frameworks, approval ledgers, complex media verification, browser matrices and enterprise release governance.
- Future production CMS adoption needs separate approval, production schema/content/media review and a separately reviewed hosting/release path. This test configuration cannot target production and does not unblock ALD-109.

No Netlify settings, account permissions, token inventory, existing dataset visibility or CORS changes; no client import, contact submission, merge or production deploy. Pre-existing untracked `audit/ald-106/` is preserved. Studio sign-in and the UI editing lifecycle are now verified; no test blocker remains.

