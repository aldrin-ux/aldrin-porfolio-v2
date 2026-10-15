import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset } from "./config/environment";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { singletonIds } from "./schemaTypes/validation";

export default defineConfig({
  name: "portfolio-v2",
  title: dataset === "ald118-test" ? "ALD-118 — ISOLATED SYNTHETIC TEST" : "Portfolio V2 CMS",
  projectId,
  dataset,
  plugins: [structureTool({ structure: dataset === "ald118-test"
    ? S => S.list().title("Isolated synthetic test").items([S.documentTypeListItem("project")]) : structure })],
  schema: {
    // Reuse the project fields and their validators; no profile/page dependencies in the test dataset.
    types: dataset === "ald118-test" ? schemaTypes.filter(type => ["project", "mediaUsage", "usageRights"].includes(type.name))
      .map(type => type.name === "project" && "fields" in type ? { ...type,
        fields: (type.fields ?? []).filter(field => ["title", "slug", "cardSummary", "cardImage"].includes(field.name)),
        groups: [{ name: "content", title: "Content", default: true }],
        preview: { select: { title: "title", media: "cardImage.image" } },
      } : type) : schemaTypes,
    templates: templates => templates.filter(template => !(template.schemaType in singletonIds)),
  },
  document: {
    actions: (actions, context) => context.schemaType in singletonIds
      ? actions.filter(action => !["duplicate", "delete"].includes(action.action ?? ""))
      : actions,
  },
});
