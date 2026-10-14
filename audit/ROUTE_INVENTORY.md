# Route Inventory

Audit date: 2026-10-13

## Local Application

- Project directory: `E:\Desktop\Digitalikha\Digitalikha\Portfolio\portfolio-v2-astro`
- Framework: Astro
- Correct development command from `package.json`: `npm run dev`
- Build command: `npm run build`
- Preview command: `npm run preview`
- Local audit URL used for browser checks: `http://127.0.0.1:4322/`

## Required Routes

| Route | Source file | Browser result | Notes |
| --- | --- | --- | --- |
| `/` | `src/pages/index.astro` | Loaded | Homepage screenshot captured at desktop and mobile. |
| `/work/` | `src/pages/work/index.astro` | Loaded | Work archive screenshot captured at desktop and mobile. |
| `/work/dazlab/` | `src/pages/work/dazlab.astro` | Loaded | Dazlab case-study screenshot captured at desktop and mobile. |
| `/about/` | `src/pages/about.astro` | Loaded | About screenshot captured at desktop and mobile. |
| `/contact/` | `src/pages/contact.astro` | Loaded | Contact screenshot captured at desktop and mobile. |

## Implemented Case-Study Routes

Only one dedicated case-study route is implemented:

- `/work/dazlab/`

The structured project data in `src/content/site.ts` contains four projects:

| Project | Slug | Internal href | External URL | Dedicated case-study route? |
| --- | --- | --- | --- | --- |
| Dazlab | `dazlab` | `/work/dazlab/` | `https://dazlab.digital/` | Yes |
| Mortar | `mortar` | `/work/` | `https://mortar.design/` | No |
| Handl | `handl` | `/work/` | `https://handl.works/` | No |
| Tangilla | `tangilla` | `/work/` | `https://tangilla.com/` | No |

## Screenshot Inventory

Screenshots were captured with browser automation at the requested sizes:

| Route | Desktop 1440 x 900 | Mobile 390 x 844 |
| --- | --- | --- |
| Homepage | `audit/screenshots/home-desktop.png` | `audit/screenshots/home-mobile.png` |
| Work Archive | `audit/screenshots/work-desktop.png` | `audit/screenshots/work-mobile.png` |
| Dazlab Case Study | `audit/screenshots/dazlab-desktop.png` | `audit/screenshots/dazlab-mobile.png` |
| About | `audit/screenshots/about-desktop.png` | `audit/screenshots/about-mobile.png` |
| Contact | `audit/screenshots/contact-desktop.png` | `audit/screenshots/contact-mobile.png` |

Raw screenshot metadata is saved in `audit/logs/screenshot-capture.json`.

