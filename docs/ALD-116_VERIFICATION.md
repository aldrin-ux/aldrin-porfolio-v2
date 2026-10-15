# ALD-116 — schemas and validation verification

15 October 2026. **In Progress pending ChatGPT audit.** Local implementation only: no CMS writes, schema deployment, hosted Studio publication, merge or production deployment.

## Stacked branch and authoritative context

Branch: `ald-116-sanity-schemas`, based directly on PR #8's verified head **`74df036407c8e19dd23970fb9f9c463369d158b5`**, base branch `ald-115-sanity-studio-setup`. This PR must be reviewed as a dependency of unmerged [PR #8](https://github.com/aldrin-ux/aldrin-porfolio-v2/pull/8), not merged directly to main ahead of it. PR #7 is excluded. No PR was merged or cherry-picked.

Read ALD-116's full execution instructions and comments (none at inspection), Studio source/security evidence from PR #8, actual Astro content, and [PR #9 architecture](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_CONTENT_ARCHITECTURE.md), [mapping](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_MIGRATION_MAPPING.md), [workflow](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_EDITORIAL_WORKFLOW.md) at **`c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64`**. These documents were reviewed read-only, not copied/merged into this branch. No applicable AGENTS.md found in the workspace/repository or inspected directory ancestors. Applied the Sanity best-practices skill.

Target remains `p9xrr86a` / `production`. The standard authentication, checked target helper, localhost-only startup and disabled automatic Studio updates from ALD-115 remain intact. No new dependencies or lockfile change. Root Astro dependencies/CI/hosting remain separate.

## Schema inventory: 28 registered types

| Kind | Types | Source / relationship |
| --- | --- | --- |
| Six documents | `siteSettings`, `portfolioProfile`, `project`, `professionalExperience`, `navigation`, `page` | [documents/models.ts](../studio/schemaTypes/documents/models.ts). Project owns card and embedded caseStudy, not a separate published article document. |
| Thirteen shared/portfolio objects | `usageRights`, `mediaUsage`, `link`, `seoMetadata`, `migrationMetadata`, `editorialReview`, `brand`, `capability`, `projectAttribution`, `narrativeSection`, `caseStudy`, `featureItem`, `toolItem` | [objects/models.ts](../studio/schemaTypes/objects/models.ts). `migration` is the documented field, typed `migrationMetadata`; `rights` is typed `usageRights`. These named helper types implement the documented object fields, not new content entities. |
| Eight bounded sections | `heroSection`, `textSection`, `featureListSection`, `ctaSection`, `projectCollectionSection`, `profileSection`, `experienceSection`, `toolsSection` | [objects/sections.ts](../studio/schemaTypes/objects/sections.ts). Shared semantic fields; no editor CSS, animation settings or general page builder. |
| One narrative array type | `portableText` | [blocks/portableText.ts](../studio/schemaTypes/blocks/portableText.ts). Ordinary paragraphs, bold/emphasis and link annotations only. |

[Registry](../studio/schemaTypes/index.ts), [field helpers](../studio/schemaTypes/fields.ts), [validation functions](../studio/schemaTypes/validation.ts). The tests assert exact ALD-114 field contracts for six documents and key shared objects, preventing silent field renames or invented generic replacements. Contribution/scope text remains canonical in attribution, with Context separately embedded. No metrics, testimonial, product-engineering, canonical-domain or credential fields were added.

## Validation implemented

