import { defineConfig } from 'astro/config';
import { localProjectsIntegration } from '../../src/lib/sanity/local-project.mjs';
const doc = (id, slug) => ({ _id: id, _type: 'project', title: `Offline ${slug}`, slug: { current: slug }, cardSummary: 'Offline multiple-project build test.',
  cardImage: { decorative: false, alt: 'Offline diagram', rights: { status: 'approved' }, image: { asset: { _type: 'reference', _ref: 'image-offline' } } } });
const asset = { _id: 'image-offline', _type: 'sanity.imageAsset',
  url: 'https://cdn.sanity.io/images/p9xrr86a/ald118-test/offline-1x1.png', metadata: { dimensions: { width: 1, height: 1 } } };
const count = Number(process.env.CONTENT_TEST_PROJECT_COUNT);
if (![0, 1, 2].includes(count)) throw new Error('Invalid fixture count.');
const published = [doc('offline-one', 'sample-project'), doc('offline-two', 'mcfly-industries')].slice(0, count);
// Already-published snapshots; query exclusion is verified separately with the installed GROQ evaluator.
const fixture = published.map(project => ({ ...project, cardImage: { ...project.cardImage, image: { asset } } }));
if (fixture[0]) {
  fixture[0].caseStudy = { summary: 'Synthetic project overview.', heading: 'Synthetic narrative heading',
    sections: [{ _key: 'challenge', heading: 'The Challenge', body: [{ _key: 'p', _type: 'block', style: 'normal', markDefs: [],
      children: [{ _key: 'span', _type: 'span', text: 'Persistent rich narrative & evidence.', marks: ['strong'] }] }] }],
    seo: { title: 'Synthetic case-study SEO', description: 'Synthetic meta description.', socialImage: structuredClone(fixture[0].cardImage) } };
  fixture[0].screenshots = [{ ...structuredClone(fixture[0].cardImage), _key: 'shot', caption: 'Synthetic screenshot caption.' }];
}
const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j9ZkAAAAASUVORK5CYII=', 'base64');
export default defineConfig({ site: 'https://example.com', outDir: './test-results/ald-118-multiple',
  integrations: [localProjectsIntegration({ fixture, fetchMedia: async () => new Response(bytes, { headers: { 'content-type': 'image/png' } }) })],
});
