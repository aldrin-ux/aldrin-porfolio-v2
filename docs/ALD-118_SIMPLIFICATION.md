# ALD-118 simplification review

Reviewed 15 October 2026 against the latest Linear issue and fetched GitHub refs. **In Progress; offline proof only. No merge or deployment authorized.**

## Reuse and consolidation

| Source | Current state | Decision |
| --- | --- | --- |
| Main `88532ad` | Static Astro portfolio; nine public routes; no Studio/CMS | Preserve as rollback/default. ALD-109 production gate remains unresolved. |
| PR #8 `74df036` → main | Standalone local Studio, sign-in, independent dependencies | KEEP; no embedded Studio or root SDK needed. |
| PR #9 `c4bd47b` → main | Architecture/mapping/workflow documents only | KEEP field/URL mapping as reference; supersede ledger/release prerequisites for the local sample. |
| PR #10 `5f18174` → #8 | Six document schemas, project with embedded case study, basic validation | KEEP project fields and text/URL/slug/alt/reference checks. Avoid a replacement schema. |
| PR #11 `14fbe56` → #10 | Opt-in Astro adapter, dynamic routes, explicit published perspective, offline fixtures | KEEP retrieval/rendering, static mode and fail-on-invalid-content behavior. |

All four PRs remain open. This focused follow-up is based on #11 and adds test-only files and this report. Consolidate through a later reviewed integration branch based on main, retaining necessary #8 → #10 → #11 changes and the focused sample proof; do not merge the stack merely to test it. PR #9 needs no runtime merge. No code is removed now.

## Simplify / defer after dependency assessment

| Area | Shortest safe direction | Dependency / regression impact |
| --- | --- | --- |
| Approval requirements and editorial workflow | Owner publishes a synthetic sample after basic validation; no digest ledger | `validateSnapshot` and integration require a policy today. Replace together in a later scoped local mode; update policy rejection tests, retain draft exclusion and unsafe-content tests. Never install fixture auto-approval as live authority. |
| Media validation | One owner-approved synthetic image, alt text and dimensions; simple local delivery | Current normalizer requires card/study variants; integration hashes original and derivatives and only delivers local assets. Approve one image and bind it locally; defer upload pipeline, crop/hotspot and cryptographic verification. Do not relax CSP globally. |
| CMS configuration | One explicit approved non-production target shared by Studio and local reader | Studio guard, HTTP target and asset URL validator hardcode `p9xrr86a/production`. Changing environment variables alone cannot select an isolated dataset. No configuration changes performed. |
| Whole-site dependency | Start with project-only CMS data and retain static global pages/content | Current validator requires settings/profile/navigation, four page documents, experience, four legacy projects and matching selections. Normalizer consumes all of them. Scope a local project overlay using existing case-study rendering; a single sample document is insufficient today. |
| Unpublish | Build routes/listings/sitemap from eligible published projects; remove optional dangling selections | Current snapshot rejects stale home/work references. Offline removal updates both selections; it does not prove an unpublish click alone works. Retain errors for missing required global references. |
| Regression testing | Unit/integration tests, builds, route/content checks and static comparison | Keep existing useful tests for now. No new browser matrix; only rerun rendering checks when presentation changes. |

DEFER reusable client framework extraction, advanced page builders, approval ledgers, complex media verification, extensive browser testing, enterprise release governance, webhooks and live draft preview. Preserve current stable-route, security, noindex and production restrictions. Do not expand migration scope.

## Offline one-project proof

`tests/content/sample-project.mjs` supplies a fresh, clearly labeled synthetic project, not a cloned client narrative. An existing owner portrait is explicitly labeled as an offline placeholder, with synthetic approval flags that grant no real rights. Existing full-site fixtures provide the globals required by #11; no existing case-study record is edited. They are not a proposed dataset import.

The new lifecycle test builds the existing CMS renderer three times into the same ignored output directory:

1. Published fixture: `/work/sample-project/` appears on Home, Work and sitemap, with synthetic title and noindex.
2. Edited fixture: the next build shows the edited HTML title and H1, retaining the slug.
3. Unpublished fixture: sample and its selection references are absent; a fresh build removes the old HTML, listings and sitemap entry and restores the Work count.

Run `node --test tests/content/sample.test.mjs`. To leave the published sample available for local viewing in PowerShell:

```powershell
$env:CONTENT_SOURCE='sanity'
$env:CONTENT_INTEGRATION_TEST='1'
$env:CONTENT_SAMPLE_STAGE='published' # or edited / unpublished
$env:ASTRO_TELEMETRY_DISABLED='1'
$env:NODE_OPTIONS='--import ./tests/content/deny-network.mjs'
npm run build -- --config tests/content/astro.sample.config.mjs
npm run preview -- --config tests/content/astro.sample.config.mjs --host localhost
# Open http://localhost:4321/work/sample-project/
```

Use a dedicated terminal and close it afterward so fixture flags do not carry into normal commands. The config rejects Netlify and requires the explicit local test flag. The lifecycle test leaves the sample unpublished; rebuild with `published` to view it. Ordinary `npm run build` retains static output. No Studio editing, remote publication, live reads or account permissions are proven by these fixtures.

## Verification

- Existing content suite: 44/44 passed, including Astro static/CMS builds, invalid/live-gated rejection, metadata/contact checks and 81-file static restoration. New lifecycle test: 1/1 passed after correcting an HTML assertion to allow Astro's generated element attributes.
- Repository release validator passed; existing `https://example.com` warning remains. Actual GROQ parser/evaluator checks passed; drafts, versions and unknown types excluded.
- Studio TypeScript check, parser compatibility checks, 65/65 schema tests and Studio build passed. Local Node 24.14.0/Windows. Sandbox child-process restrictions required rerunning tests outside the sandbox; no account changes.
- No rendering/source/lockfile/hosting changes; full browser matrix omitted. Historical dependency findings from #8/#11 remain unresolved; no security remediation or re-audit claimed.

## Remaining steps and exact approvals

1. Review this PR and authorize a **local-only** project overlay plus an explicit shared non-production target. Keep production CMS blocked. This is the smallest implementation change needed before a real one-project test; do not implement a ledger or import the full portfolio.
2. Owner approves the Sanity project and isolated dataset name (suggested `ald118-test`), dataset creation/visibility, one synthetic sample write, publish/edit/unpublish, and one synthetic image upload or approved local image binding. None is authorized or executed here.
3. Owner/admin creates that dataset only after approval; verifies the user's edit/publish permissions and existing localhost access. Add only `http://localhost:3333` credentialed CORS if needed and separately approved; no wildcard origin, new members or public Studio. For a private dataset, separately approve a least-privilege read token held only in ignored local/server environment; no browser token or credential committed.
4. After reviewed configuration support, run `npm --prefix studio run dev` with the approved target and open `http://localhost:3333`. Create one project named **Synthetic sample project**, generate stable slug `sample-project`, fill required sample text/SEO/image/attribution fields and publish. Let Sanity generate the document ID. Any remaining profile reference must be satisfied by an explicitly approved synthetic profile or removed from the local sample dependency; do not import client content to satisfy it.
5. Run Astro locally against that approved published target, verify `/work/sample-project/`, edit title without regenerating slug, publish and rebuild. Unpublish and rebuild into clean output; check route, listings and sitemap removal. Stop on permission/configuration errors instead of switching to production.

No dataset/content/asset/account writes, live CMS activation, merge, production deploy, client edits, credentials, contact submissions or ALD-109 release changes occurred. Pre-existing untracked `audit/ald-106/` remains preserved. Actual account actions await explicit approval; ALD-118 stays In Progress.
