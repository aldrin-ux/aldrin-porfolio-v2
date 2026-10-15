import type { SchemaTypeDefinition } from "sanity";
import { defineField } from "sanity";
import { createElement } from "react";
import { documentTypes } from "./documents/models.ts";
import { objectTypes } from "./objects/models.ts";
import { sectionTypes } from "./objects/sections.ts";
import { portableText } from "./blocks/portableText.ts";
import { object, objects, strings, text } from "./fields.ts";
import { httpsUrl } from "./validation.ts";

const DocumentIcon = () => createElement("span", { "aria-hidden": true }, "▤");
const ObjectIcon = () => createElement("span", { "aria-hidden": true }, "◇");
export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes, ...sectionTypes, portableText]
  .map(type => type.type === "document" ? {
    ...type, icon: DocumentIcon,
    fields: type.fields.map(field => ({ ...field, group: "group" in field ? field.group : "content" })),
    groups: type.groups.filter(group => group.name !== "seo" || type.fields.some(field => "group" in field && field.group === "seo")),
  } : { ...type, icon: ObjectIcon });

// Local editor views reuse stored field names. Production schemaTypes above remain unchanged.
export const localSchemaTypes: SchemaTypeDefinition[] = schemaTypes
  .filter(type => ["project", "mediaUsage", "usageRights", "caseStudy", "narrativeSection", "portableText", "seoMetadata"].includes(type.name))
  .map(type => {
    if (type.name === "project" && "fields" in type) return { ...type,
      groups: [{ name: "details", title: "Project Details", default: true }, { name: "study", title: "Case Study Content" },
        { name: "media", title: "Media" }, { name: "seo", title: "SEO" }],
      fields: (type.fields ?? []).filter(field => ["title", "slug", "cardSummary", "cardRole", "tags", "externalUrl", "cardImage", "caseStudy"].includes(field.name))
        .map(field => field.name === "caseStudy" ? { ...object("caseStudy", "Case study narrative and SEO", "caseStudy", false), group: ["study", "seo"] }
          : field.name === "cardRole" ? { ...text("cardRole", "Role", false), group: "details" }
          : field.name === "tags" ? { ...strings("tags", "Platform(s)", false), group: "details" }
          : field.name === "externalUrl" ? { ...defineField({ name: "externalUrl", title: "Live marketing website (optional)", type: "url", validation: r => r.custom(httpsUrl) }), group: "details" }
          : { ...field, title: field.name === "cardImage" ? "Project cover image" : field.title, group: field.name === "cardImage" ? "media" : "details" })
        .concat([{ ...objects("screenshots", "Additional screenshots (optional)", ["mediaUsage"], false), group: "media" }]),
      preview: { select: { title: "title", media: "cardImage.image" } },
    };
    if (type.name === "caseStudy") return { ...type,
      description: "Overview is the introduction. Add Challenge, My Contribution, Development Approach and Outcome as narrative sections. Image captions are only for describing images.",
      groups: [{ name: "content", title: "Narrative", default: true }, { name: "media", title: "Case-study image" }, { name: "seo", title: "SEO" }],
      fields: [ { ...text("summary", "Project Overview", false, true), group: "content" },
        { ...text("heading", "Page heading (optional; defaults to project title)", false), group: "content" },
        { ...text("eyebrow", "Small label (optional)", false), group: "content" },
        { ...objects("sections", "Challenge / Contribution / Approach / Outcome", ["narrativeSection"], false), group: "content" },
        { ...object("heroImage", "Case-study image (optional; defaults to cover)", "mediaUsage", false), group: "media" },
        { ...object("seo", "Search and social sharing", "seoMetadata", false), group: "seo" } ],
    };
    if (type.name === "narrativeSection") return { ...type, title: "Case-study section", validation: undefined,
      description: "Use The Challenge, My Contribution, Development Approach or Outcome. Ordinary paragraphs, bold and emphasis; no HTML or Markdown import.",
    };
    if (type.name === "portableText") return { ...portableText,
      of: [{ type: "block", styles: [{ title: "Paragraph", value: "normal" }], lists: [],
        marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Emphasis", value: "em" }], annotations: [] } }],
    };
    if (type.name === "seoMetadata") return { ...type,
      fields: [text("title", "SEO title (optional; defaults to project title)", false),
        text("description", "Meta description (optional; defaults to overview/card summary)", false, true),
        object("socialImage", "Social image (optional; defaults to cover)", "mediaUsage", false)],
    };
    return type;
  });
