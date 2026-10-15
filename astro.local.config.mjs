import { defineConfig } from 'astro/config';
import { assertLocalTarget, localProjectsIntegration } from './src/lib/sanity/local-project.mjs';

// Explicit local config only; normal/production Astro config never imports CLI auth.
assertLocalTarget(process.env);
export default defineConfig({ site: 'https://example.com', outDir: './test-results/ald-118-live',
  integrations: [localProjectsIntegration()],
});
