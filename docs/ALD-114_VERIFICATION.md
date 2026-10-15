# ALD-114 verification — architecture and migration mapping

15 October 2026 (UTC+8). Status: **In Progress, pending ChatGPT audit**. Documentation only; no Sanity schemas, data writes or integration implemented.

## Baseline and isolation

- Repository: `aldrin-ux/aldrin-porfolio-v2`.
- Branch: `ald-114-sanity-content-architecture`, created directly from fetched/verified `origin/main` at **`88532ad18215c064a14e2824ec9f90b0e513d482`**.
- PR #7 remained OPEN at `188533bb8a7327ec431c8ebb1e7dffcf7ef264ea`; PR #8 remained OPEN at `74df036407c8e19dd23970fb9f9c463369d158b5`. Neither merged/cherry-picked or modified. PR #8 was inspected read-only for its standalone Studio and security evidence; no Studio file is tracked on this branch.
- Preserved the two pre-existing untracked `audit/ald-106/` screenshots. Switching away from PR #8 leaves local Studio environment/cache/dependency residue appearing as untracked `studio/`; preserve it, do not stage/delete/read credentials. No Studio startup, sign-in or browser interaction requested.
- No AGENTS.md found in the repository/workspace search or applicable directory ancestors. Applied Sanity best-practices schema/Astro guidance and migration general guidance. Where their ID defaults differ, use generated ordinary IDs with a unique source-key/returned-ID manifest; explicit singleton IDs only.
- Read ALD-114 description/latest execution instructions (no comments at inspection), ALD-115 context/latest comments, PR #8, and existing launch/release/ALD-101 documentation. Older launch documents contain historical state; actual current source/Git take precedence.

## Deliverables

| Document | Contents |
| --- | --- |
| [SANITY_CONTENT_ARCHITECTURE.md](SANITY_CONTENT_ARCHITECTURE.md) | Core versus portfolio models, field requirements/types/validation/references, draft/publication rules, semantic sections, facts/rights/security decisions. |
| [SANITY_MIGRATION_MAPPING.md](SANITY_MIGRATION_MAPPING.md) | 198 source scalar rows, 49 inline mapping rows, nine logical tools, route/SEO/JSON-LD/asset tables and 44 derived image-field rows. Source paths/current values or exact safe references, targets, transformations, risks and validation. |
| [SANITY_EDITORIAL_WORKFLOW.md](SANITY_EDITORIAL_WORKFLOW.md) | Draft/review/publish/static build, published-only snapshot, dynamic case routing/fifth project, unpublish/delete-aware builds, slug redirects, protected preview, failure/rollback and future trigger safeguards. |
| This verification document | Source inventory, commands, scope/parity evidence and outstanding gates. |

## Source inspection and acceptance results

| Requirement | Evidence / result |
| --- | --- |
| Actual content inspection | Read `src/content/site.ts`, all four work route wrappers and shared layout, homepage/About/Work/Contact/success/404, header/footer/cards/timeline/workflow/tools/section/form components, image manifest/generator, layout SEO/JSON-LD, sitemap, robots, fonts/assets inventory, Astro/Netlify/CI config and release validator. |
| Confirmed counts | Four cards + four caseStudy objects (one project identity each); seven experience rows; four services; five workflow steps; five primary nav items; nine tools; four primary pages; nine ordinary public routes plus 404/sitemap. Initial proposal: 18 content documents excluding assets/embedded objects. |
| Exact route invariants | `/work/dazlab/`, `/work/mortar/`, `/work/handl/`, `/work/tangilla/` retained. Alias `caseStudy` does not create duplicate Dazlab. Future fifth project uses one static `[slug].astro`, not another manual wrapper. |
| Attribution/facts | All four remain marketing websites developed under Dazlab with Aldrin's Webflow contribution. Context, contribution and scope/credit paragraphs retained; no SaaS product ownership, invented project years, employment months, metrics, testimonials or permission claims. |
| Media safeguards | Screenshot metrics/testimonials/dashboard/third-party logo/portrait concerns carried from ALD-101; current static assets remain untouched. Unknown rights block new CMS publication/cutover by default; an exception would need separate explicit review. |
| Schema/content implementation | None. Models, fields, future query/build pseudocode and workflows are proposals in Markdown only. No schema registration, document creation/import, permission/CORS/visibility/token/webhook changes. |
| Draft handling | Explicit published perspective for public builds; authenticated draft preview required. Single snapshot contract prevents listing/detail drift; no raw draft data in public preview artifacts. Future unpublish removes generated route/list/related/sitemap on next successful deploy, with stale-site caveat documented. |
| Publishing authority | Roles/backend enforcement and protected revision approval proposed; Studio UI restrictions alone are not security. No unauthorized publishing or production action taken. |

