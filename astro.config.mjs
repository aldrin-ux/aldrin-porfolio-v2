import { defineConfig } from "astro/config";
import { contentSource } from "./src/lib/sanity/retrieve.mjs";
import { sanityContentIntegration } from "./src/lib/sanity/integration.mjs";

export default defineConfig({
  site: "https://example.com",
  ...(contentSource(process.env) === "sanity" ? {
    srcDir: "./src/cms",
    integrations: [sanityContentIntegration()],
  } : {}),
});
