# ALD-117 — Astro and Sanity content integration

Review implementation only. Default public output remains static. Live CMS rendering is deliberately blocked until protected publication and media approval are implemented and separately authorized.

## Authoritative sources and dependency

This branch starts at PR #10 `5f181742dc7a31fae8e0c67b7d13cbddadae9deb` on `ald-116-sanity-schemas`, stacked on unmerged PR #8. PR #9 was read without merging or cherry-picking: [architecture](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_CONTENT_ARCHITECTURE.md), [migration mapping](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_MIGRATION_MAPPING.md), [editorial workflow](https://github.com/aldrin-ux/aldrin-porfolio-v2/blob/c4bd47b60c1956f2eb77f9f68a032d6c7a0c9d64/docs/SANITY_EDITORIAL_WORKFLOW.md). Actual PR #10 schema fields govern the adapter; independent field-coverage tests compare against its TypeGen declarations.

No architecture documents, Studio code, dependency versions, public content, public assets, Netlify settings or PR #7 work are merged or changed here.

## Boundaries

| Layer | Location | Responsibility |
| --- | --- | --- |
| Contract and query result types | `src/lib/sanity/model.mjs`, `schema.types.d.ts`, `types.d.ts` | Six document types, eight embedded section types, shared objects and PR #10 generated schema declarations. Queries carry expected result types; network responses remain untrusted until runtime validation. No Studio runtime import. |
| Query projections | `src/lib/sanity/queries.mjs` | Explicit allowlist generated from the verified contract, including embedded case studies, media metadata, strong references and restricted Portable Text. No arbitrary spreads, private evidence or whole asset metadata. |
| Retrieval | `src/lib/sanity/retrieve.mjs` | Published document snapshot, referenced image assets, then a second ID/revision manifest. Reject a changing document snapshot, HTTP/network/JSON failures and missing target configuration. |
| Independent validation | `src/lib/sanity/validate.mjs` | Whole-snapshot structural, reference, URL, route, attribution, media and template checks, followed by protected document and asset approval. No reliance on Studio validation success. |
| Normalization | `src/lib/sanity/normalize.mjs` | Public presentation data only: cards, case studies, year ranges, navigation, SEO, fixed page slots and escaped Portable Text. Review/source metadata does not enter the view. |
| Astro integration | `src/lib/sanity/integration.mjs` | Validate once before rendering, verify local source asset bytes and approved variants, create a nonce-bound ignored build snapshot shared by render workers. |
| Source boundary | `src/content/resolved.ts` | Server/frontmatter-only selection; static never reads a CMS cache or requires credentials. Missing/stale CMS snapshot fails, never falls back. |
| Presentation and routes | `src/cms/pages/`, `src/cms/components/` | CMS-specific page entry templates behind an alternate Astro `srcDir`; shared approved components/styles. One `work/[slug].astro` generates every validated project route. |

The static entry templates remain untouched. Separate CMS entry templates are intentional: changing the original page modules or replacing four static case routes can change compiled CSS identifiers and output hashes even with identical text. This preserves all 81 static files exactly. Shared header/footer, experience/workflow and card components accept normalized data while retaining identical static defaults. Hero script/style blocks and responsive rules are retained; raw Portable Text paragraphs receive explicitly scoped parent styling. Future layout changes must update both entry-template sets and repeat parity/visual tests.

Native build-only HTTP avoids introducing a root SDK dependency or coupling Node 20 root CI to Node >=22.12 Studio. There is no browser Sanity client, visual editing, draft preview, stega, webhook or SSR runtime. A future approved adapter can replace retrieval without changing presentation contracts.

## Feature flag and environment

| Variable | Behavior |
| --- | --- |
| `CONTENT_SOURCE` | Server/build-only. Unset means `static`; only `static` and `sanity` accepted. Unknown values stop the build. Never use a `PUBLIC_` credential/config variable. |
| `SANITY_PROJECT_ID` | Future live read target must be exactly `p9xrr86a`. Not needed in static or offline-fixture mode. |
| `SANITY_DATASET` | Future live read target must be exactly `production`. Not needed in static or offline-fixture mode. |
| `SANITY_READ_TOKEN` | Optional existing read credential supplied through a future approved build environment if dataset access requires it. Never create a token for this work, commit it, expose it to the browser or place it in URL/query data. No token was accessed here. |
| `CONTENT_INTEGRATION_TEST=1` | Explicit local fixture-runner guard only. Public Astro config does not read fixture input or install a fixture policy. Fixture builds refuse a Netlify environment. |
| `CONTENT_BUILD_ID`, `CONTENT_BUILD_CACHE` | Internal integration values, freshly generated and injected only into server rendering. Ignored `.cache/ald-117` snapshots must be treated as local build data, not published assets. Not user release switches. |

