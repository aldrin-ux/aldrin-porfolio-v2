# ALD-101 — Experience and case-study corrections

Prepared October 15, 2026 (Asia/Shanghai). Base: `main` at `c21a00457b242ec1dd6885e73151aabb0921fe69`. Branch: `ald-101-content-corrections`.

## Evidence and scope

Source of truth is the user's correction request, their 2026 resume facts transcribed in [ALD-101](https://linear.app/aldrin-workspace/issue/ALD-101/r1-verify-experience-history-and-portfolio-claims), and the explicit user confirmations recorded there. The original PDF was not available in this checkout; no additional facts were inferred from it. The preceding inventory was read from `../docs/ALD-101_CLAIMS_VERIFICATION.md` and the issue comments; it remains a historical baseline, superseded only for facts confirmed here.

Resume evidence is user-supplied, not independent HR verification. Priority Studios' combined role is a user-confirmed descriptive title. Employment months, exact project years, individual feature inventories, business outcomes, and reuse rights are not newly asserted.

## Confirmed employment history

| Employer | Role | Years |
| --- | --- | --- |
| Dazlab | Webflow Developer | 2025–2026 |
| B+ Studio | Webflow Developer | 2024–2025 |
| MCFLY Industries | Webflow Developer | 2023–2024 |
| Priority Studios | Webflow Developer & Service Designer | 2021–2023 |
| Platform Studios | UX/UI Design | 2018–2021 |
| Philippines Research & Survey Center | Data Encoding | 2013–2017 |
| Art Pose Photos | Graphic Design | 2010–2012 |

Descriptions use resume responsibilities recorded in the issue: B+ Webflow/Shopify and responsive landing pages; MCFLY Webflow/CMS and SEO-ready structure; Priority Webflow plus wireframes, service blueprints and journey mapping; Platform wireframes and UI mockups. Earlier roles have short descriptions consistent with their confirmed labels. No private address, phone number, or other resume contact details were copied.

## Attribution and copy changes

All four projects are credited to Dazlab and describe Aldrin's role as its sole Webflow developer. The subject of each entry is the **marketing website**, with Figma-to-Webflow, responsive work, CMS and technical SEO/AEO described as Dazlab responsibilities where applicable. This does not imply that every capability was implemented on every website.

| Before | After |
| --- | --- |
| Dazlab: July 2025–April 2026 | 2025–2026, year granularity only |
| B+ Studio/MCFLY dates: To be confirmed | 2024–2025 / 2023–2024 |
| Earlier UI/UX & Product Roles | Four named roles with confirmed years |
| Handl: Webflow Build & Integrations | Webflow Marketing Website; developed under Dazlab |
| Dazlab outcome: A scalable website system | Concrete role, marketing-website scope, Dazlab credit and provisional status |
| CreativeWork named after the product, creator Aldrin | Case study named as an article, author Aldrin, subject Thing, explicit Dazlab creditText |
| Project years 2025/2025/2025/2024 | Removed; employment dates are not substituted for project dates |
| Direct verified contact | Contact on LinkedIn; target unchanged |

Homepage and About descriptions, project cards, Work archive, four case-study narratives and their search/social/structured metadata now agree. Common services copy removes unsupported integration/performance wording in favor of confirmed responsive implementation. No CSS, animation scripts, images, navigation destinations, contact-form handling, domain configuration, or CMS integration changed. The expanded timeline and narrative copy naturally increase page height.

## Provisional imagery and remaining review

The user authorized provisional retention of existing images until future Sanity work. No Sanity implementation is included. Public accessibility does not establish a license, client permission, or endorsement. Each case study states provisional status and pending reuse-rights/project-date review. No quantitative result is attributed to Aldrin; screenshot product claims are explicitly distinguished from Webflow contribution.

| Assets | Review concerns |
| --- | --- |
| `public/assets/mortar.png` and `.webp` variant | Embedded 12+, 94%, 10x, 800+, $750+ savings, pricing and testimonial; approval, substantiation and capture version unresolved |
| `public/assets/tangilla.png` and `.webp` variant | Product metrics, uptime/implementation-success claims, testimonials and dashboard graphics; no personal attribution or permission inferred |
| `public/assets/handl.png` and `.webp` variant | Financial/dashboard examples, integration logos, founder portrait and pricing; confirm approved/demo data and rights |
| `public/assets/dazlab.png`, `dazlab-case.png` and `.webp` variants | Product dashboard mockups, third-party imagery and logos; confirm rights, version and contribution boundaries |
| Active portraits and unused `aldrin-about.webp` | Earlier audit provenance/likeness/usage-rights questions remain unresolved; no new permission claim |

Tools-marquee proficiency/usage, LinkedIn account ownership, exact project dates, detailed per-project CMS/SEO/AEO features, and rights-holder approval remain review items. Existing toolkit logos/animation were preserved; this PR does not certify every tool or imply that this Astro portfolio was built in Webflow.

## Validation

- `npm run build`: passed, 10 static pages plus sitemap.
- `npm run check`: passed; remaining existing warning is the placeholder canonical domain `https://example.com`.
- `npm test`: passed; this invokes the same release validator as `npm run check`, not an independent fact-verification suite.
- Focused built-content review: seven confirmed timeline rows on homepage/About; all four case-study descriptions, article authorship and Dazlab credit; no month/project-year placeholders or unsupported scalability/integration outcomes in corrected content.
- Responsive browser review: eight routes (`/`, `/about/`, `/work/`, four case studies, `/contact/`) at actual CSS widths 1440 and 390. All 16 checks had no horizontal overflow, one h1 and no observed broken images. Results in `audit/ald-101/responsive-checks.json`.
- Visually reviewed desktop/mobile timeline and Handl attribution screenshots in `audit/ald-101/`. No new wrapping/overlap defect observed. This is a focused review, not a complete cross-browser or pixel-diff audit.
- Style blocks and homepage animation script are unchanged from base. Contact handling and existing public assets are unchanged. No contact submission performed.

## Review boundary

Prepared for PR review only. No merge, manual deployment, domain/DNS change, final launch, or issue completion is authorized. ALD-101 stays In Progress for ChatGPT/user copy and permission review. Any hosting integration may independently generate its usual PR checks/preview; no deployment command is part of this work.
