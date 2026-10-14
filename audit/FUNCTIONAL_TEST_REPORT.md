# Functional Test Report

Audit date: 2026-10-13

## Tests Executed

Browser automation was used against the local preview at `http://127.0.0.1:4322/`.

Logs:

- `audit/logs/sprint-functional-tests-final.json`
- `audit/logs/sprint-nav-smoke-final.json`
- `audit/logs/sprint-resize-close-test.json`
- `audit/logs/sprint-responsive-matrix-post-final.json`

## Navigation Tests

| Test | Result |
| --- | --- |
| Mobile hamburger opens menu | Passed |
| `aria-expanded` updates on open | Passed |
| Mobile link navigates and closes menu | Passed |
| Escape closes menu | Passed |
| Close button closes menu | Passed |
| Backdrop/outside-menu close | Passed through explicit backdrop button |
| Resize from mobile to desktop closes menu | Passed through desktop guard |
| Desktop Work navigation link works | Passed |

## Interaction Tests

| Area | Result |
| --- | --- |
| Hero CTA links | Present and included in route link checks. |
| Selected Work links | Dazlab internal case-study link works; Mortar, Handl, Tangilla primary links now go to valid external URLs. |
| Workflow anchors | Mobile nav `Workflow` link navigated to `/#workflow`. |
| Services anchors | Nav link points to `/#expertise`. |
| About links | Header/footer About links route to `/about/`. |
| Contact controls | Scope radio, name input, email input, and textarea were filled through automation without submitting. |
| Contact form validation | Required fields and email input type are present; native `form.checkValidity()` could not be used in this browser sandbox, so field constraints were verified directly. |
| External links | Hrefs are present with `target="_blank"` and `rel="noopener noreferrer"` where rendered by project card external links. |

## Limitations

- No real contact inquiry was submitted.
- The browser sandbox redacts email field values during page evaluation, so the report records constraint presence and manual field interaction rather than a native validity score.
- Lighthouse and axe/pa11y were unavailable locally.

