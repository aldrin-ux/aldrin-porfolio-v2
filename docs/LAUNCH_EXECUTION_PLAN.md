# Portfolio V2 Launch Execution Plan

Audit date: 2026-10-14

Linear project: Portfolio V2 - Astro Launch & Sanity CMS (`P-ALD-5`)

Local app: `E:\Desktop\Digitalikha\Digitalikha\Portfolio\portfolio-v2-astro`

## Current repository assessment

### ALD-92 first-pass result

The local Astro app exists and builds successfully as a static site.

Build evidence:

- Command run: `npm run build`
- Result: passed
- Output mode: static
- Generated pages: 5
- Routes generated:
  - `/`
  - `/about/`
  - `/contact/`
  - `/work/`
  - `/work/dazlab/`
- Build time reported by Astro: 5.11s

Current implementation:

- Astro app with one dependency: `astro`.
- Shared static project/content data is in `src/content/site.ts`.
- Reusable presentation pieces exist for layout, header, footer, cards, section headings, case study layout, contact form, tools marquee, workflow illustration, and experience timeline.
- The approved split hero animation is implemented in `src/pages/index.astro` and includes reduced-motion handling.
- Prior local QA artifacts exist under `audit/`, including route inventory, responsive screenshots, functional test reports, hero animation QA, and prelaunch QA notes.
- The project currently has no local `.git` directory in this folder or its visible parents, so GitHub remote, branch state, history, branch protection, and PR workflow cannot be verified from this checkout.
- No `.github` workflow exists in the app.
- No `netlify.toml` exists.
- No `robots.txt` or `sitemap.xml` exists in `public/`.
- No `tsconfig.json`, ESLint config, Lighthouse setup, axe/pa11y setup, or `astro check` dependencies are configured.
- `astro.config.mjs` still uses `site: "https://example.com"`, so canonical and Open Graph URLs are not production-ready.
- No `.env` file was found in the app directory scan.

### GitHub and Netlify connection status

GitHub:

- Not confirmed.
- `git status` and `git remote -v` fail because this local app folder is not a Git repository.
- There is no local evidence of a GitHub remote or branch workflow.

Netlify:

- Not confirmed.
- There is Netlify-compatible form markup in `src/components/ContactForm.astro`.
- There is no `netlify.toml`, no deploy metadata, and no local evidence that this app is connected to an existing Netlify site.
- Netlify Forms must be verified on a Netlify deploy preview before claiming the form works end to end.

## Linear issue status versus actual code

All retrieved Linear issues are currently Backlog and should not be marked complete yet. The status below compares the Linear requirements with the inspected code and available audit evidence.

