# ALD-109 performance evidence

Baseline: `afe094574663f5bebdc289687eb695094d7517c4`. Final candidate: this branch. Tested 2026-10-15 (UTC+8). No merge or manual deployment.

## Comparable local Lighthouse measurements

Two sequential cold-browser runs per page/mode and version, Lighthouse 13.5.0, HeadlessChrome 155, Windows, Node 24.14.0. Median of two values (their midpoint); small sample, not a statistical confidence interval. Baseline main build preserved at port 4323; candidate at 4324, using the same local static server, gzip for text, no-store responses, fresh Chrome and default storage reset. Network and CPU are simulated with Lighthouse defaults, not actual production latency. Mobile: 412×823, DPR 1.75, RTT 150 ms, 1638.4 Kbps, CPU 4×. Desktop uses the stock desktop preset; exact settings/environment, timestamps and ranges are in measurements.json. Browser flags: --headless=new --no-sandbox --disable-gpu. Sequential runs, no simultaneous Lighthouse processes.

Each cell is **before → after**. FCP/LCP/Speed Index in seconds, TBT in milliseconds, bytes in decimal kB.

| Page | Mode | Score | FCP | LCP | CLS | TBT | Speed Index | Transfer kB | Images kB | External JS kB |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| home | mobile | 77.5 → 99 | 2.63 → 0.91 | 5.98 → 2.19 | 0.0051 → 0.0051 | 0.0 → 29.8 | 2.67 → 0.91 | 19376.78 → 287.06 | 19284.23 → 194.48 | 0.00 → 0.00 |
| home | desktop | 98 → 100 | 0.73 → 0.34 | 0.91 → 0.47 | 0.0008 → 0.0008 | 0.0 → 0.0 | 1.22 → 0.86 | 19378.06 → 288.33 | 19285.50 → 195.76 | 0.00 → 0.00 |
| work | mobile | 82 → 100 | 2.01 → 1.28 | 30.13 → 1.73 | 0.0218 → 0.0224 | 0.0 → 0.0 | 2.10 → 1.28 | 18985.24 → 219.23 | 18897.91 → 131.97 | 0.00 → 0.00 |
| work | desktop | 75 → 100 | 0.71 → 0.33 | 11.38 → 0.39 | 0.0014 → 0.0014 | 0.0 → 0.0 | 0.71 → 0.33 | 18985.24 → 219.23 | 18897.91 → 131.97 | 0.00 → 0.00 |
| dazlab | mobile | 71 → 96 | 2.63 → 1.36 | 44.48 → 2.71 | 0.0000 → 0.0000 | 0.0 → 0.0 | 2.71 → 1.36 | 13594.74 → 357.98 | 13506.79 → 270.09 | 0.00 → 0.00 |
| dazlab | desktop | 75 → 100 | 0.71 → 0.33 | 7.34 → 0.71 | 0.0009 → 0.0009 | 0.0 → 0.0 | 0.71 → 0.33 | 13594.74 → 532.35 | 13506.79 → 444.46 | 0.00 → 0.00 |
| about | mobile | 94 → 99 | 2.00 → 1.36 | 2.61 → 1.43 | 0.0538 → 0.0538 | 0.0 → 0.0 | 2.07 → 1.36 | 124.63 → 124.24 | 37.39 → 37.39 | 0.00 → 0.00 |
| about | desktop | 99 → 100 | 0.70 → 0.33 | 0.70 → 0.33 | 0.0087 → 0.0087 | 0.0 → 0.0 | 0.70 → 0.33 | 112.43 → 112.04 | 25.19 → 25.19 | 0.00 → 0.00 |

### Variability (min–max across the two runs)

