import { defineConfig } from 'astro/config';
import { sanityContentIntegration } from '../../src/lib/sanity/integration.mjs';
import { sampleSnapshot, samplePolicy } from './sample-project.mjs';
const snapshot = sampleSnapshot(process.env.CONTENT_SAMPLE_STAGE ?? 'published');
export default defineConfig({ site: 'https://example.com', srcDir: './src/cms',
  outDir: './test-results/ald-118-sample',
  integrations: [sanityContentIntegration({ fixture: snapshot, policy: samplePolicy(snapshot) })],
});
