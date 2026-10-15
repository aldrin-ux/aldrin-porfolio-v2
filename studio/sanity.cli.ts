import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./config/environment";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: { autoUpdates: false },
});
