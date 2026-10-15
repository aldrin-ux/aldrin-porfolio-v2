# Astro + Sanity consolidation — ALD-118

15 October 2026. **Review-only; ALD-118 In Progress.** Read latest ALD-114–118 and ALD-109 before changes. Branch `ald-118-cms-consolidation` starts at fetched current main `88532ad18215c064a14e2824ec9f90b0e513d482`. No PR was merged or closed.

## Branch audit and included changes

| PR | Verified head | Actual base/dependency | Integration decision |
| --- | --- | --- | --- |
| #8 Studio | `74df036` | main `88532ad` | Include standalone Studio, independent lockfile, environment guards, reviewed parser overrides and ignore rules. |
| #9 architecture | `c4bd47b` | main `88532ad`; documentation only | Carry essential content/URL/reference rules into current setup guide; link pinned detailed mapping. No runtime dependency. |
| #10 schemas | `5f18174` | #8 head; two schema commits | Include project/embedded case study, year-only experience, remaining existing document/object schemas, validators, tests and TypeGen configuration. |
| #11 integration | `14fbe56` | #10 head | Include published-only adapter, dynamic routes, typed contracts, static/CMS entry points and offline tests. Keep the existing public policy gate; add no ledger. |
| #12 accepted sample | `da76c4d` | #11 head; three follow-up commits | Include local isolated configuration, small test schema view, media support, lifecycle tests and accepted live-proof report. |
| #7 portfolio polish | `188533b` | main `88532ad`; independent | Exclude completely and preserve its branch/PR. Hero/About changes and its audit assets are unrelated to this consolidation. |

Ancestry is **main → #8 → #10 → #11 → #12**; #9 and #7 are independent branches. GitHub reported all existing PRs mergeable against their current bases. Non-mutating `git merge-tree` checks for main + #12 and #12 + #7 produced clean trees. No missing runtime commits, textual conflicts or broad conflict resolution were found.

Instead of merging stacked history, the new branch contains the necessary final files from #12 as a single reviewable change based on main. Runtime code, tests, package/config files and Studio lockfile match #12 exactly; only a schema README is corrected. Original PRs retain their history and evidence.

## Exclusions, duplication and obsolete documentation

- Exclude old ALD-115/116/117 verification reports, audit JSON archives and screenshots; their evidence remains in the original PRs. Keep the 81-file hash baseline and the accepted ALD-118 real-test report because they support this review directly.
- Replace obsolete setup claims (“no Astro adapter,” empty Studio, production-only target, no sample writes) with [current setup](SANITY_SETUP.md). Correct the schema README's obsolete “no documents created” statement and missing report link.
- Do not copy PR #9's entire proposed editorial/release workflow or introduce reusable framework extraction, generalized page builders, approval ledgers or advanced media verification. Its essential model boundaries and migration/slug rules are retained in the setup guide; detailed [mapping remains pinned](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_MIGRATION_MAPPING.md).
- Existing static/CMS templates intentionally duplicate presentation to preserve static output. The local project reader is intentionally narrower than the dormant full-site snapshot adapter. Both were assessed and retained; removing either would change tested dependencies and behavior.
- PR #7 is currently textually compatible, but its static hero/About changes would require corresponding CMS-template review before later CMS activation. A clean Git merge is not proof of visual parity. No #7 content is applied here.

## Verification on the consolidated branch

| Check | Result |
| --- | --- |
| Astro build and release validator | Passed; existing placeholder `https://example.com` warning retained. |
| Content tests | 48/48 passed: static/CMS fixture builds, invalid content, draft/version rejection, fifth project, synthetic title edit/unpublish, local target restrictions and static restoration. |
| Studio TypeScript, parser checks, schema tests and build | Passed; 65/65 schema tests. Local Node 24.14.0/Windows. |
| Query type contract and actual GROQ parser/evaluator | Passed; all three full-site projections validate, drafts/versions/unknown types excluded. |
| Default static comparison | **81/81 generated files exactly match** recorded main `88532ad`; no added/removed files or justified differences needed. Nine public routes intact; sample absent by default. |
| Basic route/content checks | Existing tests generate the optional fifth route and remove the synthetic sample route/listing/sitemap on unpublish. No fresh live editing test or browser matrix. |
| Source/configuration checks | No diff from main to static content/image manifests, public assets, Netlify config, root lockfile or PR #7's home/About source. Only existing offline-test CI step is carried over; workflow triggers/permissions unchanged. |
| Secrets and preservation | High-confidence credential-pattern scan of candidate files found no matches; existing sentinel/non-exposure tests passed. Env, CLI auth, caches and build output remain ignored. Both pre-existing untracked audit files retain exact hashes. This is not a full historical credential audit. |

Compact evidence: [checks.json](consolidation/checks.json). The earlier real Studio/Content Lake proof is retained in [ALD-118 report](ALD-118_SIMPLIFICATION.md); it is historical accepted evidence, not rerun or newly claimed here. No Sanity content/account reads or writes were needed for consolidation.

## Security and deployment blockers

Fresh read-only `npm audit --json` checks confirmed the existing findings; no dependency updates or forced fixes:

- Root: **3 affected entries** — critical Astro, high Sharp, low esbuild. npm proposes an Astro major upgrade; separate remediation and regression review are needed.
- Studio: **16 affected entries** — 7 high, 9 moderate, zero critical. Three root advisory families remain: braces, sprintf-js and nested uuid. Most entries are propagated parents; do not equate 16 entries with 16 independent exploits. Retain reviewed YAML/TOML parser overrides and their actual-caller tests. npm's proposed major Sanity downgrade is not applied. [Prior detailed exposure review](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/74df036407c8e19dd23970fb9f9c463369d158b5/docs/ALD-115_SECURITY_REVIEW.md) remains supporting context, not a new reachability assessment.
- Production roles/membership, visibility, least-privileged access, token inventory and private-preview policy remain unverified for release. The accepted isolated dataset test does not certify production access or client media rights.
- Full-site CMS mode remains deliberately blocked by missing publication/media policy and unmigrated full-site content. Local sample mode needs neither a ledger nor a production import. No new policy architecture is introduced; production simplification/activation needs its own reviewed scope.
- ALD-109's production deployment gate remains open. Main is connected to automatic production delivery; merging this draft would require separate explicit approval and resolution of that gate. No merge/deploy/Netlify changes are performed here. Placeholder-domain/noindex and existing contact/security behavior remain intact.

These block release/activation, not preparation of this draft review.

## Recommended merge and supersession order

1. Audit this main-targeted integration PR and resolve or explicitly disposition security/account/release blockers. Do not merge while the ALD-109 gate or merge/deployment approval remains open.
2. If later expressly approved, merge **only the consolidated PR**; #8 → #10 → #11 → #12 do not also need separate merges. If the consolidation is rejected instead, the original dependency order remains #8, #10, #11, #12; #9 is documentation-only and independent.
3. After the approved integration lands, obtain approval to close #8/#10/#11/#12 as superseded. #9 can close as superseded only if the owner accepts the current essential documentation plus preserved detailed mapping. Do not close anything now.
4. Keep #7 independent for its own review and approval. Recheck main, hashes and static/CMS template consistency when that work is eventually integrated; no merge order here authorizes it.

No production deployment, public CMS activation, dataset/content/asset/account changes, client import, credentials, permission changes or contact submissions. Existing branches/PRs and untracked files are preserved.
