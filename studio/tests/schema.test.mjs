import assert from "node:assert/strict";
import { test } from "node:test";
import { createSchema, validateDocument } from "sanity";
import { getFallbackLocaleSource } from "@sanity/validation/_internal";
import { parse, evaluate } from "groq-js";
import { from } from "rxjs";
import { schemaTypes } from "../schemaTypes/index.ts";
import { projects, caseStudies, experience } from "../../src/content/site.ts";

// In-memory validation fixtures only. No document, permission claim or asset is sent to Sanity.
// Approved rights here exercise rule behavior; they are NOT evidence for the real screenshots.
const compiled = createSchema({ name: "offline-validation", types: schemaTypes });
const clone = value => structuredClone(value);
const ref = id => ({ _type: "reference", _ref: id });
const review = { _type: "editorialReview", state: "needsReview" };
const media = () => ({ _type: "mediaUsage", image: { _type: "image", asset: ref(`image-${"a".repeat(40)}-640x480-png`) },
  alt: "Synthetic image validation fixture", decorative: false, cropIntent: "fullScreenshot", rights: { _type: "usageRights", status: "approved" }, reviewFlags: [] });
const seo = () => ({ _type: "seoMetadata", title: "Synthetic search title", description: "Synthetic validation description.", indexingRequest: "inherit" });
const external = () => ({ _type: "link", label: "Synthetic link", kind: "external", externalUrl: "https://example.org/", newWindow: true });
const body = text => [{ _key: "p1", _type: "block", style: "normal", markDefs: [], children: [{ _key: "s1", _type: "span", text, marks: [] }] }];
function project(slug = "dazlab") {
  const card = projects.find(p => p.slug === slug), study = caseStudies[slug];
  return { _id: "drafts.fixture-project", _type: "project", title: card.title, slug: { _type: "slug", current: slug }, externalUrl: card.externalUrl,
    cardRole: card.role, tags: card.tags, cardSummary: card.summary, cardImage: media(),
    attribution: { _type: "projectAttribution", person: ref("portfolioProfile"), deliveryCredit: "Dazlab", role: "Sole Webflow developer", scope: "marketingWebsite", contributionSummary: study.sections[1].text, scopeStatement: study.sections[2].text },
    caseStudy: { _type: "caseStudy", eyebrow: study.eyebrow, heading: study.heading, summary: study.summary, heroImage: media(), sections: [{ _key: "context", _type: "narrativeSection", heading: study.sections[0].title, body: body(study.sections[0].text) }], publicNotices: study.missingFacts, seo: seo() },
    portfolioStatus: "provisional", editorialReview: clone(review),
  };
}
const section = (type, fields) => ({ _type: type, _key: type, heading: "Synthetic section", ...fields });
const home = () => ({ _id: "drafts.fixture-page", _type: "page", title: "Home", routeKey: "home", seo: seo(), editorialReview: clone(review), sections: [
  section("heroSection", { introLabel: "Synthetic intro", leftHeading: "Designer", rightHeading: "Developer", leftText: "Synthetic left text", rightText: "Synthetic right text", leftLink: external(), rightLink: external(), portrait: media(), actions: [{ ...external(), _key: "a1" }] }),
  section("toolsSection", { items: [{ _type: "toolItem", _key: "tool", name: "Synthetic tool", wordmark: "Synthetic tool" }] }),
  section("projectCollectionSection", { anchor: "work", selection: [{ ...ref("fixture-project"), _key: "project" }] }),
  section("featureListSection", { _key: "services", anchor: "expertise", items: [{ _type: "featureItem", _key: "service", title: "Synthetic service", text: "Synthetic description" }] }),
  section("featureListSection", { _key: "workflow", anchor: "workflow", items: [{ _type: "featureItem", _key: "step", title: "Synthetic step", text: "Synthetic description" }] }),
  section("profileSection", { anchor: "about", profile: ref("portfolioProfile"), variant: "summary" }),
  section("experienceSection", { anchor: "experience", entries: [{ ...ref("fixture-experience"), _key: "experience" }] }),
  section("ctaSection", { anchor: "contact", actions: [{ ...external(), _key: "a1" }] }),
] });
function mockClient(dataset = [], fail = false) {
  const configs = [], queries = [];
  const client = {
    configs, queries,
    withConfig(config) { configs.push(config); return client; },
    async fetch(query, params) {
      queries.push({ query, params });
      if (fail) throw new Error("Synthetic unavailable service");
      return (await evaluate(parse(query), { dataset, params })).get();
    },
    getDataUrl() { throw new Error("Unexpected data URL request; tests must stay offline"); },
    observable: { fetch: (...args) => from(client.fetch(...args)), request() { throw new Error("Unexpected network request"); } },
  };
  return client;
}
async function validate(document, options = {}) {
  const client = mockClient(options.dataset ?? [], options.fail ?? false);
  const markers = await validateDocument({ document: clone(document), environment: "studio",
    workspace: { schema: compiled, getClient: () => client, i18n: getFallbackLocaleSource() },
    getDocumentExists: async ({ id }) => !(options.missing ?? []).includes(id),
  });
  const result = { markers };
  const errors = result.markers.filter(m => m.level === "error");
  assert.ok(!result.markers.some(m => m.code === "validation.exception"), JSON.stringify(result.markers));
  return { ...result, errors, client };
}
async function accepts(document, options) { const r = await validate(document, options); assert.deepEqual(r.errors, [], JSON.stringify(r.markers)); return r; }
async function rejects(document, match, options) { const r = await validate(document, options); assert.ok(r.errors.some(e => `${e.message} ${e.path.join(".")}`.match(match)), JSON.stringify(r.markers)); return r; }

