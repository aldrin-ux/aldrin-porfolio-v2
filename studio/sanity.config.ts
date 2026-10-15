import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset } from "./config/environment";
import { schemaTypes, localSchemaTypes } from "./schemaTypes";
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
    types: dataset === "ald118-test" ? localSchemaTypes : schemaTypes,
    templates: templates => templates.filter(template => !(template.schemaType in singletonIds)),
  },
  document: {
    actions: (actions, context) => context.schemaType in singletonIds
      ? actions.filter(action => !["duplicate", "delete"].includes(action.action ?? ""))
      : actions,
  },
});
