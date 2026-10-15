import { defineConfig } from 'astro/config';
import { sanityContentIntegration } from '../../src/lib/sanity/integration.mjs';
import { fixture, fixturePolicy, fifthProject } from './fixtures.mjs';
const snapshot = fifthProject(fixture());
const policy = fixturePolicy(snapshot);
// Invalid case must fail in the independent validator, not only at approval lookup.
if (process.env.CONTENT_TEST_INVALID === '1') snapshot.documents.find(d => d._type === 'project').slug.current = '../escape';
export default defineConfig({ site:'https://example.com', srcDir:'./src/cms', outDir:'./test-results/ald-117-fixture',
  integrations:[sanityContentIntegration({ fixture:snapshot, policy })] });