test("registers exactly six documents, embedded case study and all eight section types", () => {
  assert.deepEqual(compiled._validation?.filter(group => group.problems.some(p => p.severity === "error")), [], JSON.stringify(compiled._validation));
  assert.equal(new Set(schemaTypes.map(s => s.name)).size, schemaTypes.length);
  assert.equal(schemaTypes.length, 28);
  assert.deepEqual(schemaTypes.filter(s => s.type === "document").map(s => s.name).sort(), ["navigation", "page", "portfolioProfile", "professionalExperience", "project", "siteSettings"]);
  assert.equal(compiled.get("caseStudy").type.name, "object");
  assert.equal(compiled.get("project").fields.find(f => f.name === "caseStudy").type.name, "caseStudy");
  assert.ok(!schemaTypes.some(s => ["canonical", "domain", "token", "testimonial", "metric"].includes(s.name)));
});
test("field contracts and editor groups preserve ALD-114 names and boundaries", () => {
  const contract = {
    siteSettings: "siteName language defaultSeo profile primaryNavigation brand footerText editorialReview migration",
    portfolioProfile: "name professionalTitle summaryParagraphs biographyParagraphs profileHeading socialLinks heroPortrait aboutPortrait experience editorialReview migration",
    professionalExperience: "company role startYear endYear datePrecision description editorialReview migration",
    project: "title slug externalUrl cardRole tags cardSummary cardImage attribution caseStudy portfolioStatus projectYear editorialReview migration",
    navigation: "title items editorialReview migration",
    page: "title routeKey seo sections editorialReview migration",
    seoMetadata: "title description socialImage indexingRequest",
    mediaUsage: "image alt decorative caption cropIntent legacyAssetPaths rights reviewFlags",
    usageRights: "status creditLine publicNote",
    link: "label kind target fragment externalUrl newWindow",
    projectAttribution: "person deliveryCredit role scope contributionSummary scopeStatement capabilities",
    caseStudy: "eyebrow heading summary heroImage sections publicNotices seo",
    migrationMetadata: "sourceSystem sourceKey sourceCommit sourceLocations legacyPath",
    editorialReview: "state publicWarnings",
  };
  for (const [name, fields] of Object.entries(contract)) {
    const definition = schemaTypes.find(s => s.name === name);
    assert.deepEqual(definition.fields.map(f => f.name).sort(), fields.split(" ").sort(), name);
    if (definition.type === "document") {
      assert.ok(definition.fields.every(f => f.group));
      assert.ok(definition.groups.filter(g => g.name === "seo").every(() => definition.fields.some(f => f.group === "seo")));
    }
  }
  for (const [type, field] of [["portfolioProfile", "summaryParagraphs"], ["portfolioProfile", "biographyParagraphs"], ["caseStudy", "publicNotices"], ["textSection", "paragraphs"]])
    assert.equal(schemaTypes.find(s => s.name === type).fields.find(f => f.name === field).of[0].type, "text", `${type}.${field} must provide multiline text items`);
});
for (const p of projects) test(`accepts actual ${p.title} contribution copy with synthetic approved media`, () => accepts(project(p.slug)));
test("accepts all documented Home nested section shapes", () => accepts(home()));
test("accepts settings, profile, navigation and year-only experience", async () => {
  await accepts({ _id: "siteSettings", _type: "siteSettings", siteName: "Synthetic site", language: "en", defaultSeo: seo(), profile: ref("portfolioProfile"), primaryNavigation: ref("navigation-primary"), brand: { _type: "brand", shortName: "Synthetic", avatarText: "S", avatarLabel: "Synthetic profile" }, footerText: "Synthetic footer", editorialReview: review });
  await accepts({ _id: "portfolioProfile", _type: "portfolioProfile", name: "Synthetic name", professionalTitle: "Synthetic role", summaryParagraphs: ["Synthetic summary"], biographyParagraphs: ["Synthetic biography"], profileHeading: "Synthetic heading", socialLinks: [{ ...external(), _key: "link" }], heroPortrait: media(), aboutPortrait: media(), experience: [{ ...ref("fixture-experience"), _key: "e" }], editorialReview: review });
  await accepts({ _id: "navigation-primary", _type: "navigation", title: "Synthetic navigation", items: [{ ...external(), _key: "link" }], editorialReview: review });
  for (const e of experience) {
    const [startYear, endYear] = e.period.split("–").map(Number);
    await accepts({ _id: "fixture-experience", _type: "professionalExperience", company: e.company, role: e.role, description: e.description, startYear, endYear, datePrecision: "year", editorialReview: review });
  }
});
for (const name of ["title", "slug", "externalUrl", "cardRole", "tags", "cardSummary", "cardImage", "attribution", "caseStudy", "portfolioStatus", "editorialReview"])
  test(`missing required project ${name} fails`, async () => { const d = project(); delete d[name]; await rejects(d, new RegExp(`${name}|required`, "i")); });
