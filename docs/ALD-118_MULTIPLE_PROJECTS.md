# ALD-118 — multiple local projects

Focused follow-up on draft integration PR #13. Production behavior and account configuration are unchanged.

- Removed the one-document and `sample-project` slug restrictions. Every valid published project from `p9xrr86a/ald118-test` is added to existing static projects, dynamic routes, Work listing and sitemap.
- Duplicate IDs/slugs, reserved/unsafe slugs and collisions with the four static case-study routes fail closed. Required-field errors identify the project, document ID and field; invalid records are not silently omitted.
- Each project gets its own local image path. PNG/JPEG/WebP delivery checks MIME, signature, dimensions, dataset boundary and the existing size limit. Informative images require alt text; explicitly decorative images use empty alt text, matching the existing schema.
- Reused the existing editor schema, normalizer utilities and renderers. The local hook moved from the config wrapper into the existing local adapter so real and offline builds test the same route/media behavior. No new framework or abstraction layer.

## Verification

- **51/51 content tests passed**, including network-free builds with 0 → 1 → 2 → 1 → 0 published projects, independent image files and stale route/listing/sitemap/image removal. Existing static projects remain throughout.
- Actual local GROQ query evaluated against published/draft/version records: only published records returned. Live reader keeps explicit `published` perspective and uncached reads.
- Actual read-only build against the existing dataset succeeded with **MCFLY Industries** and **Synthetic sample project — Studio edited**. Both routes, Work listing and sitemap verified; MCFLY JPEG and sample PNG have distinct files. `/work/mcfly-industries/` and its image returned HTTP 200 on localhost:4323.
- MCFLY's image is explicitly decorative and has approved rights; its missing alt value is valid for that setting. No incomplete required fields or live validation errors were found. No documents/assets were edited, published, unpublished or created for this verification.
- **81/81 default static file hashes match** the recorded main baseline. Existing release validator passed with the retained placeholder-domain warning. Focused validation tests were rerun after adding decorative-alt coverage.
- Zero/one/removal verification uses offline fixtures because live document changes were forbidden. Existing published test documents remain as found. No Studio rebuild/browser matrix/security re-audit was needed for this adapter-only fix; existing release blockers remain open.

## Build locally

From the repository root in a dedicated PowerShell terminal:

```powershell
$env:CONTENT_SOURCE='static'
$env:CONTENT_LOCAL_TEST='1'
$env:SANITY_PROJECT_ID='p9xrr86a'
$env:SANITY_DATASET='ald118-test'
npm run build -- --config astro.local.config.mjs
```

Refresh http://localhost:4323/work/mcfly-industries/ after rebuilding. The existing preview serves the same local output directory. Ordinary static builds remain `npm run build` without the local-test flags.

PR #13 stays draft and ALD-118 In Progress. The PR title and follow-up commit include `[skip netlify]` to suppress deployment automation while GitHub tests run. No merges/deployments, production changes, Netlify settings, credentials, permissions, CORS, test-content modifications or contact submissions. PR #7, ALD-109 restrictions and pre-existing untracked audit files remain preserved.