## Local validation

Environment: Windows PowerShell, Node **24.14.0**, npm **11.12.0**. Existing root hosting/CI Node 20 unchanged. No dependency install/update needed for documentation.

| Check | Result |
| --- | --- |
| `npm run build` | Passed: static build, 10 HTML pages including 404, plus sitemap; about portrait cache reused. |
| `npm run check` | Passed. Existing warning: canonical domain remains placeholder `https://example.com`. |
| `npm test` | Passed. It aliases `npm run check`, not an independent browser or CMS integration test. |
| Generated output | SHA-256 comparison of all **81 files** against both captured pre-change output and the previously verified main baseline: no changed, added or removed files. |
| Protected source | No diff to `src/`, `public/`, scripts, root package/lockfile, Astro/Netlify/GitHub config or `.gitignore`. Public routes, content, metadata/JSON-LD, fonts, optimized media, animations, contact handling, noindex and security policy unchanged. |
| Documentation integrity | 198 export leaf paths and 44 image derivative paths covered; paired title/URL/slug assertions match actual source; relative file links checked; only four requested Markdown files staged. |
| User-file preservation | Both untracked ALD-106 screenshot hashes unchanged. Local untracked Studio residue preserved and excluded. |
| Credential review | New files contain public project/dataset identifiers and policy examples only; no tokens, passwords, private keys, credentials or local environment contents included. No account/browser credential-store access. |
| Diff hygiene | Documentation-only diff and whitespace check passed. No generated output or audit screenshots staged. |

These checks prove this PR preserves the existing website output; they do not prove future Sanity implementation, rights approval, account permissions or live production deployment. No new browser/Lighthouse or contact form test was run for unchanged output.

## Open decisions and remaining gates

1. Review proposed one-project/embedded-caseStudy model, four bounded page templates, generated-ID/source-key migration manifest and local image-delivery preference before ALD-116/117 implementation.
2. Media permission evidence and per-project details remain incomplete. Publicly visible screenshots are not licensed by inference. Keep public provisional notices; do not import/publish confidential proof or unreviewed sensitive imagery.
3. **Pending manual verification:** Sanity membership/least-privileged edit/publish separation, actual plan/roles, dataset visibility, credentialed Content Lake reads/writes, localhost CORS credentials policy, token inventory/scope/rotation. Previous successful Studio sign-in/four-area access is user-confirmed evidence only. No further interaction requested while user operates remotely.
4. Choose protected approval ledger, authenticated draft preview host, private read credential handling if needed, staged release trigger, snapshot/rollback retention and urgent takedown policy under separately approved ALD-119 work.
5. ALD-115 Studio security follow-up remains at **16 affected entries (7 high, 9 moderate)**, deduplicated to braces/sprintf-js/uuid advisory families. Existing independent Astro tree has **3 affected entries (1 critical, 1 high, 1 low)**. Follow [PR #8 security review](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/74df036407c8e19dd23970fb9f9c463369d158b5/docs/ALD-115_SECURITY_REVIEW.md); no remediation or dependency files are changed in ALD-114.
6. ALD-109 production deployment gate remains independent/unresolved. No production verification, merge, manual deploy, hosted Studio publication, launch, DNS/domain/canonical/noindex change, webhook or contact submission under this task.

ALD-114 remains **In Progress pending ChatGPT audit**. PR commit/URL and remote check results are recorded in the PR and Linear after creation; documentation does not claim merge/deployment approval.