for (const slug of ["Dazlab", "daz--lab", "-dazlab", "dazlab-", "work/dazlab", "dazlab/", "with space", "index", "new", "preview", "success", "", "café", "../about"])
  test(`rejects invalid/reserved slug ${JSON.stringify(slug)}`, async () => { const d = project(); d.slug.current = slug; await rejects(d, /slug|route|lowercase/i); });
test("duplicate published/draft slug rejected, self draft/published pair excluded with raw perspective", async () => {
  await rejects(project(), /already used|unique/i, { dataset: [{ _type: "project", _id: "other", slug: { current: "dazlab" } }] });
  await rejects(project(), /already used|unique/i, { dataset: [{ _type: "project", _id: "drafts.other", slug: { current: "dazlab" } }] });
  const r = await accepts(project(), { dataset: [{ _type: "project", _id: "fixture-project", slug: { current: "dazlab" } }] });
  assert.ok(r.client.configs.some(c => c.perspective === "raw" && c.useCdn === false));
  assert.ok(r.client.queries.some(q => q.params.self?.includes("drafts.fixture-project")));
});
test("published slug stability, source mapping stability and unavailable-query failure", async () => {
  const d = project(); d.slug.current = "renamed-project";
  await rejects(d, /published slug is locked/i, { dataset: [{ _type: "project", _id: "fixture-project", slug: { current: "dazlab" } }] });
  d.migration = { _type: "migrationMetadata", sourceSystem: "repo", sourceKey: "portfolio-v2/project/dazlab", sourceCommit: "88532ad18215c064a14e2824ec9f90b0e513d482", sourceLocations: ["src/content/site.ts"], legacyPath: "/work/dazlab/" };
  await rejects(d, /existing|preserve/i);
  delete d.migration.legacyPath; await rejects(d, /Preserve this existing/i);
  await rejects(project(), /could not be checked/i, { fail: true });
});
test("fifth draft slug accepted structurally without inventing a public route", async () => { const d = project(); d.title = "Synthetic fifth project"; d.slug.current = "synthetic-fifth"; await accepts(d); });
for (const url of ["http://example.org", "javascript:alert(1)", "data:text/html,x", "//example.org", "/work/", "https://user:password@example.org/"])
  test(`rejects unsafe URL ${url}`, async () => { const d = project(); d.externalUrl = url; await rejects(d, /HTTPS|URI|URL|credentials/i); });