| Page | Mode | Before score | After score | Before LCP seconds | After LCP seconds | Before Speed Index seconds | After Speed Index seconds |
|---|---|---:|---:|---:|---:|---:|---:|
| home | mobile | 72–83 | 99–99 | 4.07–7.89 | 2.19–2.19 | 2.62–2.73 | 0.91–0.92 |
| home | desktop | 98–98 | 100–100 | 0.91–0.91 | 0.47–0.47 | 1.17–1.27 | 0.86–0.87 |
| work | mobile | 75–89 | 100–100 | 3.14–57.13 | 1.73–1.73 | 1.40–2.80 | 1.21–1.36 |
| work | desktop | 75–75 | 100–100 | 11.36–11.40 | 0.39–0.39 | 0.70–0.71 | 0.33–0.33 |
| dazlab | mobile | 71–71 | 96–96 | 44.45–44.50 | 2.71–2.71 | 2.71–2.72 | 1.36–1.36 |
| dazlab | desktop | 75–75 | 100–100 | 7.11–7.57 | 0.70–0.71 | 0.70–0.72 | 0.33–0.33 |
| about | mobile | 92–96 | 99–99 | 2.60–2.61 | 1.43–1.43 | 1.40–2.74 | 1.36–1.36 |
| about | desktop | 99–99 | 100–100 | 0.70–0.70 | 0.33–0.34 | 0.70–0.70 | 0.33–0.34 |

Large PNGs coincided with unstable baseline LCP estimates; inspect ranges before interpreting the median. No external JS requests in these static local builds; existing inline navigation and hero scripts are unchanged (3,325 uncompressed inline JS bytes on the homepage) and are accounted for in HTML bytes. Homepage mobile TBT rises from 0 to 29.8 ms; other measured pages remain at 0. Work mobile CLS changes slightly from 0.0218 to 0.0224; other comparable CLS values are unchanged. Lab TBT is not INP. Field CWV/INP unavailable: PageSpeed API returned HTTP 429.

## Deployed baseline (context only, one run per page/mode)

These are live Netlify baseline runs, not paired with the local candidate. Do not claim a production improvement by comparing these scores with local results.

| Page | Mode | Score | FCP s | LCP s | CLS | TBT ms | Speed Index s | Transfer kB |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| home | mobile | 64 | 3.13 | 5.02 | 0.0000 | 430.0 | 3.47 | 19412.68 |
| home | desktop | 90 | 1.14 | 1.41 | 0.0008 | 1.0 | 1.93 | 19413.94 |
| work | mobile | 60 | 3.15 | 25.22 | 0.0218 | 199.0 | 7.06 | 19021.02 |
| work | desktop | 68 | 1.10 | 8.58 | 0.0009 | 0.0 | 2.38 | 19021.03 |
| dazlab | mobile | 83 | 2.87 | 2.87 | 0.0028 | 110.5 | 7.16 | 13627.67 |
| dazlab | desktop | 69 | 1.08 | 4.49 | 0.1115 | 0.0 | 2.06 | 13627.65 |
| about | mobile | 91 | 2.76 | 2.76 | 0.0028 | 0.0 | 2.76 | 139.90 |
| about | desktop | 98 | 0.88 | 0.88 | 0.0097 | 0.0 | 0.88 | 138.10 |

## Changes and validation

