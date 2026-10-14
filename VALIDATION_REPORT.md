# Portfolio V2 Validation Report

Date: 2026-10-13

## Build

- `npm install` completed.
- `npm run build` completed successfully.
- Astro output: `portfolio-v2-astro/dist`
- Pages built:
  - `/`
  - `/work/`
  - `/work/dazlab/`
  - `/about/`
  - `/contact/`

## Browser Screenshot Validation

Screenshots were captured from the built static output served locally at `http://127.0.0.1:4322/`.

Captured screenshots:
- `validation-home-desktop-final.png`
- `validation-home-mobile-390-final.png`
- `validation-work-desktop.png`
- `validation-work-dazlab-desktop.png`
- `validation-about-desktop.png`
- `validation-contact-desktop.png`

## Comparison Notes

Matched against approved Stitch references:
- Desktop homepage keeps the approved split hero: designer / portrait / developer.
- Mobile homepage keeps the 390px stacked hero sequence from Stitch.
- Warm orange-white selected-work band is preserved.
- Approved Stitch image assets are used locally from `public/assets`.
- Header, footer, project cards, workflow, experience, and contact patterns are rebuilt as Astro components rather than pasted exported HTML.
- Typography, spacing, light borders, rounded media frames, and orange accents follow the latest orange-and-white Stitch screens.

Known visual differences:
- The implementation uses a simplified responsive mobile header instead of the exported Stitch bottom icon navigation. The browser validation showed the bottom nav rendering incorrectly in the test viewport, so it was removed to preserve layout clarity.
- Workflow illustration is rebuilt as a clean component grid rather than the exact exported diagram/SVG.
- Non-homepage pages are faithful component rebuilds from the exported structure, not exact pixel-for-pixel exports.

## Accessibility And Responsive Checks

Quick browser checks on the homepage:
- One `h1` present.
- No missing image `alt` attributes.
- No horizontal overflow at the tested viewport.
- Contact form has visible labels and required fields.

## Result

Major layout, typography, spacing, and image mismatches found during the validation pass were addressed. The remaining differences are intentional component-level rebuild choices made to keep the Astro code maintainable.