for (const status of ["unreviewed", "restricted", "rejected", "unknown"])
  test(`blocks media rights status ${status}`, async () => { const d = project(); d.cardImage.rights.status = status; await rejects(d, /rights|listed/i); });
test("informative alt required, explicit empty decorative alt accepted", async () => {
  const d = project(); delete d.cardImage.alt; await rejects(d, /alt text/i);
  d.cardImage.alt = "  "; await rejects(d, /alt|plain text/i);
  d.cardImage.decorative = true; d.cardImage.alt = ""; await accepts(d);
});
test("image asset reference required and missing referenced target rejected", async () => {
  const d = project(); delete d.cardImage.image.asset; await rejects(d, /asset|image/i);
  await rejects(project(), /reference|published|exist/i, { missing: ["portfolioProfile"] });
});
test("reference must not be draft, weak or missing", async () => {
  const d = project(); d.attribution.person = ref("drafts.portfolioProfile"); await rejects(d, /strong reference/i);
  d.attribution.person = { ...ref("portfolioProfile"), _weak: true }; await rejects(d, /strong reference/i);
  delete d.attribution.person; await rejects(d, /person|required/i);
});
for (const [field, value] of [["deliveryCredit", "Uncredited"], ["role", "Product engineer"], ["scope", "softwareApplication"]])
  test(`rejects incorrect project attribution ${field}`, async () => { const d = project(); d.attribution[field] = value; await rejects(d, /Dazlab|listed|scope/i); });
