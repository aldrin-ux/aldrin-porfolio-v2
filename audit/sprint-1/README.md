# Sprint 1 — Portfolio Polish and Cross-Browser QA

Baseline: `88532ad18215c064a14e2824ec9f90b0e513d482` (main, PR #6). Branch: `sprint-1-portfolio-polish-qa`. Local verification: 15 October 2026, UTC+8.

Development proceeded under the user's explicit authorization despite ALD-109's unresolved automatic production deployment. This report verifies local production builds, not a production deployment. ALD-109 remains In Progress. The Sprint PR requires separate review and merge/deployment approval.

## Per-issue results

| Issue | Changes / acceptance evidence | Status / remaining review |
| --- | --- | --- |
| ALD-91 | Exact approved label, centered over portrait. Desktop CTA gap changed from 6.99px to 35.99–36.00px after final 1.08 scale. Narrow label height reserved before font swap. Five requested sizes checked. | In Progress, awaiting visual approval. On the existing stacked mobile/tablet layout, developer copy remains between portrait and CTAs; the 36px margin follows that content, rather than moving or deleting it. |
| ALD-97 | Named Experience subtitle already absent on main and remains absent. Audited optional section descriptions and shared project/timeline grids. Fixed confirmed About tablet heading/portrait overlap by stacking only the intro at ≤1000px; updated image `sizes` to match. | In Progress, awaiting review. Approved professional text and all case studies preserved. |
| ALD-99 | Preserved V7 JavaScript/keyframes. Runtime samples show split panels, heading translation → identity, portrait 0.86 → 1.08, then delayed supporting reveal. Corrected the container stacking context during prep/running so moving headings appear above the panels; default pre-script coverage is retained to avoid an initial heading flash. Fixed the desktop no-script opaque-panel defect with a scoped, inline `<noscript>` stylesheet. Reduced motion: no animations, visible content, unscaled portrait. Short screens skip reveal and scroll normally. | In Progress, awaiting review and unavailable browser coverage. No FOUC or unexpected clipping observed in tested views; small font-related lab CLS remains below 0.1. |
| ALD-110 | Chromium route, image/font, keyboard, responsive, animation and console checks; Lighthouse mobile/desktop. All nine routes and 62 referenced local resources returned 200. | In Progress. Firefox/WebKit/Safari unavailable. Dazlab mobile lab LCP exceeds 2.5s. Field INP unavailable. Hosted security/header checks remain dependent on an automatic preview or later approved deployment. |

## Files changed

- `src/pages/index.astro`: label, stable CTA spacing, narrow-label font-swap reservation, reveal heading layer, no-script fallback. No animation JavaScript or keyframe changes.
- `src/pages/about.astro`: tablet intro grid and corresponding responsive image hint. No text or image-file changes.
- `audit/sprint-1/`: measurements, screenshots and verification evidence.

The desktop spacing calculation reserves the lower 4% overhang of the existing portrait's 1.08 scale using its 493/512 aspect and the center column's 40% share of available grid width. Bottom padding is rebalanced to keep the desktop hero within its existing viewport-height layout. Reduced motion uses a direct 36px gap without scale compensation.

## Responsive and visual evidence

| CSS viewport | Final behavior |
| --- | --- |
| 375×667 | Centered two-line label; existing stacked content; 36px stage-to-CTA margin; no horizontal overflow. |
| 390×844 | Same; full hero remains scrollable and CTAs unobscured. |
| 768×1024 | Hero retains stacked layout; About intro now stacks without heading/image overlap. |
| 1440×900 | 1.08 portrait; measured 35.998px portrait-to-CTA gap. |
| 1920×1080 | True Lighthouse screen emulation, DPR 1; measured 35.991px portrait-to-CTA gap. |
| 1440×600 (additional) | Reveal skipped; complete hero and CTAs accessible by scrolling; 35.991px gap. |

The in-app browser's device scale factor is about 2.51; physical viewport overrides were converted to CSS dimensions and verified with `innerWidth`/`innerHeight`. Its width cap prevents a true 1920px CSS viewport, so that view uses a separate Lighthouse runtime probe and screenshot. No clamped capture is presented as 1920px evidence.

| View | Before | After |
| --- | --- | --- |
| Desktop hero | [1440×900](screenshots/before-home-1440x900.jpg) | [1440×900](screenshots/after-home-1440x900.jpg) |
| Full HD hero | [1920×1080](screenshots/before-home-1920x1080.jpg) | [1920×1080](screenshots/after-home-1920x1080.jpg) |
| Mobile hero | [390×844](screenshots/before-home-390x844.jpg) | [390×844](screenshots/after-home-390x844.jpg), [full hero](screenshots/after-home-390-full-hero.jpg) |
| Tablet About | [768×1024 overlap](screenshots/before-about-768x1024.jpg) | [768×1024 corrected](screenshots/after-about-768x1024.jpg) |
| Scripts disabled | [covered desktop hero](screenshots/baseline-nojs.jpg) | [visible desktop hero](screenshots/candidate-nojs.jpg) |
| Initial reveal frame | [headings occluded](screenshots/before-heading-reveal.jpg) | [headings visible above panels](screenshots/after-heading-reveal.jpg) |
| Reduced motion | — | [1440×900](screenshots/candidate-reduced.jpg) |

Additional before/after About, Work and Dazlab screenshots at 375, 768 and 1440px are in `screenshots/`. Browser checks cover all nine routes at those three widths (27 route/viewport observations). No broken loaded images or page overflow were observed. The About heading also fits at the 1001px side-by-side boundary. Original image files, crop rules and fonts are preserved.

## Browser and accessibility matrix

| Browser / mode | Coverage | Result |
| --- | --- | --- |
| Codex in-app Chromium | Nine routes at mobile/tablet/desktop; responsive screenshots; keyboard navigation | Passed observed checks; no warning/error console messages captured. |
| Headless Chrome 155, Lighthouse 13.5.0 | Performance presets, true 1920px view, V7 runtime frames, short-screen, reduced-motion, no-script navigation | Results below and in `runtime/`. |
| Firefox | No installed engine available | Not tested; requires follow-up. |
| WebKit / Safari | No installed engine available; no Safari device | Not tested; requires follow-up. |

Keyboard: opening the mobile menu focuses Close; Shift+Tab wraps to Contact, Tab wraps back to Close; Escape closes and returns focus to the menu trigger with its visible outline. Enter opens the menu; Work navigates and closes it. Skip to main content moves focus to `main-content`. See `keyboard-navigation.json`.

Scripts-disabled navigation uses a separate Lighthouse probe: page script execution is disabled before navigation and resumed only after navigation to permit read-only inspection. The hero stays in its uninitialized `hero` class, with zero instrumented page frames; screenshots confirm the `<noscript>` fallback. This is separate from scored performance runs. Native anchor markup and route accessibility are preserved; no contact forms were submitted. Existing mobile menu behavior without JavaScript was not changed.

Default motion retains the existing animated tools marquee after the hero finishes. Reduced motion reports **zero active page animations**. Runtime samples and screenshots are in `runtime/` and `screenshots/`.

## Lighthouse: same-condition homepage comparison

Local static production builds, identical gzip/no-store server behavior, same Windows machine, Headless Chrome 155, Lighthouse 13.5.0. Fresh browser per run with default storage reset. Default **simulated** mobile preset: 412×823, DPR 1.75, RTT 150ms, throughput 1638.4kbps, CPU slowdown 4. Desktop uses Lighthouse's desktop preset. Two sequential runs per stage/device; medians below (the mean of the two central values for n=2). Runtime instrumentation was excluded from performance runs.

| Metric | Mobile baseline | Mobile candidate | Desktop baseline | Desktop candidate |
| --- | ---: | ---: | ---: | ---: |
| Performance | 99 | 99 | 100 | 100 |
| FCP | 1.060s | 1.141s | 0.338s | 0.272s |
| LCP | 2.184s | 2.185s | 0.472s | 0.471s |
| CLS | 0.00504 | 0.00313 | 0.00040 | 0.00077 |
| TBT (lab) | 0ms | 20.5ms | 0ms | 0ms |
| Speed Index | 1.060s | 1.141s | 0.866s | 0.811s |
| Transferred bytes | 287,063 | 287,308 | 288,335 | 288,580 |
| Image transfer bytes | 194,484 | 194,484 | 195,756 | 195,756 |

The extra transfer is 245 bytes per homepage load (compressed HTML/CSS). No external JavaScript request was made; the two existing inline modules remain byte-identical at 1,489 + 1,836 = 3,325 uncompressed bytes, included in HTML transfer rather than a separate script request. No image/font payload change.

Variability: baseline mobile FCP ranged 0.908–1.212s, candidate 0.921–1.361s; LCP was stable at 2.183–2.185s before and 2.184–2.185s after. Candidate mobile TBT ranged 0–41ms. Desktop LCP ranged 0.470–0.474s before and 0.470–0.471s after. This small lab sample does not establish a meaningful speed improvement; the purpose is to check that polish preserves performance.

An intermediate label version produced CLS 0.02786 from font swapping. The final two-line height reservation reduced the final runs to 0.00112–0.00513 (median 0.00313). `intermediate-font-shift.json` records the rejected measurement separately from final results.

### Additional candidate spot checks

Work and About: one run per device; Dazlab: two runs per device, median reported. These are candidate-only spot checks, not before/after comparisons.

| Route/device | Performance | FCP | LCP | CLS | TBT | Speed Index | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Work / mobile | 100 | 1.358s | 1.733s | 0.02183 | 0ms | 1.358s | 219,231B |
| Work / desktop | 100 | 0.328s | 0.408s | 0.00142 | 0ms | 0.328s | 219,231B |
| Dazlab / mobile | 96 | 1.359s | **2.706s** | 0 | 0ms | 1.359s | 357,980B |
| Dazlab / desktop | 100 | 0.327s | 0.705s | 0.00092 | 0ms | 0.327s | 532,352B |
| About / mobile | 99 | 1.356s | 1.431s | 0.05375 | 0ms | 1.356s | 124,267B |
| About / desktop | 100 | 0.325s | 0.325s | 0.00871 | 0ms | 0.325s | 112,069B |

Dazlab mobile LCP repeats at 2.707s and 2.705s: the ≤2.5s target is **not met** on this case-study lab sample. Its source, imagery and payload are unchanged in this Sprint. Keep this as an ALD-110 warning; do not claim all Core Web Vitals targets passed.

Google PageSpeed Insights' public API returned **HTTP 429** when queried for the current live site. No usable field LCP/CLS/INP data was obtained. The Sprint candidate is not in production. **INP is unverified; TBT is a lab metric and is not reported as INP.** These local measurements omit real Netlify/network latency and do not verify production Core Web Vitals.

Raw performance reports are compressed JSON in `lighthouse/`; full per-run metrics, settings and ranges are in `performance-summary.json`.

## Regression and scope checks

- `npm run build`: passed after final source changes (10 pages plus sitemap).
- `npm run check`: passed; existing placeholder-domain warning retained.
- `npm test`: passed. This repository's test command invokes the same release validator as `check`; it is not an independent browser test suite.
- `git diff --check`: passed.
- Nine HTTP 200 routes: `/`, `/about/`, `/work/`, `/work/dazlab/`, `/work/mortar/`, `/work/handl/`, `/work/tangilla/`, `/contact/`, `/contact/success/`.
- 62 referenced local URLs (routes, images, fonts, CSS, responsive variants): all 200. `scope-and-http.json` records results.
- All nine pages' title/meta/canonical/JSON-LD output matches baseline exactly. Rendered text matches after normalizing only the approved hero-label replacement.
- All 64 existing built image/font/JavaScript assets match baseline SHA-256 checks. Hero and header inline modules also match byte-for-byte.
- `netlify.toml`, security/CSP/cache policy, noindex, robots, layout metadata, contact implementation, professional data and all four case studies are untouched. Existing CSP allows inline styles, including the new no-script fallback. Local measurement servers do not emulate hosted headers; actual hosted header/CSP verification awaits an automatic preview or approved deployment.
- Existing `audit/ald-106/` untracked work was preserved and excluded from this PR.

## Remaining concerns / approval gates

1. ChatGPT and user visual/content review; no issue is marked Done on implementation alone.
2. Firefox and WebKit/Safari verification on available engines/devices.
3. Dazlab mobile LCP above target; field INP/data unavailable.
4. ALD-109 production event/deployment blocker remains unresolved and independent of this Sprint. No workflow dispatch, manual deployment or configuration change was made.
5. Existing placeholder canonical/noindex configuration and provisional screenshot reuse-rights concerns remain unchanged. Public visibility is not evidence of a reuse license or endorsement.
6. No production merge/deployment is authorized by this PR. No DNS/domain, Sanity, contact submission or unrelated content changes.
