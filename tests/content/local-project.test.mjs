import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLocalTarget, normalizeLocalProjects, localProjectQuery } from '../../src/lib/sanity/local-project.mjs';

const env = { CONTENT_SOURCE: 'static', CONTENT_LOCAL_TEST: '1', SANITY_PROJECT_ID: 'p9xrr86a', SANITY_DATASET: 'ald118-test' };
const sample = () => ({ _id: 'test-document', title: 'Synthetic sample', slug: { current: 'sample-project' }, cardSummary: 'Synthetic summary.',
  cardImage: { alt: 'Synthetic diagram', rights: { status: 'approved' }, image: { asset: { _id: 'image-test',
    url: 'https://cdn.sanity.io/images/p9xrr86a/ald118-test/test-640x400.png', metadata: { dimensions: { width: 640, height: 400 } } } } } });

test('isolated local mode rejects production, hosting, CI and implicit activation', () => {
  assert.doesNotThrow(() => assertLocalTarget(env));
  for (const overrides of [{ SANITY_DATASET: 'production' }, { SANITY_PROJECT_ID: 'other' }, { NETLIFY: 'true' },
    { CI: 'true' }, { CONTENT_LOCAL_TEST: undefined }, { CONTENT_SOURCE: 'sanity' }]) {
    assert.throws(() => assertLocalTarget({ ...env, ...overrides }));
  }
});
test('published sample normalizes without globals, and empty result removes it', () => {
  assert.match(localProjectQuery, /drafts\.\*\*/); assert.match(localProjectQuery, /versions\.\*\*/);
  const doc = sample(); doc.secret = 'must-not-render';
  const view = normalizeLocalProjects([doc]);
  assert.equal(view.projects[0].href, '/work/sample-project/');
  assert.equal(view.caseStudies['sample-project'].noindex, true);
  assert.ok(!JSON.stringify(view).includes(doc.secret));
  assert.deepEqual(normalizeLocalProjects([]).projects, []);
});
test('sample rejects drafts, collisions, unsafe text, rights and foreign media', () => {
  for (const mutate of [d => d._id = 'drafts.test', d => d.slug.current = 'dazlab', d => d.title = '<script>x</script>',
    d => d.cardImage.alt = '', d => d.cardImage.rights.status = 'unreviewed',
    d => d.cardImage.image.asset.url = 'https://cdn.sanity.io/images/p9xrr86a/production/test.png',
    d => d.cardImage.image.asset.url = 'https://example.com/test.png',
    d => d.cardImage.image.asset.metadata.dimensions.width = 0]) {
    const doc = sample(); mutate(doc); assert.throws(() => normalizeLocalProjects([doc]));
  }
  assert.throws(() => normalizeLocalProjects([sample(), sample()]));
});
