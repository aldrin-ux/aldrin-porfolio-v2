import type { SchemaTypeDefinition } from "sanity";
import { createElement } from "react";
import { documentTypes } from "./documents/models.ts";
import { objectTypes } from "./objects/models.ts";
import { sectionTypes } from "./objects/sections.ts";
import { portableText } from "./blocks/portableText.ts";

const DocumentIcon = () => createElement("span", { "aria-hidden": true }, "▤");
const ObjectIcon = () => createElement("span", { "aria-hidden": true }, "◇");
export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes, ...sectionTypes, portableText]
  .map(type => type.type === "document" ? {
    ...type, icon: DocumentIcon,
    fields: type.fields.map(field => ({ ...field, group: "group" in field ? field.group : "content" })),
    groups: type.groups.filter(group => group.name !== "seo" || type.fields.some(field => "group" in field && field.group === "seo")),
  } : { ...type, icon: ObjectIcon });
