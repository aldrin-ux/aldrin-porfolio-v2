# Portfolio V2 CMS — local Sanity Studio

ALD-115 sets up a standalone Studio in `studio/`. It uses the existing Sanity project **`p9xrr86a`**, dataset **`production`**, and title **Portfolio V2 CMS**. It does not create a project/dataset, migrate documents, or connect Astro's public pages to Sanity.

## Location and structure

```text
studio/
  package.json, package-lock.json  # Independent dependencies; not an npm workspace
  sanity.config.ts                # Studio, authentication defaults, structure and schemas
  sanity.cli.ts                   # Same project/dataset for local CLI commands
  tsconfig.json                   # Strict TypeScript check
  .env.example                    # Public identifiers only
  config/environment.ts           # Required identifiers; rejects a different target
  structure.tsx                   # Four read-only setup panels
  components/setup-notice.tsx      # Setup status, not a content document
  schemaTypes/
    index.ts                      # Empty registration until model approval
    documents/                    # Future settings, projects/case studies, experience
    objects/                      # Future reusable nested content
    blocks/                       # Future reusable/rich-text blocks
```

Studio has its own lockfile. Root `package.json`, root lockfile, Astro routes and Netlify workflow/build settings are unchanged. Root `npm ci` and `npm run build` do not install or build Studio. Studio build output stays in ignored `studio/dist/`; it is not copied into Astro's `dist/`.

## Requirements and local installation

Use **Node.js 22.12 or newer** for Studio (verified locally with Node 24.14.0). Astro's existing hosting/CI Node 20 configuration is separate and unchanged. Runtime packages are the official `sanity`, `@sanity/ui`, React/React DOM and styled-components; TypeScript and type declarations are development dependencies.

From the repository root:

```powershell
npm --prefix studio ci
Copy-Item studio/.env.example studio/.env.local
npm --prefix studio run dev
```

Copy the template only if `studio/.env.local` does not already exist; preserve any local configuration. The exact startup command is **`npm --prefix studio run dev`**. Open **http://localhost:3333**. The development server binds to localhost; it is not a hosted Studio or production deployment.

Other local checks:

```powershell
npm --prefix studio run check
npm --prefix studio run build
npm run build
npm run check
npm test
```

`studio`'s build command only generates local static files. No deploy script, publishing webhook, hosted Studio app ID or CI Studio deployment is configured.

## Public environment configuration

Set these in **`studio/.env.local`**, not the root Astro environment:

```dotenv
SANITY_STUDIO_PROJECT_ID=p9xrr86a
SANITY_STUDIO_DATASET=production
```

Both identifiers are public, not credentials. Every `SANITY_STUDIO_*` value can be included in browser JavaScript, so **never use that prefix for API tokens, passwords or other secrets**. Config references are static to support Sanity's build-time replacement. The config fails clearly if identifiers are missing or point elsewhere.

## Sign-in and access verification

1. Start Studio and use its standard **Sanity sign-in** screen with the user's existing account. No custom authentication provider or authentication bypass is installed.
2. The account must already be a member of project `p9xrr86a`. Confirm this in [Sanity Manage](https://www.sanity.io/manage). Dataset visibility does not grant editing access: authenticated project permissions control writes, even if a dataset permits public reads.
3. Confirm the project ID and `production` dataset in Manage, then compare with `studio/.env.local`. After signing in, the setup panels also display the configured target.
4. Studio navigation reserves Site settings, Projects and case studies, Professional experience, and Reusable content blocks. These are informational panels; no editable document types or sample data are present yet.
5. If Sanity blocks the local origin, the project owner must review the exact **http://localhost:3333** CORS origin and credential setting in Manage. Do not use a wildcard, disable authentication or change dataset visibility to work around an error. This PR does not modify project CORS or access settings.
6. If the account lacks project access, the owner must review membership and the least-privileged appropriate role available on their plan. No members are invited and no roles or permissions are changed by this setup.

Normal interactive Studio sign-in uses the user's Sanity session; **no API token is required** for this setup. No credential needs to be pasted into Codex, GitHub or Linear. If a later separately approved server-only integration needs a token, the owner should create a suitably scoped token in Manage and store it in an ignored local secret file/server environment or the host's protected secret store. Do not put it in Studio's browser-exposed variables or this repository. Token creation and production environment changes are outside ALD-115.

Authentication verification is recorded in `docs/ALD-115_VERIFICATION.md`. A working local server or successful build alone does not prove successful account login, dataset access or correct user roles.

## Adding future schemas

Implement schemas only after ALD-114's model/mapping is approved. Add document definitions under `schemaTypes/documents/`, reusable nested definitions under `objects/`, and blocks under `blocks/`. Use Sanity's `defineType`/`defineField`, export each reviewed type through `schemaTypes/index.ts`, and replace the corresponding read-only navigation panel in `structure.tsx` with the approved document/list view. Ordinary documents should receive Sanity-generated IDs; singleton behavior and IDs must be designed explicitly.

Do not add placeholder portfolio claims, invented dates, metrics, testimonials or image permissions. No creation, migration, publishing or deletion of Content Lake documents is part of this PR.

## Security and limitations

- `.env` and `.env.*` are ignored at all directory levels, with `.env.example` explicitly allowed. Local credentials belong in ignored `secrets/` or `local-secrets/` if ever needed.
- `.sanity/`, common Sanity token filenames, `*.token` and `tokens.json` are ignored; generated `dist/`, dependencies and caches are ignored. Sanity CLI authentication, if the user later uses it, belongs in its normal user-profile storage, not the repository.
- Studio uses standard authenticated editor access; backend project membership/roles remain authoritative. This is not an assertion that dataset visibility is private or that permissions have already been verified.
- A local Studio targets the real `production` Content Lake. The current empty schema and read-only panels create no documents; future editor actions can write to that dataset and require separate authorization.
- No API token, public-site Sanity client, Astro integration, Vision query tool, webhook, hosted Studio publishing or production environment change is included.
- Existing noindex/canonicals, SEO/JSON-LD, contact form, security headers, optimized media/fonts and static professional content remain unchanged.
- PR #7 remains separate and unmerged. ALD-109's production deployment gate remains unresolved. This CMS setup must not be merged or deployed without separate approval.

## Next issues (not implemented here)

| Issue | Follow-up |
| --- | --- |
| [ALD-114](https://linear.app/aldrin-workspace/issue/ALD-114/r2-design-sanity-content-model-and-migration-mapping) | Design the content model and map existing content, slugs and URLs. |
| [ALD-116](https://linear.app/aldrin-workspace/issue/ALD-116/r2-implement-sanity-schemas-and-content-validation) | Implement reviewed schemas, validations, references, SEO and image-alt requirements. |
| [ALD-117](https://linear.app/aldrin-workspace/issue/ALD-117/r2-integrate-astro-with-sanity-and-preserve-static-urls) | Add approved Astro build-time queries while preserving URLs/fallbacks. |
| [ALD-118](https://linear.app/aldrin-workspace/issue/ALD-118/r2-migrate-static-projects-and-validate-parity) | Migrate approved content/media and validate parity; no invented claims or assumed reuse rights. |
| [ALD-119](https://linear.app/aldrin-workspace/issue/ALD-119/r2-preview-publishing-workflow-and-cms-release-qa) | Design preview/publishing, permissions, rebuild triggers, regression QA and rollback under separate approval. |

References: [Sanity installation](https://www.sanity.io/docs/studio/installation), [public environment-variable behavior](https://www.sanity.io/docs/studio/environment-variables), [Studio configuration](https://www.sanity.io/docs/studio/configuration).
