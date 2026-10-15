# ALD-115 dependency and access review

15 October 2026. PR #8 remains open; ALD-115 remains In Progress. This review supersedes the unchanged 17-entry audit snapshots in the earlier verification report. No merge, hosted Studio publication, manual deployment, account change or Content Lake write was performed.

## Compatible remediation and results

The original Studio audit contained 17 affected package entries (9 high, 8 moderate), propagated from five package families / eleven distinct advisory URLs. A scoped override under `@vercel/frameworks@3.29.0` updates its exact-pinned `js-yaml` from 3.13.1 to **3.15.2** and `smol-toml` from 1.5.2 to **1.9.1**. Both stay within their existing major versions. No direct runtime package changes, forced audit fixes or major downgrades were applied.

The resulting audit contains **16 affected entries: 7 high, 9 moderate, 0 critical**, originating from three distinct advisories in three families. Eight advisory causes were removed: five YAML and three TOML findings. `js-yaml` now appears only through its legacy `argparse` → `sprintf-js` chain; removing its own advisories therefore does not remove its affected-parent entry. Counts are affected-package entries, not counts of independent exploits.

The parent package pins old parser versions exactly, so npm could not resolve these fixes normally. The narrow overrides are explicit maintenance obligations: remove them when an upstream framework/CLI release supplies compatible patched parsers, rerun the actual-caller compatibility test and build, and regenerate the audit. The lockfile changes only the YAML version/integrity and removes the obsolete nested TOML package in favor of the existing 1.9.1 copy.

Evidence: [before audit](ald-115/studio-audit-recheck.json), [after audit](ald-115/studio-audit-after-compatible-fixes.json), [deduplicated review and source-map findings](ald-115/security-review.json), [actual framework-reader regression test](../studio/scripts/check-config-parsers.mjs).

## All original affected entries

Only `sanity` is a direct Studio dependency; every other entry below is transitive. These CLI dependencies are installed beneath a runtime dependency and npm classifies them as production dependencies. Operational use in development/build tooling does **not** mean they are devDependencies or disappear with `--omit=dev`.

| Package | Original → remaining severity | Root cause / dependency path | Operational exposure and action |
| --- | --- | --- | --- |
| `sanity@6.19.0` (direct) | Moderate → moderate | `sanity` → `@sanity/cli` and propagated graph | Browser editor plus separate CLI exports. Keep pinned; upstream review required. |
| `@sanity/cli` | High → high | CLI → codegen / frameworks / typeid and other CLI parents | Local CLI/build; not observed in generated browser sources. Await upstream fixes. |
| `@sanity/cli-build` | Moderate → moderate | Propagated `sanity` dependency | Build tooling; inherited/cyclic audit propagation is not another root advisory. |
| `@sanity/codegen@8.2.0` | High → high | CLI → codegen → chokidar/globby → braces | Local generation/glob processing; avoid untrusted inputs, track upstream. |
| `@sanity/runtime-cli` | Moderate → moderate | CLI → runtime-cli → cli-build | CLI tooling; inherited finding. |
| `@vercel/frameworks@3.29.0` | Moderate → moderate | CLI → frameworks → YAML/TOML; remaining YAML → argparse → sprintf-js | Local config reader; patched parsers tested against this actual caller. |
| `argparse` | Moderate → moderate | frameworks → js-yaml → argparse → sprintf-js | Local parser/CLI support; await compatible upstream replacement. |
| `braces@3.0.3` | High → high | codegen → chokidar / globby → fast-glob → micromatch → braces | Glob parser; no patched stable release identified. |
| `chokidar@3.6.0` (affected nested instance) | High → high | codegen → chokidar → glob matching → braces | File watching/local CLI; inherited finding. |
| `fast-glob` | High → high | codegen → globby → fast-glob → micromatch → braces | Local file selection; inherited finding. |
| `globby` | High → high | codegen → globby → fast-glob | Local file selection; inherited finding. |
| `js-yaml@3.13.1` → `3.15.2` | High → moderate | frameworks → js-yaml; now only argparse → sprintf-js | Five own advisory causes fixed; inherited sprintf finding remains. |
| `micromatch` | High → high | globby / chokidar → micromatch → braces | Glob parsing; inherited finding. |
| `smol-toml@1.5.2` → `1.9.1` | High → removed | frameworks → smol-toml | Three own advisory causes fixed; no remaining audit entry. |
| `sprintf-js@1.0.3` | Moderate → moderate | js-yaml → argparse → sprintf-js | Formatting precision input can exhaust resources; no patched compatible stable release identified. |
| `typeid-js@1.2.0` (affected root instance) | Moderate → moderate | CLI → typeid-js → uuid@10 | Actual caller uses v7 and stringify; do not treat reduced observed reachability as proof of safety. |
| `uuid@10` (nested under root typeid-js) | Moderate → moderate | `node_modules/typeid-js/node_modules/uuid` | Fix requires major ≥11.1.1 outside parent `^10`; defer breaking override. |

## Root advisories, applicability and next action

