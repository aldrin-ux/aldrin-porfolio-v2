# Stitch Comparison

Audit date: 2026-10-13

## Design Sources Inspected

The fallback Stitch export was inspected at:

`E:\Desktop\Digitalikha\Digitalikha\Portfolio\stitch-export-reference\stitch_editorial_developer_portfolio_homepage`

Available exported screens:

- `aldrin_camacho_orange_white_editorial_portfolio`
- `aldrin_camacho_mobile_editorial_portfolio_390px`
- `aldrin_camacho_work_archive`
- `aldrin_camacho_case_study_dazlab`
- `aldrin_camacho_about`
- `aldrin_camacho_contact`
- `minimal_editorial_portfolio/DESIGN.md`

The exported design system specifies Inter and JetBrains Mono, a 1200px max content width, 8px image-frame radii, white/editorial surfaces, and a calm minimalist portfolio direction.

## Overall Match

The implementation follows the approved orange-and-white minimalist editorial direction and uses structured Astro components rather than pasted export HTML. It also uses the supplied high-resolution project images for Dazlab, Mortar, Handl, and Tangilla.

The implementation is not a pixel-perfect reproduction of the Stitch export. It is a simplified component rebuild with fewer page sections, fewer visual modules, and different responsive navigation behavior.

## Key Differences

### Layout

- Stitch homepage is a more exact editorial composition with stronger first-screen art direction and screen-specific spacing.
- Current homepage uses a three-column hero on desktop and a stacked mobile layout.
- Current page heights differ from the Stitch exports, especially on homepage and Dazlab case-study.
- Work archive and project grids are implemented, but spacing and hierarchy are simplified compared with the Stitch screens.

### Typography

- Implementation uses Inter and JetBrains Mono as intended.
- Current hero headings use larger clamp-based type and tighter letter spacing than the `DESIGN.md` display token in some views.
- Some pages use visual heading components without an actual `h1`; `/work/` currently reports no `h1`.

### Colors

- Stitch `DESIGN.md` base tokens include white, `#F7F7F5`, `#111827`, and neutral borders.
- Current implementation uses a warmer orange editorial palette:
  - `--background: #ffffff`
  - `--surface: #fff1e8`
  - `--ink: #141414`
  - `--muted: #626975`
  - `--border: #e8e5e1`
  - `--accent: #f15a29`
- This aligns with the approved orange-and-white direction but differs from the exact neutral token values in `DESIGN.md`.

### Spacing And Widths

- Stitch `DESIGN.md` specifies max content width of 1200px.
- Current CSS uses `--max: 1280px`.
- Section padding is implemented with responsive clamps and may not match Stitch screen spacing exactly.

### Hero Portrait

- Current build uses `public/assets/aldrin-hero.webp` and `public/assets/aldrin-about.webp`.
- These portrait assets are not part of the four high-resolution Dazlab project images supplied in the latest update.
- Independent reviewer should verify whether these are the exact approved Stitch portrait assets.

### Project Screenshots

- Current build uses the latest high-resolution supplied assets:
  - `public/assets/dazlab.png`
  - `public/assets/dazlab-case.png`
  - `public/assets/mortar.png`
  - `public/assets/handl.png`
  - `public/assets/tangilla.png`
- These match the user-supplied project screenshots and avoid AI recreation.

### Workflow Illustrations

- Stitch appears to include more designed/illustrated workflow treatment.
- Current implementation uses a reusable card-based `WorkflowIllustration.astro` with numbered steps.
- This is maintainable, but it is visually simpler than the approved design direction.

### Section Backgrounds

- Current site uses white, warm peach, and dark footer/CTA treatments.
- Stitch screens include more screen-specific section bands and exact background rhythm.
- Current sections preserve the editorial minimalism but do not fully reproduce each exported background block.

### Mobile Responsiveness

- Screenshots were captured at 390 x 844.
- No horizontal overflow was detected.
- Desktop navigation is hidden on mobile.
- No visible mobile menu or persistent bottom mobile nav is implemented, which differs from the approved mobile Stitch screen if that design expects a mobile nav pattern.

## Screen-by-Screen Notes

| Screen | Retrieved/exported source | Current route | Main differences |
| --- | --- | --- | --- |
| Homepage Desktop | `aldrin_camacho_orange_white_editorial_portfolio` | `/` | Simplified hero and workflow; different max width and spacing; current build uses high-res project images. |
| Homepage Mobile 390px | `aldrin_camacho_mobile_editorial_portfolio_390px` | `/` | Mobile layout works without overflow, but primary mobile nav treatment differs. |
| Work Archive | `aldrin_camacho_work_archive` | `/work/` | Work grid implemented; no `h1`; only Dazlab has a case-study route. |
| Dazlab Case Study | `aldrin_camacho_case_study_dazlab` | `/work/dazlab/` | Implemented case study is shorter and less visually detailed than Stitch; includes fewer modules. |
| About | `aldrin_camacho_about` | `/about/` | Editorial about structure exists, but exact portrait/layout/section rhythm should be visually reviewed. |
| Contact | `aldrin_camacho_contact` | `/contact/` | Contact form and collaboration notes exist; exact Stitch section structure is simplified. |

## Recommended Follow-Up For Independent QA

- Overlay `audit/screenshots/*.png` against the Stitch `screen.png` files.
- Confirm whether `aldrin-hero.webp` and `aldrin-about.webp` are approved image assets.
- Decide whether the missing mobile nav pattern is intentional or should be restored.
- Decide whether Mortar, Handl, and Tangilla need dedicated case-study routes before launch.

