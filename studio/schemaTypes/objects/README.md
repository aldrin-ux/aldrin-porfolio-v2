# Shared and portfolio objects

`models.ts` contains SEO, links, media/rights, attribution, embedded case studies and supporting objects. `sections.ts` contains the eight bounded section types. Shared entities use references; document-owned content stays embedded. No arbitrary HTML, styling controls, performance claims or private permission evidence fields are modeled. Field helpers explicitly preserve shared validators when field-level required rules would otherwise replace type validation.