**Live `CONTENT_SOURCE=sanity` currently stops before any network request**, because the public config installs no approval provider. Setting credentials or an editable `editorialReview.state`/`rights.status` cannot bypass that gate. Static mode does not contact Sanity, even if an irrelevant token variable exists. Do not configure CMS mode on Netlify.

## Published query strategy

API version `2026-10-01`, fixed uncached `p9xrr86a.api.sanity.io` host, `/data/query/production`, explicit `perspective=published`, plus query-level exclusion of `drafts.**` and `versions.**`. Parameterized POST requests go only to the **read-only query endpoint**, not mutations; this avoids GET URL limits as asset IDs grow. Each request has a 15-second timeout, no redirects, no caching and redacted error text. No request was sent to Content Lake during implementation.

See Sanity's [Query API](https://www.sanity.io/docs/http-reference/query) and [published perspective](https://www.sanity.io/docs/content-lake/perspectives). The local GROQ parser/evaluator test executes the actual projections, including null optional fields, against fixture records containing drafts, versions and an unknown private type. A second manifest protects against document revision changes during retrieval; it is not a transactional Content Lake snapshot. Future asset approval must bind the exact asset revision, source and derivatives as well as usage and document revision; builds remain blocked until that policy exists.

## Validation and publication interfaces

`validateSnapshot(snapshot, policy)` rejects unknown fields/types, invalid IDs/revisions/timestamps, duplicate/missing singletons/pages/projects, changed retained slugs, reserved/traversal slugs, duplicate source keys, malformed years, incorrect or unpublished/weak references, broken anchors, duplicate navigation, unsafe URLs, missing SEO, unsupported text/embeds, incomplete/nested sections and unexpected template ordering.

The four retained projects require Dazlab delivery credit, the sole Webflow developer role, marketing-website scope, their source mapping and stable trailing-slash routes. Contribution and scope narratives come from the embedded attribution object; duplicated attribution headings are rejected. Provisional entries require public notices. SEO length remains an editorial warning in Studio, not a truncation or new build error. The website still controls canonical URLs and launch noindex; CMS cannot opt into indexing around those controls.

Fixed pages require the documented section composition, stable homepage anchors, consistent explicit project/experience ordering and content fitting the approved slots. Home/work selections cover all published projects in the same order. All four existing project routes are required; an additional approved fifth project generates its own route and sitemap entry without a new template. Removing that optional published project removes its route on the next successful build; no stale static fallback occurs. Existing route removal/renaming requires a separate redirect review.

The injected `PublicationPolicy` contract contains:

- `assertDocument(id, revision, digest)` — trusted approval of that exact projected document revision and SHA-256 digest.
- `resolveMedia({usage, path, asset})` — trusted approval of that usage/asset and a local delivery binding with source file SHA-256, original/public path, dimensions and optimized variants.

The test provider authorizes only its separately supplied synthetic revision/digest manifest. It is never installed by public config. Production needs an independently approved, protected revision ledger and media evidence store outside editable public content. Checklist values are prerequisites, not authority, access control, legal clearance or editorial enforcement.

## Image eligibility and current limitations

Informative images require alt text; media rights must be `approved` and then separately authorized by the policy. All media references must resolve to the approved project/dataset, with dimensions. Original bytes must match the trusted local binding. Project cards, full case screenshots and hero portrait require their proper optimized variants and presentation intent. Referenced public variants must exist within `/assets/optimized/`; the About portrait is restricted to the existing imported source. No remote image delivery, fetch, CSP relaxation or static-asset rewrite is introduced.

Current support deliberately covers existing reviewed local delivery only. New uploads need a separately reviewed ingestion/derivative pipeline and an immutable source/variant manifest. Required credit lines, captions, crop or hotspot overrides currently **fail closed** until their presentation/derivative treatment is reviewed; they are never silently dropped. Policy must establish actual reuse rights and sensitivity review, including testimonials, metrics, dashboards and third-party logos. Public availability is not permission or endorsement. The existing screenshots remain provisional in static mode exactly as approved; synthetic fixture approval labels do not establish real permission.

## Migration and release prerequisites

1. Audit this PR and its stacked Studio/schema dependencies; resolve ALD-115 advisories and manual account verification, and ALD-109's separate production deployment gate.
2. Approve a protected revision approval ledger, media evidence/ingestion policy and any required credit/crop presentation. Review account roles, dataset visibility, least-privilege read access and preview access separately.
3. Perform a separately authorized migration preserving document IDs, source mappings, four slugs, contribution wording, navigation and SEO; no documents exist merely because these fixtures do.
4. Test actual published reads and permissions in an authorized non-production release workflow. Offline tests do not prove hosted account settings or live API behavior.
5. Obtain separate approval before enabling CMS mode, configuring build credentials/hooks, merging or deploying. This PR does none of those actions.

Full commands, evidence and limitations: [ALD-117_VERIFICATION.md](ALD-117_VERIFICATION.md).