| Issue | Linear status | Actual code status | Notes |
| --- | --- | --- | --- |
| ALD-91 - Refine hero intro alignment and CTA spacing | Backlog | Partially complete / on hold | Hero animation exists and must be preserved. Current label is still `Aldrin Camacho - Webflow Developer & Digital Experience Specialist`, not the requested `WEBFLOW DEVELOPER / DIGITAL EXPERIENCE SPECIALIST`. CTA spacing appears implemented but should be visually reviewed before changing. |
| ALD-92 - Audit Astro codebase and production build | Backlog | Mostly complete by this planning pass | App inspected and production build passed. Remaining output should be captured in this document and a future branch/PR if Linear process requires it. |
| ALD-93 - Verify GitHub repository and safe branch workflow | Backlog | Blocked | Local folder is not a Git repo. Needs correct repository checkout or GitHub connection details before branch workflow can be verified. |
| ALD-94 - Add lint, type checks and CI build validation | Backlog | Missing | No CI, lint config, `tsconfig.json`, or `@astrojs/check` setup found. `npm exec astro check` prompts to install dependencies, so it was not run during this audit. |
| ALD-95 - Separate static project data from presentation | Backlog | Partially complete | Project data is centralized in `src/content/site.ts`; presentation components consume it. This is good enough for Release 1 static launch, but future Sanity mapping still needs a clean schema/migration plan. |
| ALD-96 - Audit homepage H2 orange period consistency | Backlog | Mostly complete / needs visual audit | `SectionHeading.astro` strips trailing periods and appends an orange period. Other local h2s also use accent periods. Needs page-by-page confirmation for duplicates and non-section headings. |
| ALD-97 - Audit subtitles, copy and grid alignment | Backlog | Partially complete | Prior subtitle audit exists. Current homepage Experience section no longer has the explicit subtitle named in Linear, but copy and grid alignment still need a final pass across routes. |
| ALD-98 - Responsive visual and UX audit across routes | Backlog | Partially complete | Prior responsive audit covers requested widths and reports no overflow. Needs current-source rerun after any launch changes. |
| ALD-99 - Audit hero intro animation and reduced-motion fallback | Backlog | Partially complete | Hero animation, reduced-motion CSS, and QA artifacts exist. There is a QA artifact showing a 1440 final support visibility anomaly, so rerun verification before closing. Do not redesign. |
| ALD-100 - Accessibility and interaction audit | Backlog | Partially complete | Basic semantics, focus styles, mobile nav labels, one h1 per route, form labels, and image alt text exist. No axe/pa11y configured. Needs automated and manual audit. |
| ALD-101 - Verify experience history and portfolio claims | Backlog | Missing / blocked by content | `To be confirmed` remains for B+ Studio, MCFLY Industries, and earlier roles. Claims need user/source verification before public launch. |
| ALD-102 - Complete launch-ready static case studies | Backlog | Partially complete | Dazlab has an internal case study. Mortar, Handl, and Tangilla currently link externally and are acceptable for Release 1 if approved. Contributions and screenshots still need verification. |
| ALD-103 - Review About, Contact and homepage positioning | Backlog | Partially complete | Pages exist with concise positioning. Needs editorial pass without inventing claims. |
| ALD-104 - Connect GitHub to Netlify and configure previews | Backlog | Blocked | Requires verified GitHub repo and Netlify site/access. No local connection evidence found. |
| ALD-105 - Configure production domain, HTTPS and redirects | Backlog | Blocked | Needs approved canonical domain and DNS/Netlify access. Current `site` is `https://example.com`. |
| ALD-106 - Validate contact form end-to-end on Netlify | Backlog | Partially complete / blocked | Static Netlify form markup exists. Needs deploy preview test, notification settings, spam behavior, success/error UX decision, and production test after approval. |
| ALD-107 - Technical SEO metadata and social sharing audit | Backlog | Partially complete | Base title, description, canonical, OG, and Twitter card tags exist. Domain placeholder, route-specific metadata depth, social image choice, h-structure, links, and alt text need final audit. |
| ALD-108 - Sitemap, robots and structured data | Backlog | Missing | No sitemap, robots, or JSON-LD structured data found. Must not fabricate schema properties. |
| ALD-109 - Image, font and script performance optimization | Backlog | Partially complete | Astro image optimization is used for the About portrait only. Public project images and Google Fonts import need performance review. Lighthouse not available locally. |
| ALD-110 - Cross-browser and Core Web Vitals verification | Backlog | Missing / blocked by tooling | No current lab CWV or cross-browser report. Needs Playwright/browser matrix and Lighthouse or equivalent. Field data only after launch. |
| ALD-111 - Security and production configuration review | Backlog | Partially complete | No `.env` found. Needs dependency review, headers, redirects, exposed token scan, form abuse review, and deployment config. |
| ALD-112 - Staging release acceptance and go/no-go review | Backlog | Waiting | Must wait for R1 launch blockers, deploy preview, SEO/form/security checks, and user approval. |
| ALD-113 - Production launch and post-launch smoke tests | Backlog | Waiting / approval required | Must wait for explicit production approval. Do not deploy yet. |
| ALD-114 - R2 Sanity content model and migration mapping | Backlog | Planned only | Release 2. Can be planned in parallel but must not block R1. |
| ALD-115 - R2 Sanity project, Studio and access control | Backlog | Blocked by approval/credentials | Needs Sanity account/project authorization and environment config. |
| ALD-116 - R2 Sanity schemas and content validation | Backlog | Waiting | Depends on ALD-114 and ALD-115. |
| ALD-117 - R2 Astro/Sanity integration preserving URLs | Backlog | Waiting | Depends on schemas and migration mapping. Static URLs should remain stable. |
| ALD-118 - R2 migrate static projects and validate parity | Backlog | Waiting | Depends on Sanity schemas/integration and verified source content. |
| ALD-119 - R2 preview, publishing workflow and CMS release QA | Backlog | Waiting | Depends on Sanity implementation and Netlify rebuild/preview decisions. |

