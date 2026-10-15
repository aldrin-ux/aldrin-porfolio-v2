import { defineType } from "sanity";
import { choice, object, objects, reference, references, sectionFields, strings, text } from "../fields.ts";
import { record } from "../validation.ts";

export const sectionTypes = [
  defineType({ name: "heroSection", title: "Home introduction", type: "object", fields: [...sectionFields(false),
    text("introLabel", "Introduction label"), text("leftHeading", "Designer heading"), text("rightHeading", "Developer heading"),
    text("leftText", "Designer description", true, true), text("rightText", "Developer description", true, true),
    object("leftLink", "Designer link", "link"), object("rightLink", "Developer link", "link"), object("portrait", "Portrait", "mediaUsage"), objects("actions", "Main links", ["link"])], preview: { select: { title: "introLabel" } } }),
  defineType({ name: "textSection", title: "Text section", type: "object", fields: [...sectionFields(), strings("paragraphs", "Plain-text paragraphs", false, true), object("body", "Rich text (alternative)", "portableText", false)],
    validation: r => r.custom(v => {
      if (v === undefined) return true;
      const s = record(v), paragraphs = Array.isArray(s.paragraphs) && !!s.paragraphs.length, body = Array.isArray(s.body) && !!s.body.length;
      return paragraphs !== body || "Use either plain-text paragraphs or rich text, not both or neither.";
    }), preview: { select: { title: "heading" } } }),
  defineType({ name: "featureListSection", title: "Services or workflow", type: "object", fields: [...sectionFields(), objects("items", "Items in display order", ["featureItem"]), objects("actions", "Optional links", ["link"], false)], preview: { select: { title: "heading" } } }),
  defineType({ name: "ctaSection", title: "Invitation and links", type: "object", fields: [...sectionFields(), text("body", "Invitation text", false, true), objects("actions", "Links", ["link"])], preview: { select: { title: "heading" } } }),
  defineType({ name: "projectCollectionSection", title: "Selected projects", type: "object", fields: [...sectionFields(), references("selection", "Projects in display order", ["project"]), strings("labels", "Decorative category labels", false)], preview: { select: { title: "heading" } } }),
  defineType({ name: "profileSection", title: "About the portfolio owner", type: "object", fields: [...sectionFields(), reference("profile", "Profile", ["portfolioProfile"]), choice("variant", "Profile text", ["summary", "biography"]), object("portrait", "Optional portrait", "mediaUsage", false)], preview: { select: { title: "heading" } } }),
  defineType({ name: "experienceSection", title: "Professional history", type: "object", fields: [...sectionFields(), references("entries", "Experience in display order", ["professionalExperience"])], preview: { select: { title: "heading" } } }),
  defineType({ name: "toolsSection", title: "Tools", type: "object", fields: [...sectionFields(), objects("items", "Tools in display order", ["toolItem"])], preview: { select: { title: "heading" } } }),
];
