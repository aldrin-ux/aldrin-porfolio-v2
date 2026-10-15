import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset } from "./config/environment";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { singletonIds } from "./schemaTypes/validation";

export default defineConfig({
  name: "portfolio-v2",
  title: "Portfolio V2 CMS",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(template => !(template.schemaType in singletonIds)),
  },
  document: {
    actions: (actions, context) => context.schemaType in singletonIds
      ? actions.filter(action => !["duplicate", "delete"].includes(action.action ?? ""))
      : actions,
  },
});
