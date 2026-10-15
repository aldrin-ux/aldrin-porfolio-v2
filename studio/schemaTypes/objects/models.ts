import { defineArrayMember, defineField, defineType } from "sanity";
import { choice, choiceTitle, object, objects, reference, strings, text } from "../fields.ts";
import { httpsUrl, linkRules, mediaRules, plainText, record } from "../validation.ts";

const usageRights = defineType({
  name: "usageRights", title: "Image usage rights", type: "object",
  description: "Public-safe status only. Keep permission documents and private proof outside this dataset. An approved label alone is not evidence.",
  fields: [choice("status", "Permission review", ["unreviewed", "approved", "restricted", "rejected"], "unreviewed"),
    text("creditLine", "Required public credit", false), text("publicNote", "Public permission note", false, true)],
  preview: { select: { title: "status", subtitle: "creditLine" } },
});
const flags = ["testimonials", "metrics", "dashboard", "thirdPartyLogo", "portrait", "provenanceUnknown"];
const mediaUsage = defineType({
  name: "mediaUsage", title: "Image and permission review", type: "object",
  validation: rule => rule.custom(mediaRules),
  fields: [
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: r => r.required(), description: "Upload only a reviewed original. Public asset URLs are not confidential storage." }),
    defineField({ name: "alt", title: "Image description (alt text)", type: "string", description: "Describe informative images. Leave empty only for decorative images.", validation: r => r.custom((v, c) => record(c.parent).decorative === true && v === "" ? true : plainText(v)) }),
    defineField({ name: "decorative", title: "Decorative image", type: "boolean", initialValue: false, validation: r => r.required() }),
    text("caption", "Public caption", false, true),
    choice("cropIntent", "Image use", ["cardTop", "fullScreenshot", "portrait"]),
    strings("legacyAssetPaths", "Original repository paths", false),
    object("rights", "Usage rights", "usageRights"),
    defineField({ name: "reviewFlags", title: "Items needing review", type: "array", initialValue: [],
      of: [defineArrayMember({ type: "string", options: { list: flags.map(value => ({ title: choiceTitle(value), value })) }, validation: r => r.custom(v => flags.includes(String(v)) || "Choose a listed review flag.") })],
      validation: r => r.required().unique() }),
  ],
  preview: { select: { title: "alt", subtitle: "rights.status", media: "image" }, prepare: ({ title, subtitle, media }) => ({ title: title || "Decorative image", subtitle: `Rights: ${subtitle || "unreviewed"}`, media }) },
});
const link = defineType({
  name: "link", title: "Link", type: "object", validation: r => r.custom(linkRules),
  fields: [text("label", "Link label"), choice("kind", "Destination type", ["internal", "external"]),
    reference("target", "Website page or project", ["page", "project"], false),
    defineField({ name: "fragment", title: "Section link name", type: "string", description: "Without #; must match the destination's section link name.", validation: r => r.regex(/^[a-z][a-z0-9-]*$/) }),
    defineField({ name: "externalUrl", title: "External website", type: "url", validation: r => r.custom(httpsUrl) }),
    defineField({ name: "newWindow", title: "Open in a new window", type: "boolean", validation: r => r.required(), description: "On for external links; off for internal links." })],
  preview: { select: { title: "label", subtitle: "kind" } },
});
const seoMetadata = defineType({
  name: "seoMetadata", title: "Search and social sharing", type: "object",
  description: "Factual wording only. The website controls canonical URLs and the noindex launch restriction.",
  fields: [
    defineField({ name: "title", title: "Search title", type: "string", validation: r => [r.required().custom(plainText), r.max(60).warning("Consider a shorter search title; preserve approved wording.")] }),
    defineField({ name: "description", title: "Search description", type: "text", validation: r => [r.required().custom(plainText), r.max(160).warning("Consider a shorter description; do not silently truncate approved content.")] }),
    object("socialImage", "Social sharing image", "mediaUsage", false),
    choice("indexingRequest", "Search indexing", ["inherit", "noindex"], "inherit"),
  ],
});
const migrationMetadata = defineType({
  name: "migrationMetadata", title: "Source mapping", type: "object",
  description: "Public-safe source provenance; no credentials or private evidence. Import scripts must preserve returned document IDs separately.",
  fields: [text("sourceSystem", "Source system"), text("sourceKey", "Unique source key"),
    defineField({ name: "sourceCommit", title: "Source commit", type: "string", validation: r => r.required().regex(/^[a-f0-9]{40}$/) }),
    strings("sourceLocations", "Source file and field locations"),
    defineField({ name: "legacyPath", title: "Existing website path", type: "string", validation: r => r.regex(/^\/(?:[a-z0-9-]+\/)*$/), description: "Original internal path with trailing slash; not a domain or external URL." })],
});
const editorialReview = defineType({
  name: "editorialReview", title: "Review checklist", type: "object",
  description: "A checklist, not access control or proof of rights. Protected revision approval and account permissions are separate release requirements.",
  fields: [choice("state", "Review state", ["needsReview", "approved"], "needsReview"), strings("publicWarnings", "Public-safe warnings", false)],
});
const brand = defineType({ name: "brand", title: "Header identity", type: "object", fields: [text("shortName", "Short name"), text("avatarText", "Avatar initials"), text("avatarLabel", "Avatar accessible label")] });
const capability = defineType({ name: "capability", title: "Project-specific capability", type: "object", description: "Only add a project-specific capability when evidence is available; global Dazlab responsibilities do not prove it on every project.", fields: [text("name", "Capability"), choice("applicability", "Evidence scope", ["confirmed", "contextOnly"])] });
const projectAttribution = defineType({
  name: "projectAttribution", title: "Contribution and project credit", type: "object",
  fields: [reference("person", "Portfolio contributor", ["portfolioProfile"]), text("deliveryCredit", "Project delivery credit"), text("role", "My role"),
    choice("scope", "Scope", ["marketingWebsite"], "marketingWebsite"),
    text("contributionSummary", "My contribution", true, true), text("scopeStatement", "Scope and credit", true, true),
    objects("capabilities", "Evidence-backed project capabilities (optional)", ["capability"], false)],
  preview: { select: { title: "deliveryCredit", subtitle: "role" } },
});
const narrativeSection = defineType({ name: "narrativeSection", title: "Context paragraph", type: "object", fields: [text("heading", "Heading"), object("body", "Context narrative", "portableText")],
  validation: r => r.custom(v => !["My contribution", "Scope and credit"].includes(String(record(v).heading)) || "Contribution and scope belong in the project credit fields, not duplicate context sections."),
  preview: { select: { title: "heading" } },
});
const caseStudy = defineType({
  name: "caseStudy", title: "Case study", type: "object",
  description: "This describes the marketing website. Product engineering, product ownership and business outcomes are outside the contribution scope.",
  fields: [text("eyebrow", "Small label"), text("heading", "Case-study heading"), text("summary", "Case-study summary", true, true),
    object("heroImage", "Case-study image", "mediaUsage"), objects("sections", "Context narrative", ["narrativeSection"]),
    strings("publicNotices", "Public provisional-entry notices", false, true), object("seo", "Search and sharing", "seoMetadata")],
});
const featureItem = defineType({ name: "featureItem", title: "Service or workflow item", type: "object", fields: [text("title", "Title"), text("text", "Description", true, true)], preview: { select: { title: "title", subtitle: "text" } } });
const toolItem = defineType({ name: "toolItem", title: "Tool", type: "object", fields: [text("name", "Tool name"), object("logo", "Reviewed logo", "mediaUsage", false), text("wordmark", "Text wordmark", false)],
  validation: r => r.custom(v => v === undefined || !!record(v).logo || typeof record(v).wordmark === "string" && !!String(record(v).wordmark).trim() || "Add a reviewed logo or a text wordmark."),
  preview: { select: { title: "name", media: "logo.image" } },
});
export const objectTypes = [usageRights, mediaUsage, link, seoMetadata, migrationMetadata, editorialReview, brand, capability, projectAttribution, narrativeSection, caseStudy, featureItem, toolItem];