| Constraint | Implementation and scope |
| --- | --- |
| Required fields | Required titles, plain descriptions, enums, references, nested objects and nonempty ordered collections. Reject whitespace-only text and HTML markup. Drafts can still be saved incomplete; errors guide standard Studio publishing. |
| Slugs | Lowercase words/single hyphens, no slash/space/traversal/Unicode or reserved index/new/preview/success. UI generator uses title initially; later title edits do not authorize route changes. |
| Slug uniqueness | Parameterized read-only GROQ under explicit raw perspective, CDN off, includes other drafts/published records, excludes self's draft/published pair and release-version records. Failure to read produces a validation error rather than a false uniqueness pass. Slug option and validation both check uniqueness. |
| Slug stability | Compare against existing published slug; preserve source legacyPath and original source keys for the four entries. Imported paths make slug read-only in UI. A reviewed rename/redirect path is future work, not a bypass flag in this schema. |
| Known project attribution | Dazlab and Sole Webflow developer required for the four known slugs; all projects constrained to marketingWebsite scope. Contribution/scope fields required; provisional entries need public notices. No per-project CMS/SEO claims generated from global responsibilities. |
| URLs and links | Full HTTPS, hostname and no embedded username/password; reject HTTP, script/data/protocol-relative/relative external URLs. Internal target + fragment exclusive with external URL; internal same-window and external new-window rules; duplicate nav labels/destinations rejected. |
| Images and media rights | Asset required. Informative alt required; explicit decorative status allows empty alt. Known review flags and crop presets. Unreviewed/restricted/rejected rights block ordinary Studio validation. Editable approved status alone does not prove permission. |
| References | Strong reference shape, no drafts/versions IDs or weak refs; required targets and duplicate-reference rejection. Built-in reference existence validation exercised with mocked availability. Published approval/type/graph integrity remains a future independent build check. |
| Experience | Integer four-digit start/end years, end ≥ start, only year precision. No inferred months/current-employment status. Optional projectYear remains separate and requires factual review; no project content was populated. |
| SEO | Required title/description; soft warnings at 60/160 characters, no truncation. IndexingRequest only inherit/noindex, cannot override code/environment launch restrictions. |
| Nested sections | Bounded per-route allowlist, required section families, one first home hero, stable home anchors and no duplicate anchors/keys/references. Required feature/tool/CTA content; textSection exactly one content mode; rich text excludes scripts, embeds, unknown annotations/marks and duplicate attribution section headings. |
| Singleton/editor aids | Three fixed IDs in Studio structure, omitted generic creation templates, no duplicate/delete UI actions for singleton types; all remain UI/validation aids, not account access control. |

Sanity field-level validation can replace a reusable type's validators. The shared field helper explicitly composes link/media/Portable Text invariants with required rules; negative tests cover these nested usages. No validation callback performs a mutation.

## Editor experience

[Studio navigation](../studio/structure.tsx): Site settings, Portfolio profile, Navigation, Website pages, Projects and case studies, Professional experience, Editing and review. Opening these panes was not automated against the production dataset; no documents were created for screenshots or UI verification.

Documents have Content and Review & source groups, Search & sharing where a top-level SEO field exists, readable titles/descriptions and list previews. Projects order by title; experience lists have most-recent-start ordering while actual website display order remains explicit references. Source provenance is optional, rights default unreviewed, verification status provisional; no facts or permission approval is prefilled. Reusable sections live within pages, not empty document lists. Generic icons use existing React, without a plugin/dependency.

## Automated validation evidence

Environment: Node **24.14.0**, npm **11.12.0**, installed Sanity **6.19.0**. Studio still supports the existing Node ≥22.12 baseline; offline test command explicitly enables Node's TypeScript stripping for that baseline. Only Node 24 was executed here; no claim of a second Node-version test.

| Check | Result |
| --- | --- |
| `npm --prefix studio test` | **65 tests passed**, plus retained framework-parser compatibility test. Includes positive and negative cases for schema registration/contracts, all four actual contribution narratives with synthetic media, all fixed page templates, required/nested fields, slugs, duplicates, published/source stability, failing queries, alt/rights, URLs, reference failures, years, navigation and Portable Text. |
| `npm --prefix studio run check` | Passed against installed Sanity TypeScript APIs. |
| `npm --prefix studio run build` | Passed; only public project ID/dataset exposed; ignored local output only. |
| `npm --prefix studio run schema:extract` | Passed using local CLI and enforced required fields; ignored `.sanity/schema.json`, no schema deployment. |
| `npm --prefix studio run typegen` | Passed via supported `sanity.cli.ts` configuration: **45 generated schema types including built-ins, 0 queries**. Ignored `.sanity/types.generated.ts`; no Content Lake query. |
| Astro `npm run build` | Passed, 10 static HTML pages including 404, plus sitemap. |
| Astro `npm run check` / `npm test` | Passed. Existing example.com canonical warning retained; root test aliases its release validator. |
| Public-output parity | **81/81 generated files SHA-256 identical** to previously verified main `88532ad18215c064a14e2824ec9f90b0e513d482`; no added/removed files. Includes all nine public routes, contact form artifact, optimized assets/fonts, animation, SEO/JSON-LD, noindex and robots/sitemap. See [regression evidence](ald-116/regression-evidence.json). |
| Scope / preservation | No public source/assets/root dependency/config/workflow changes. Studio lockfile unchanged. Existing untracked ALD-106 screenshots preserved and excluded. |
| Secrets | No API tokens, passwords, permission proof or credentials created/read/staged. Only public project/dataset values inherited; generated schema/types/output ignored. |

