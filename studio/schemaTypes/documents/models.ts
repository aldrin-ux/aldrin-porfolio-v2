import { defineField, defineType } from "sanity";
import { choice, envelope, groups, object, objects, reference, references, strings, text } from "../fields.ts";
import { experienceRules, httpsUrl, pageSections, projectRules, projectSlug, record, singletonIds, uniqueField, uniqueItems } from "../validation.ts";
import { sectionTypes } from "../objects/sections.ts";

const inContent = <T extends object>(field: T) => ({ ...field, group: "content" });
const singletonValidation = (type: string, value: unknown) => {
  const id = String(record(value)._id ?? "").replace(/^drafts\./, "");
  return !id || id === singletonIds[type] || "Open this single shared record from the main Studio navigation.";
};
const siteSettings = defineType({
  name: "siteSettings", title: "Site settings", type: "document", groups,
  description: "Shared public identity and metadata only. Launch restrictions, canonical origin and hosting remain controlled in code.",
  validation: r => r.custom(v => singletonValidation("siteSettings", v)),
  fields: [text("siteName", "Site name"), choice("language", "Language", ["en"], "en"),
    { ...object("defaultSeo", "Default search and sharing", "seoMetadata"), group: "seo" },
    reference("profile", "Portfolio owner", ["portfolioProfile"]), reference("primaryNavigation", "Main navigation", ["navigation"]),
    object("brand", "Header identity", "brand"), text("footerText", "Footer text"), ...envelope()],
  preview: { select: { title: "siteName" } },
});
const portfolioProfile = defineType({
  name: "portfolioProfile", title: "Portfolio profile", type: "document", groups,
  description: "Public professional profile only; no private resume details. Changes to professional claims need owner review.",
  validation: r => r.custom(v => singletonValidation("portfolioProfile", v)),
  fields: [text("name", "Name"), text("professionalTitle", "Professional title"), strings("summaryParagraphs", "Homepage profile paragraphs"), strings("biographyParagraphs", "About-page biography paragraphs"),
    text("profileHeading", "Profile heading"), objects("socialLinks", "Professional social links", ["link"]), object("heroPortrait", "Home portrait", "mediaUsage"), object("aboutPortrait", "About portrait", "mediaUsage"),
    references("experience", "Professional history in display order", ["professionalExperience"]), ...envelope()],
  preview: { select: { title: "name", subtitle: "professionalTitle", media: "heroPortrait.image" } },
});
const navigation = defineType({
  name: "navigation", title: "Navigation", type: "document", groups,
  description: "The same ordered links serve the header, mobile menu and footer. Keep existing section destinations stable.",
  validation: r => r.custom(v => singletonValidation("navigation", v)),
  fields: [text("title", "Editor label"), { ...objects("items", "Links in display order", ["link"]), validation: r => r.required().min(1).custom(uniqueItems).custom(value => {
    if (!Array.isArray(value)) return true;
    const labels = value.map(v => record(v).label), destinations = value.map(v => { const item = record(v); return item.kind === "external" ? item.externalUrl : `${record(item.target)._ref}#${item.fragment ?? ""}`; });
    return new Set(labels).size === labels.length && new Set(destinations).size === destinations.length || "Navigation labels and destinations must not repeat.";
  }) }, ...envelope()],
  preview: { select: { title: "title" } },
});
const professionalExperience = defineType({
  name: "professionalExperience", title: "Professional experience", type: "document", groups,
  description: "Year ranges only. Never infer employment months or unconfirmed responsibilities.",
  validation: r => r.custom(experienceRules),
  fields: [text("company", "Company"), text("role", "Role"),
    defineField({ name: "startYear", title: "Start year", type: "number", validation: r => r.required().integer().min(1000).max(9999) }),
    defineField({ name: "endYear", title: "End year", type: "number", validation: r => r.required().integer().min(1000).max(9999) }),
    choice("datePrecision", "Date precision", ["year"], "year"), text("description", "Responsibilities", true, true), ...envelope()],
  orderings: [{ title: "Most recent start year", name: "recent", by: [{ field: "startYear", direction: "desc" }, { field: "company", direction: "asc" }] }],
  preview: { select: { title: "company", role: "role", start: "startYear", end: "endYear" }, prepare: ({ title, role, start, end }) => ({ title, subtitle: `${role || "Role needed"} · ${start ?? "?"}–${end ?? "?"}` }) },
});
const project = defineType({
  name: "project", title: "Project and case study", type: "document", groups,
  description: "Marketing website contributions. Client product engineering and business results must not be attributed to the Webflow build.",
  validation: r => r.custom(projectRules),
  fields: [inContent(text("title", "Project title")),
    defineField({ name: "slug", title: "Stable case-study URL name", type: "slug", group: "content",
      description: "Creates /work/{slug}/. Published routes are locked by validation; a rename requires separately reviewed redirects.",
      options: { source: "title", isUnique: async (value, context) => await uniqueField(value, "slug.current", context) === true },
      readOnly: ({ document }) => !!record(document?.migration).legacyPath,
      validation: r => r.required().custom(projectSlug),
    }),
    { ...defineField({ name: "externalUrl", title: "Live marketing website", type: "url", validation: r => r.required().custom(httpsUrl) }), group: "content" },
    inContent(text("cardRole", "Card role label")), inContent(strings("tags", "Project tags")), inContent(text("cardSummary", "Card summary", true, true)),
    inContent(object("cardImage", "Project card image", "mediaUsage")), inContent(object("attribution", "Contribution and credit", "projectAttribution")),
    inContent(object("caseStudy", "Case study", "caseStudy")),
    { ...choice("portfolioStatus", "Portfolio verification status", ["provisional", "verified"], "provisional"), group: "review" },
    { ...defineField({ name: "projectYear", title: "Project year (only if confirmed)", type: "number", validation: r => r.integer().min(1000).max(9999), description: "Leave unset for the current four entries; employment years are not project dates." }), group: "review" },
    ...envelope()],
  orderings: [{ title: "Project title", name: "title", by: [{ field: "title", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "portfolioStatus", media: "cardImage.image" } },
});
const page = defineType({
  name: "page", title: "Website page", type: "document", groups,
  description: "Only Home, About, Work and Contact. Forms, confirmation, 404, robots and sitemap stay in code.",
  fields: [inContent(text("title", "Editor page title")),
    defineField({ name: "routeKey", title: "Existing website page", type: "string", group: "content", options: { list: ["home", "about", "work", "contact"], layout: "radio" },
      validation: r => r.required().custom(async (value, context) => ["home", "about", "work", "contact"].includes(String(value)) ? uniqueField(String(value), "routeKey", context) : "Choose an existing website page."),
    }),
    { ...object("seo", "Search and sharing", "seoMetadata"), group: "seo" },
    { ...objects("sections", "Page sections in display order", sectionTypes.map(s => s.name)), group: "content", validation: r => r.required().min(1).custom(uniqueItems).custom(pageSections) },
    ...envelope()],
  orderings: [{ title: "Page name", name: "title", by: [{ field: "title", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "routeKey" } },
});
export const documentTypes = [siteSettings, portfolioProfile, project, professionalExperience, navigation, page];