- **Braces:** [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), deeply nested glob input can exhaust the stack. Advisory covers installed 3.0.3 and lists no patched version. Upstream removal/replacement needs compatibility review, not an arbitrary override.
- **sprintf-js:** [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c), excessive formatting precision can cause denial of service. Latest inspected 1.1.3 remains affected; no compatible patched stable release identified. Trace/remediate the legacy argparse caller upstream.
- **uuid:** [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), v3/v5/v6 caller-provided buffer handling; patched at 11.1.1. The inspected affected TypeID caller uses v7 and stringify, not those APIs. This observation narrows demonstrated reachability, but does not dismiss the dependency advisory. Parent pins `^10`; do not force a major override without separate testing/approval.
- **Fixed YAML:** five URLs are preserved in the before/after JSON. The final required 3.x fix is [3.15.2, GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh). Earlier fixes cover unsafe inputs/prototype and parser resource issues. All five own findings disappear from the after audit.
- **Fixed TOML:** three URLs are preserved in the JSON. [GHSA-r4xh-jqrq-34v2](https://github.com/advisories/GHSA-r4xh-jqrq-34v2) covers quadratic parsing through 1.8.0, fixed at 1.9.0; selected 1.9.1 clears all three findings.

Registry/advisory state is time-specific. npm's blanket recommendation still proposes a major Sanity downgrade; this is not a safe automatic fix. Local-only operation limits exposure but does not establish harmlessness. Do not ingest untrusted config/glob inputs through the affected CLI. Before hosted/editor release, re-audit and review the remaining dependencies with the project owner; no release acceptance is asserted here.

## Browser versus CLI evidence

An additional local source-map build passed; **315 source maps** were inspected by source names only. Neither braces, sprintf-js, js-yaml, smol-toml, @vercel/frameworks, @sanity/cli nor @sanity/codegen was observed in the generated browser sources. The affected root `typeid-js@1.2.0` / nested `uuid@10` path was also absent. Browser source names instead identify `@sanity/telemetry/node_modules/typeid-js@0.3.0` (uses uuidv7) and uuid copies at 14.0.3 and 11.1.1, rather than the affected uuid@10 instance. Distinguish package instances; a package-name match alone cannot establish vulnerable code exposure.

This is a static generated-bundle observation, not a penetration test, full reachability proof or hosted Studio assessment. CLI/build dependencies remain installed and relevant locally. Maps and generated output are ignored and were not committed or published. Studio has no server-side application runtime or hosted deployment configured in this PR.

## Configuration, authentication and account review

| Check | Evidence / status |
| --- | --- |
| Correct project / dataset | Static shared environment guard requires `p9xrr86a` / `production`; missing/wrong identifiers rejected in five cases. No project or dataset created. |
| Authentication | Prior user-confirmed “Signed in successfully” response to sign-in/four-areas check. Standard Sanity authentication retained; no bypass or additional login requested. |
| Browser variables / credential exclusion | Only public project ID and dataset exposed in build. Local env, token filenames, dependencies and build output ignored; no API token created or included. |
| Project membership and least-privileged role | **Pending manual verification.** Existing sign-in does not independently establish exact role. |
| Production dataset visibility | **Pending manual verification.** No visibility change. |
| Credentialed Content Lake read/write permissions | **Pending manual verification.** No test documents or writes performed. |
| Exact localhost CORS origin and credential policy | **Pending manual verification.** No wildcard or origin changes. |
| Account token inventory / scope / rotation | **Pending manual verification.** No credential-store access, token creation or account-token inspection. |

These are deferred review items, not requests for interaction while the user operates remotely. Local source configuration cannot prove remote account settings.

## Validation and unchanged public portfolio

- Studio parser regression tests, TypeScript check, ordinary local build and extra source-map build passed. Tests exercise the actual framework config reader with YAML/YML anchors, TOML, JSON, absent/fallback filenames and invalid-input rejection, and assert the resolved patched versions.
- Astro `npm run build`, `npm run check`, `npm test` passed. Existing placeholder-domain warning remains. Root test aliases its release validator; it is not an independent browser suite.
- All **81 generated Astro files remain byte-identical** to main `88532ad18215c064a14e2824ec9f90b0e513d482`, with no added/removed output. This includes all nine public routes, optimized assets/fonts, animations, metadata, noindex, canonical settings, contact implementation and headers. No new visual browser test was performed or needed to establish byte parity; prior sign-in evidence is retained.
- No diff to public source/assets, root package/lockfile, Astro config, Netlify config or GitHub workflows. PR #7 remains excluded; untracked ALD-106 work is preserved.
- Existing independent Astro audit remains **3 affected entries (1 critical, 1 high, 1 low)** in Astro, Sharp and esbuild, unchanged from main. Its proposed Astro major upgrade requires separate remediation and regression planning. See [earlier root audit](ald-115/astro-audit-recheck.json); Studio overrides do not fix or introduce these findings.

Remaining blockers: review the three Studio advisory families, separately plan existing Astro remediation, and complete the explicitly deferred account checks when possible. ALD-115 stays **In Progress** pending review; no merge/deployment approval is implied.