## Completed, partial, missing, duplicates

### Completed or largely covered in code

- Core Astro app and five static routes.
- Production static build.
- Approved orange/white editorial direction and hero animation foundation.
- Shared static content module.
- Dazlab internal case-study route.
- External links for Mortar, Handl, and Tangilla.
- Netlify form markup foundation.
- Basic SEO metadata foundation.
- Basic responsive and functional QA artifacts from prior audit work.

### Partially completed

- Static content/presentation separation.
- Hero animation QA.
- Responsive QA.
- Accessibility QA.
- SEO metadata.
- Contact form readiness.
- Case-study readiness.
- Security/config review.
- Performance review.

### Missing or blocked

- GitHub repository verification.
- Netlify site verification and deploy previews.
- Production domain, HTTPS, redirect decisions.
- Sitemap and robots.
- Structured data.
- CI/lint/typecheck setup.
- Automated accessibility tooling.
- Lighthouse/Core Web Vitals evidence.
- End-to-end Netlify form test.
- Verified experience dates and portfolio claims.
- Sanity project, Studio, schemas, migration, preview, and publishing workflow.

### Duplicated or overlapping tasks

- ALD-98, ALD-99, ALD-100, ALD-109, and ALD-110 overlap on visual QA, interaction QA, performance, and browser checks. Run them as a coordinated QA pass after the high-priority content/config fixes.
- ALD-107 and ALD-108 overlap on SEO. Do metadata first, then sitemap/robots/structured data.
- ALD-102 and ALD-101 overlap on proof and claims. Verify claims before strengthening case studies.
- ALD-104, ALD-105, ALD-106, ALD-112, and ALD-113 all depend on Netlify/GitHub/domain access and should be sequenced carefully.
- ALD-114 through ALD-119 are a coherent Release 2 CMS track and should not be allowed to interrupt Release 1 launch readiness.

## Recommended task sequence

### Release 1 priority order

1. ALD-92 - Finalize audit record and build evidence.
2. ALD-93 - Re-establish or locate the correct GitHub repository checkout.
3. ALD-101 - Verify dates, client names, contribution scope, and public screenshot permission.
4. ALD-102 - Finalize static project/case-study presentation using only verified facts.
5. ALD-105 - Confirm production canonical domain, then replace `https://example.com`.
6. ALD-107 and ALD-108 - Complete route metadata, social sharing, sitemap, robots, and valid structured data.
7. ALD-94 - Add minimal check/build CI after GitHub is verified.
8. ALD-111 - Security and production configuration review.
9. ALD-100, ALD-98, ALD-99, ALD-109, and ALD-110 - Coordinated accessibility, responsive, hero, performance, and cross-browser QA pass.
10. ALD-103 and ALD-97 - Final copy/positioning/subtitle polish after factual claims are settled.
11. ALD-104 - Connect GitHub to Netlify and configure deploy previews.
12. ALD-106 - Validate Netlify Forms end to end on a deploy preview.
13. ALD-112 - Staging release acceptance and go/no-go review.
14. ALD-113 - Production launch and post-launch smoke tests only after explicit approval.

### Release 2 CMS roadmap

1. ALD-114 - Map current static data and routes to a Sanity content model.
2. ALD-115 - Create/configure Sanity project, Studio, datasets, roles, and environment variables after approval.
3. ALD-116 - Implement schemas and validation rules.
4. ALD-117 - Integrate Astro with Sanity at build time while preserving current static URLs.
5. ALD-118 - Migrate verified static content and validate parity.
6. ALD-119 - Add preview/publishing workflow, rebuild triggers, regression tests, rollback plan, and CMS release QA.

## Dependencies and blockers

### Must wait for user approval, credentials, content, or configuration

