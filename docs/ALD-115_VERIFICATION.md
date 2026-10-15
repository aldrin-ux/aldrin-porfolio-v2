# ALD-115 verification — local Studio setup

Date: 15 October 2026 (UTC+8). Branch: `ald-115-sanity-studio-setup`.

Base: current main `88532ad18215c064a14e2824ec9f90b0e513d482`, the merged PR #6. PR #7 was verified open and unmerged at `188533bb8a7327ec431c8ebb1e7dffcf7ef264ea`; none of its changes are included. Pre-existing untracked `audit/ald-106/` is preserved and excluded.

## Implementation

- Separate `studio/` package and lockfile; no root package/workspace, Astro source or Netlify build changes.
- Sanity 6.19.0, Sanity UI 4.4.6, React/React DOM 19.3.1, styled-components 6.6.0; TypeScript 7.0.2. Studio requires Node ≥22.12; verification used Node 24.14.0/npm 11.12.0. Astro's existing Node 20 CI/hosting configuration is untouched.
- Required public configuration: `SANITY_STUDIO_PROJECT_ID=p9xrr86a`, `SANITY_STUDIO_DATASET=production`, in ignored `studio/.env.local`. Studio and CLI share the same checked target.
- Title: Portfolio V2 CMS. Standard Sanity authentication, no custom provider or bypass.
- Four informational setup panels and organized schema directories; zero registered content schemas and no fake content/documents. The user subsequently confirmed successful sign-in and access to the four setup areas.
- Reviewed lockfile versions are used; Studio automatic updates are explicitly disabled through the supported CLI configuration. This does not publish or register a hosted Studio.

## Checks performed

| Check | Result |
| --- | --- |
| `npm --prefix studio install --no-fund` | Passed; independent lockfile created. Dependency advisories below. |
| `npm --prefix studio run check` | Passed after final configuration changes. |
| `npm --prefix studio run build` | Passed after final configuration changes; local `studio/dist/` only. Build reports only the two public identifier variables as exposed environment values. |
| `npm --prefix studio run dev` | Started at `http://localhost:3333/`, bound to localhost. |
| Browser | Portfolio V2 CMS standard login screen; Google, GitHub and email/password providers. All login URLs include `projectId=p9xrr86a` and localhost origin. No warning/error console messages observed. |
| Authentication / dataset access | **User-confirmed successful sign-in and access to the four setup areas.** Evidence: the user's response “Signed in successfully” to the local sign-in/four-areas verification question. This does not independently audit project roles, dataset visibility or Content Lake read/write permissions. No credentials were requested or supplied. |
| Configuration guards | Missing variables rejected; wrong project rejected; approved project/dataset accepted. See [config guard evidence](ald-115/config-guard.json). |
| `npm run build` | Passed: existing Astro public pages, 404 and sitemap generated. |
| `npm run check` | Passed; existing `https://example.com` placeholder-domain warning retained. |
| `npm test` | Passed. This command runs the same release validator as `check`, not a separate browser suite. |
| Astro output parity | **81/81 generated files byte-identical** to the verified pre-Sprint main baseline, including all nine public routes, metadata/JSON-LD, optimized image/font files, styles, scripts, robots and sitemap. See [SHA-256 parity results](ald-115/astro-parity.json). |
| Protected source scope | No diff to `src/`, `public/`, root package/lockfile, Astro config, Netlify config or GitHub workflow. |
| Git/secret scope | Local environment, generated output, dependencies, `.sanity/` and representative token files excluded by `git check-ignore`. Only the public `.env.example` is eligible for commit. No API tokens or authentication credential files were created or included. |

The local login screenshot is [studio-login.jpg](ald-115/studio-login.jpg), captured before the user's successful sign-in confirmation. Authentication and setup-area access are user-confirmed; production dataset read/write permissions, roles and visibility have not been separately tested. No content operation was used to verify access.

## Dependency security findings

`npm --prefix studio audit --json` reports **17 advisory-affected dependency entries: 9 high, 8 moderate, 0 critical**. See the [raw audit report](ald-115/npm-audit.json). These counts include propagated dependency entries and are not 17 distinct root vulnerabilities.

Affected transitive paths include Sanity's CLI/code-generation/runtime packages, file/glob matching, YAML/TOML parsers, and UUID tooling. Root causes reported include `braces`, `js-yaml`, `smol-toml`, `sprintf-js` and `uuid`; parent entries such as `sanity` and `@sanity/cli` also appear due to propagation. The install additionally warns that transitive `uuid@10` is deprecated.

The selected `sanity@6.19.0` was the registry's current stable release at inspection. npm's proposed automatic remediation is a **semver-major downgrade to Sanity 5.14.1**, not a compatible patch upgrade. No `audit fix --force`, unsupported major transitive override, authentication bypass or security-header relaxation was applied. The advisories remain unresolved and require dependency-risk review/upstream follow-up before any hosted Studio release. A localhost-only setup and the unchanged Astro dependency tree limit scope; they do not prove the findings are harmless.

## Manual verification and review gates

1. **Completed by user confirmation:** sign in at localhost with the existing Sanity account and open the four setup areas. Config remains scoped to `p9xrr86a` / `production`. No document creation/editing/publishing was requested for verification.
2. Review existing dataset visibility, editor roles and exact localhost CORS configuration in Sanity Manage. This PR does not change any of them, invite users or grant access. If sign-in/origin access is blocked, report the error and have the owner review the specific setting; no wildcard or auth bypass.
3. Review dependency advisories and the setup PR. ALD-115 stays **In Progress** until review; sign-in is not inferred from a successful build.
4. ALD-109's automatic production deployment remains unresolved. No merge, hosted Studio publishing, production environment/DNS/canonical/noindex change, webhook, schema deployment, migration or contact submission was performed.

The installation guide and remaining ALD-114 / ALD-116–119 task boundaries are in [SANITY_SETUP.md](SANITY_SETUP.md).
