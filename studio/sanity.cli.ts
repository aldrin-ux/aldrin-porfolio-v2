import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./config/environment";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: { autoUpdates: false },
  typegen: {
    path: "./schemaTypes/**/*.ts",
    schema: "./.sanity/schema.json",
    generates: "./.sanity/types.generated.ts",
    overloadClientMethods: false,
  },
});