- Generated 30 content-hashed WebPs from the original assets: top 16:10 card crops at 480/800/1200 px, full-height case-study images at 480/960/1440/1920 px, hero at 320/512 px. Original PNGs retained. Hero is now actual WebP (original .webp was PNG). Hero 512 px payload: 383,856 → 60,060 bytes.
- Added srcset/sizes and intrinsic dimensions; retained card lazy loading and hero eager/async/high fetch priority; case-study hero is eager. No animation or navigation JS edits, no added dependencies.
- Self-hosted the exact measured Inter/JetBrains Mono WOFF2 binaries, weights, glyph subsets and font-display: swap, with OFL licenses. Removed external Google stylesheet/connection dependency.
- Rejected font preloads after repeated mobile homepage trials delayed Speed Index to ~3.5 s; removing preloads restores it to ~0.9 s. Rejected trials are excluded from final medians.
- Immutable caching applies only to generated content-hashed image/font paths and Astro hashed output. Existing CSP/security headers and preview/branch noindex configuration retained exactly. Local test server does not emulate Netlify headers: preview response checks are recorded separately.
- npm run build, npm run check, npm test passed. Existing placeholder-domain warning remains, as domain/noindex changes are excluded. npm test currently runs the repository release validator; it is not a browser end-to-end test suite.
- Regression guard: 30 image hashes/formats, 13 font hashes, nine routes and 21 referenced optimized image requests returned 200. Hero script, reduced-motion CSS, global styles, card/case-study CSS, contact form, professional content and all four case-study content sources unchanged.
- Compared homepage, Work, Dazlab and About at 390/1440 px, then checked tablet at 768 px; checked Mortar/Handl/Tangilla at all three widths. No overflow, broken above-fold images, changed crop, heading geometry or typography observed. Work thumbnails and Handl related cards load when reached. Navigation links, mobile menu open/close and menu navigation checked. No browser warning/error logs in local checks.
- Reduced-motion runtime verification passed at 412 px mobile and 1350 px desktop using Chrome's `--force-prefers-reduced-motion` and a read-only custom Lighthouse gatherer. It checks matchMedia, hero completion, portrait transform, active animation count, remaining panels and support visibility. Both: reduced=true, hero=is-complete, portrait=none, activeAnimations=0, panels=0, supportVisible=true. Main passes the same desktop check. See accessibility.json and raw reports. Existing hero animation script and reduced-motion rules are byte-identical to main.
- Lighthouse accessibility score is 100 and best-practices 96 on both baseline and candidate homepage in this separate check. It also reports an unscored accessible-name/visible-label mismatch on project outbound links and a missing `/favicon.ico` console 404. Both are confirmed on main and documented for follow-up; no unrelated accessibility/branding changes are included. The local CUA browser logs had no application warnings/errors; Lighthouse's favicon request is an explicit exception to a blanket clean-console claim.

## Visual evidence

| Page | Before desktop | After desktop | Before mobile | After mobile | After tablet |
|---|---|---|---|---|---|
| home | [image](visual/before-home-desktop.jpg) | [image](visual/after-home-desktop.jpg) | [image](visual/before-home-mobile.jpg) | [image](visual/after-home-mobile.jpg) | [image](visual/after-home-tablet.jpg) |
| work | [image](visual/before-work-desktop.jpg) | [image](visual/after-work-desktop.jpg) | [image](visual/before-work-mobile.jpg) | [image](visual/after-work-mobile.jpg) | [image](visual/after-work-tablet.jpg) |
| dazlab | [image](visual/before-dazlab-desktop.jpg) | [image](visual/after-dazlab-desktop.jpg) | [image](visual/before-dazlab-mobile.jpg) | [image](visual/after-dazlab-mobile.jpg) | [image](visual/after-dazlab-tablet.jpg) |
| about | [image](visual/before-about-desktop.jpg) | [image](visual/after-about-desktop.jpg) | [image](visual/before-about-mobile.jpg) | [image](visual/after-about-mobile.jpg) | [image](visual/after-about-tablet.jpg) |

## Limits and remaining concerns

Two-run samples on one Windows machine are directional lab evidence. Netlify preview/production network behavior can differ; no production performance claim or field INP result is established. Remaining render-blocking CSS is small (~5.5 kB combined homepage transfer); remaining font transfer ~80 kB, tall case-study images and preserved desktop hero animation are the main bottlenecks. No extra architectural changes were justified. Original screenshots and provisional rights notes are retained; publicly visible imagery is not described as licensed or endorsed. Screenshots contain existing product/metric/testimonial content subject to the ALD-101 permission review.

Raw reports are gzip JSON in lighthouse/; decompress to inspect or import into Lighthouse Viewer. measurements.json contains exact settings, resource bytes, timing samples, ranges and render-blocking entries. Source references: [Astro images](https://docs.astro.build/en/guides/images/), [Lighthouse scoring and variability](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).
