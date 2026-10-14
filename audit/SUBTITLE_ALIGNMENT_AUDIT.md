# Portfolio V2 Subtitle & Content Alignment Audit

Generated: 2026-10-13

## Scope Reviewed

- Homepage (`/`)
- Work Archive (`/work/`)
- Dazlab Case Study (`/work/dazlab/`)
- About (`/about/`)
- Contact (`/contact/`)

No additional implemented pages were found.

## Global Alignment Changes

### Shared Section Heading Component

- Original pattern: `SectionHeading` used a two-column layout, with the heading on the left and supporting description in a separate right column.
- Decision: **Reposition**
- Reason: Short subtitles were visually detached from their headings and could feel arbitrary on sparse editorial sections.
- Change implemented: `SectionHeading` now renders as one left-aligned heading group. Descriptions sit directly below their `h2` and share the same left edge. Headings without descriptions now use a tighter bottom margin.

## Page Decisions

### Homepage

| Section | Original subtitle/supporting text | Decision | Reason | Change implemented |
| --- | --- | --- | --- | --- |
| Hero / designer | `I shape structure, visual rhythm, and usability before a site reaches Webflow.` | Keep | Adds role clarity beside the designer heading. | Preserved. |
| Hero / developer | `I build responsive Webflow sites with scalable CMS structure and technical SEO foundations.` | Keep | Adds technical context beside the developer heading. | Preserved. |
| Selected Work | `Webflow builds for SaaS teams, product studios, and service-led companies.` | Keep / Reposition | Helps frame the project grid and now aligns with the heading. | Kept and repositioned under the heading via `SectionHeading`. |
| What I Do | `Design-aware Webflow development for clean, maintainable marketing sites.` | Remove | The service cards already explain the section more specifically. | Removed. |
| From Idea to Live Website | `A practical build process from structure and design through Webflow launch.` | Remove | The workflow cards already communicate the process. | Removed. |
| About Me paragraphs | Two short profile paragraphs | Keep | Meaningful professional background and capability context. | Preserved. |
| Experience | `Selected professional experience` | Remove | Redundant with `06 / EXPERIENCE` and `Where I've Worked.` | Removed per approved refinement. |
| Contact strip | `Have a Webflow build, CMS cleanup, or ongoing site need? I’d be glad to talk.` | Keep | Gives the CTA a clear purpose. | Preserved. |

### Work Archive

| Section | Original subtitle/supporting text | Decision | Reason | Change implemented |
| --- | --- | --- | --- | --- |
| Work Archive | `A focused archive of Webflow builds, CMS systems, and technical implementation.` | Keep / Reposition | Useful archive context; previously felt detached in the two-column heading layout. | Kept and aligned under the heading via `SectionHeading`. |
| Archive CTA | `Want the thinking behind the work?` | Keep | Supports the About CTA without overexplaining. | Preserved. |

### Dazlab Case Study

| Section | Original subtitle/supporting text | Decision | Reason | Change implemented |
| --- | --- | --- | --- | --- |
| Case hero summary | Dazlab product-studio summary | Keep | Meaningful case-study context, not redundant with the `h1`. | Preserved. |
| Meta details | Role, Stack, Focus, Outcome | Keep | Specific technical and contribution details. | Preserved. |
| Context paragraph | Case-study context paragraph | Keep | Explains the project need and build direction. | Preserved. |
| Implementation paragraph | Implementation paragraph | Keep | Demonstrates actual contribution and technical work. | Preserved. |
| Result paragraph | Result paragraph | Keep | Explains the delivered system without inventing metrics. | Preserved. |
| Next Work | No subtitle | Keep | Heading-to-grid relationship is direct and clear. | No change. |

### About

| Section | Original subtitle/supporting text | Decision | Reason | Change implemented |
| --- | --- | --- | --- | --- |
| About hero | No subtitle beyond `h1` | Keep | The portrait and heading are the primary composition. | No change. |
| Profile story | Two profile paragraphs | Keep | Important professional background and positioning. | Preserved. |
| Experience | `Selected professional experience.` | Remove | Redundant with the heading and timeline. | Removed. |

### Contact

| Section | Original subtitle/supporting text | Decision | Reason | Change implemented |
| --- | --- | --- | --- | --- |
| Contact hero | `Have a Webflow project, CMS cleanup, or remote role in mind? Send the details and I’ll take a look.` | Keep | Clarifies the contact intent and is aligned with the hero. | Preserved. |
| Two ways to work together | Section label plus two short paragraphs | Keep | Useful routing for project vs role inquiries. | Preserved. |
| What working together looks like | Three short support cards | Keep | Helps visitors understand collaboration style. | Preserved. |

## Responsive QA

Tested at:

- 320px
- 390px
- 768px
- 1440px

Routes checked:

- `/`
- `/work/`
- `/work/dazlab/`
- `/about/`
- `/contact/`

Results:

- No horizontal overflow detected.
- Shared subtitles align with their `h2` left edge.
- Shared subtitles sit below headings rather than floating in a separate column.
- Removed homepage and About Experience subtitles are no longer present.
- Homepage Experience spacing is tighter before the timeline divider.
- No clipped section headings.
- `h2` orange final-period treatment remains intact.
- Console errors/warnings: none during browser QA.

## Build

- `npm run build`: passed.
- Astro generated 5 static pages successfully.

## Items Intentionally Preserved

- Approved hero composition and portraits.
- Project screenshots and case-study image assets.
- Existing project facts, dates, employers, technologies, and responsibilities.
- Header, footer, mobile navigation, contact form, and marquee animation behavior.
- Meaningful project and case-study technical details.

## Deployment

No Netlify deployment was performed.