Tests use Sanity's own compiled schema/built-in types and public Studio validation wrapper with `environment: studio`; rules are not reimplemented in a fake Rule recorder. Only client reads/reference availability are mocked. GROQ queries are actually parsed/evaluated against in-memory fixtures. Mocks cannot verify real visibility, grants, race-free uniqueness, published reference state or account access. Test media approved statuses and synthetic IDs are fixture data only, not rights evidence or import payloads. They are never sent to the dataset.

Installed `@sanity/validation`'s separate schema/client CLI-mode API was observed to downgrade object checks to warning-level through its unknown-field validator. The tests deliberately exercise Studio behavior, including error-level assertions. A future build validator must not rely solely on CLI exit status or assume all warning markers are harmless: use explicit hard-rule enforcement, pinned-version tests and protected release checks. Locale fallback is supplied by the installed validation package's internal test helper, a version-coupled test seam to recheck on dependency upgrades.

No fresh browser, authentication, Lighthouse or production smoke test was required/claimed for this local schema change; the public website remains byte-identical. No contact form submission.

## Limits and future enforcement

- [Sanity schema rules](https://www.sanity.io/docs/studio/validation) run in Studio, not on arbitrary Content Lake API mutations. They do not enforce private previews, role separation, rights evidence or external revision approvals. Studio UI action/template restrictions are not authorization.
- Uniqueness reads are not atomic reservations; concurrent editors/API clients can race. ALD-117/118 build/migration must independently verify the full published snapshot, unique slugs/source keys, expected routes, typed and approved references, exact ordering/anchors, bounds and missing globals. ALD-119 must bind protected approvals to the promoted revision/snapshot and enforce roles/preview access.
- Page-family/anchor rules implement documented structural requirements without inventing layout-slot fields. Exact template slot counts/order, one rendered h1, existing fragment existence on target pages, and consistent profile/experience selections require future rendering/build validation. Rich-text link annotations are validated structurally; route resolution also belongs in the build.
- Existing slug/source-key locks are standard validation, not protection from an authorized administrator or arbitrary API writes. Redirect exceptions must be explicitly designed/reviewed; no redirect or route code here.
- Approval truth cannot be inferred from a media status or profile text. Do not store sensitive proof in a potentially public dataset. No known rights issue was resolved by these schemas. No actual Content Lake permission/read-write check was performed.
- Draft preview host, protected approval ledger, event/build release gates, takedown SLA, image ingestion/CSP policy and reproducible rollback remain ALD-117–119 decisions. No hooks/tokens/projections/assets uploaded or publication configured.

## Retained security blockers

PR #8's [security review](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/74df036407c8e19dd23970fb9f9c463369d158b5/docs/ALD-115_SECURITY_REVIEW.md) remains applicable: **16 Studio affected dependency entries (7 high, 9 moderate)** from braces/sprintf-js/uuid; **3 pre-existing Astro entries (1 critical, 1 high, 1 low)**. No dependency version/override/lockfile changes; ALD-116 does not remediate or dismiss those findings.

**Pending manual verification:** actual Sanity plan, membership/roles and least-privileged edit/publish separation, dataset visibility, credentialed reads/writes, exact localhost CORS credential policy, token inventory/scope/rotation. Prior user-confirmed successful Studio sign-in/four setup areas is retained as historical evidence only. No repeat sign-in, credentials or browser interaction requested.

ALD-109's production gate remains independent. Keep ALD-116 **In Progress** pending audit; PR #8 dependency, advisory remediation, fact/rights review and manual account checks remain open. No merge or deployment approval is implied.