- GitHub repository location/access, if this local folder is not the canonical repo.
- Netlify account/site access and confirmation whether an existing site should be reused.
- Production canonical domain and www/non-www preference.
- DNS/HTTPS changes.
- Production deployment approval.
- Contact form notification destination and spam handling preference.
- Sanity project creation/access, dataset naming, token policy, and Studio hosting decision.
- Verified employment dates for B+ Studio, MCFLY Industries, and earlier roles.
- Confirmation of project contribution claims and permission to show project screenshots.
- Final Open Graph/social image choice.

### Can run independently

- ALD-92 audit documentation.
- ALD-96 H2 orange period audit.
- ALD-97 copy/subtitle/grid audit.
- ALD-98 responsive visual audit.
- ALD-99 hero animation/reduced-motion audit.
- ALD-100 accessibility audit.
- ALD-103 About/Contact/homepage positioning review.
- ALD-109 image/font/script performance audit.
- ALD-111 local secret/config/dependency scan.
- ALD-114 Sanity content model planning.

### Must wait for earlier tasks

- ALD-93 must happen before branch workflow, CI, PR, and Netlify connection work.
- ALD-94 depends on GitHub repo verification for GitHub Actions.
- ALD-105 depends on the approved canonical domain.
- ALD-106 depends on Netlify preview.
- ALD-112 depends on Release 1 fixes and deploy preview.
- ALD-113 depends on explicit user approval after ALD-112.
- ALD-115 depends on Sanity account/project approval.
- ALD-116 depends on ALD-114/ALD-115.
- ALD-117 depends on ALD-116.
- ALD-118 depends on ALD-117 and verified content.
- ALD-119 depends on the CMS implementation.

## Release 1 launch checklist

- [x] Confirm static Astro app builds locally.
- [x] Confirm core routes exist.
- [x] Preserve approved portfolio design direction and hero animation.
- [ ] Confirm correct GitHub repository and branch workflow.
- [ ] Confirm production domain.
- [ ] Replace `https://example.com` in `astro.config.mjs`.
- [ ] Verify or remove all `To be confirmed` experience dates.
- [ ] Verify client/project contribution claims.
- [ ] Confirm screenshot/public display permissions.
- [ ] Finalize static project/case-study behavior for Mortar, Handl, and Tangilla.
- [ ] Add minimal build/check CI.
- [ ] Add sitemap and robots.
- [ ] Add valid structured data only where supported by verified facts.
- [ ] Complete metadata/social preview audit.
- [ ] Complete accessibility audit.
- [ ] Complete responsive/browser QA after final content/config changes.
- [ ] Complete performance/Lighthouse or equivalent lab audit.
- [ ] Confirm Netlify site and deploy preview.
- [ ] Test Netlify form submission on deploy preview.
- [ ] Complete security/configuration review.
- [ ] Complete staging go/no-go review.
- [ ] Get explicit approval before production deployment.
- [ ] Run post-launch smoke tests only after approved deployment.

## Release 2 CMS roadmap

Sanity CMS should not block Release 1. Release 2 should preserve the static site's current URLs and content parity.

Recommended CMS principles:

- Treat current `src/content/site.ts` as the source inventory for the first schema mapping pass.
- Preserve `/work/` and `/work/dazlab/`.
- Do not invent missing project details during migration.
- Keep a static fallback or rollback path until CMS parity is proven.
- Keep Sanity write tokens out of client code.
- Require slug uniqueness, alt text, SEO fields, references, and required fields.
- Add preview and publishing only after schema/content parity is stable.

## Suggested first Codex task

Recommended first implementation task:

ALD-93 - Verify GitHub repository and safe branch workflow.

Reason:

The local Astro build is already passing, but the folder is not a Git repository. Before any launch fixes, Netlify setup, CI, or PR-based work, the project needs the correct GitHub-connected checkout or an intentional repo initialization/import decision. Without that, branch/PR evidence, deployment previews, rollback, and production release discipline cannot be verified.

Suggested prompt:

> Retrieve ALD-93 from Linear and inspect the actual Portfolio V2 Astro project location. Determine whether `portfolio-v2-astro` is already connected to the correct GitHub repository elsewhere, or whether it needs to be initialized/imported. Do not force-push, discard work, deploy, or change Linear status. Report the safe branch workflow and blockers before making repository changes.