test("nested context, SEO, contribution and provisional notice requirements", async () => {
  const d = project(); delete d.caseStudy.summary; await rejects(d, /summary|required/i);
  d.caseStudy.summary = "Synthetic summary"; d.caseStudy.sections[0].body = []; await rejects(d, /body|item|minimum|least/i);
  d.caseStudy.sections[0].body = body("Synthetic context"); d.caseStudy.sections[0].heading = "My contribution"; await rejects(d, /duplicate context/i);
  d.caseStudy.sections[0].heading = "Context"; delete d.attribution.contributionSummary; await rejects(d, /contributionSummary|required/i);
  d.attribution.contributionSummary = "Synthetic contribution"; delete d.caseStudy.seo.description; await rejects(d, /description|required/i);
  d.caseStudy.seo.description = "Synthetic description"; d.caseStudy.publicNotices = []; await rejects(d, /provisional|notice/i);
});
test("SEO length only warns; indexing cannot opt into public indexing", async () => {
  const d = project(); d.caseStudy.seo.title = "a".repeat(61); const result = await accepts(d); assert.ok(result.markers.some(m => m.level === "warning"));
  d.caseStudy.seo.indexingRequest = "index"; await rejects(d, /listed|allowed/i);
});
test("invalid nested feature, tool, CTA and page composition rejected", async () => {
  const d = home(); delete d.sections[3].items[0].text; await rejects(d, /text|required/i);
  d.sections[3].items[0].text = "Synthetic text"; delete d.sections[1].items[0].wordmark; await rejects(d, /wordmark/i);
  d.sections[1].items[0].wordmark = "Synthetic tool"; d.sections[7].actions = []; await rejects(d, /actions|minimum|least|item/i);
  d.sections[7].actions = [{ ...external(), _key: "a1" }]; d.sections[7].anchor = "work"; await rejects(d, /anchors.*unique/i);
  d.sections[7].anchor = "contact"; d.sections = d.sections.slice(1); await rejects(d, /required sections|split hero/i);
});
test("routeKey uniqueness and disallowed page sections fail", async () => {
  await rejects(home(), /already used/i, { dataset: [{ _type: "page", _id: "another-page", routeKey: "home" }] });
  const d = home(); d.routeKey = "success"; await rejects(d, /existing website page|fixed route/i);
  d.routeKey = "about"; await rejects(d, /not allowed/i);
});
test("rich text rejects markup and unsupported embeds", async () => {
  const d = project(); d.caseStudy.sections[0].body = body("<script>bad()</script>"); await rejects(d, /plain text|markup/i);
  d.caseStudy.sections[0].body = [{ _key: "embed", _type: "video", url: "https://example.org/" }]; await rejects(d, /paragraph|type/i);
});
test("internal links require target, exclusive destination and same-window behavior", async () => {
  const d = home(), l = d.sections[0].leftLink; l.kind = "internal"; delete l.externalUrl; l.newWindow = false;
  await rejects(d, /internal destination/i); l.target = ref("fixture-page"); l.fragment = "work"; await accepts(d);
  l.externalUrl = "https://example.org/"; await rejects(d, /internal destination only/i);
});
test("experience rejects months, noninteger years and reversed ranges", async () => {
  const d = { _id: "fixture", _type: "professionalExperience", company: "Synthetic company", role: "Synthetic role", description: "Synthetic description", startYear: 2025, endYear: 2024, datePrecision: "year", editorialReview: review };
  await rejects(d, /end year/i); d.endYear = 2026; d.startYear = "2025-01"; await rejects(d, /number|startYear/i);
  d.startYear = 2025.5; await rejects(d, /integer/i); d.startYear = 2025; d.datePrecision = "month"; await rejects(d, /listed|allowed/i);
});
test("duplicate reference arrays, singleton IDs and empty plain text fail", async () => {
  const d = home(); d.sections[2].selection.push({ ...ref("fixture-project"), _key: "second" }); await rejects(d, /same referenced/i);
  const n = { _id: "wrong-id", _type: "navigation", title: "Synthetic navigation", items: [{ ...external(), _key: "link" }], editorialReview: review };
  await rejects(n, /single shared record/i); n._id = "navigation-primary"; n.title = "   "; await rejects(n, /plain text/i);
});
test("accepts all three remaining fixed page templates", async () => {
  const make = (routeKey, sections) => ({ _id: `drafts.fixture-${routeKey}`, _type: "page", title: routeKey, routeKey, seo: seo(), sections, editorialReview: review });
  const h = home();
  await accepts(make("about", [h.sections[5], h.sections[6]]));
  await accepts(make("work", [h.sections[2], h.sections[7]]));
  await accepts(make("contact", [section("textSection", { paragraphs: ["Synthetic contact copy"] }), h.sections[3]]));
});
test("text sections reject missing/both content modes and accept rich text alternative", async () => {
  const d = { _id: "drafts.fixture-contact", _type: "page", title: "Contact", routeKey: "contact", seo: seo(), editorialReview: review, sections: [section("textSection", {}), home().sections[3]] };
  await rejects(d, /either plain-text/i); d.sections[0].body = body("Synthetic contact paragraph"); await accepts(d);
  d.sections[0].paragraphs = ["Synthetic second mode"]; await rejects(d, /either plain-text/i);
});
test("navigation rejects duplicate labels and destinations", async () => {
  const first = external(), second = { ...external(), label: "Other label" };
  const d = { _id: "navigation-primary", _type: "navigation", title: "Synthetic nav", items: [{ ...first, _key: "a" }, { ...second, _key: "b" }], editorialReview: review };
  await rejects(d, /must not repeat/i); d.items[1].externalUrl = "https://example.net/"; d.items[1].label = first.label; await rejects(d, /must not repeat/i);
});
test("optional migration metadata validates its nested required fields", async () => {
  const d = project(); d.migration = { _type: "migrationMetadata" }; await rejects(d, /sourceSystem|required/i);
  d.migration = { _type: "migrationMetadata", sourceSystem: "repo", sourceKey: "portfolio-v2/project/dazlab", sourceCommit: "not-a-commit", sourceLocations: ["src/content/site.ts"] }; await rejects(d, /sourceCommit|match/i);
});
test("nested media, paragraph and attribution rules hold in every usage", async () => {
  const d = project(); d.caseStudy.heroImage.rights.status = "restricted"; await rejects(d, /rights/i);
  const h = home(); h.sections[0].portrait.rights.status = "unreviewed"; await rejects(h, /rights/i);
  h.sections[0].portrait = media(); h.seo.socialImage = media(); h.seo.socialImage.rights.status = "rejected"; await rejects(h, /rights/i);
  const p = project(); p.attribution.capabilities = [{ _type: "capability", _key: "c", name: "Synthetic capability", applicability: "invented" }]; await rejects(p, /listed|allowed/i);
});
