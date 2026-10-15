import { defineArrayMember, defineField } from "sanity";
import { linkRules, mediaRules, plainText, portableTextRules, referenceShape, uniqueItems } from "./validation.ts";

export const text = (name: string, title: string, required = true, multiline = false) => defineField({
  name, title, type: multiline ? "text" : "string",
  validation: rule => required ? rule.required().custom(plainText) : rule.custom(plainText),
});
export const choiceTitle = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase());
export const choice = (name: string, title: string, values: string[], initialValue?: string) => defineField({
  name, title, type: "string", options: { list: values.map(value => ({ title: choiceTitle(value), value })), layout: "radio" }, initialValue,
  validation: rule => rule.required().custom(v => values.includes(String(v)) || "Choose one of the listed values."),
});
export const reference = (name: string, title: string, types: string[], required = true) => defineField({
  name, title, type: "reference", to: types.map(type => ({ type })),
  validation: rule => required ? rule.required().custom(referenceShape) : rule.custom(referenceShape),
});
const sharedChecks: Record<string, (value: unknown) => true | string> = {
  link: linkRules, mediaUsage: mediaRules, portableText: portableTextRules,
};
export const object = (name: string, title: string, type: string, required = true) => defineField({
  name, title, type, validation: rule => {
    const requiredRule = required ? rule.required() : rule;
    // Field validation replaces type validation: compose shared invariants explicitly.
    return sharedChecks[type] ? requiredRule.custom(sharedChecks[type]).error() : requiredRule.error();
  },
});
export const strings = (name: string, title: string, required = true) => defineField({
  name, title, type: "array", of: [defineArrayMember({ type: "string", validation: rule => rule.custom(plainText) })],
  validation: rule => required ? rule.required().min(1).unique() : rule.unique(),
});
export const objects = (name: string, title: string, types: string[], required = true) => defineField({
  name, title, type: "array", of: types.map(type => defineArrayMember({ type })),
  validation: rule => required ? rule.required().min(1).custom(uniqueItems) : rule.custom(uniqueItems),
});
export const references = (name: string, title: string, to: string[]) => defineField({
  name, title, type: "array", of: [defineArrayMember({ type: "reference", to: to.map(type => ({ type })), validation: rule => rule.custom(referenceShape) })],
  validation: rule => rule.required().min(1).custom(uniqueItems),
});
export const envelope = () => [
  { ...object("editorialReview", "Review checklist", "editorialReview"), group: "review" },
  { ...object("migration", "Source mapping (optional)", "migrationMetadata", false), group: "review" },
];
export const groups = [
  { name: "content", title: "Content", default: true }, { name: "seo", title: "Search & sharing" },
  { name: "review", title: "Review & source" },
];
export const sectionFields = (headingRequired = true) => [
  defineField({ name: "anchor", title: "Section link name", type: "string", description: "Stable link name without #. Keep existing links unchanged.", validation: r => r.regex(/^[a-z][a-z0-9-]*$/).error("Use a lowercase section link name without #.") }),
  text("eyebrow", "Small label", false), text("heading", "Section heading", headingRequired), text("description", "Introduction", false, true),
];
