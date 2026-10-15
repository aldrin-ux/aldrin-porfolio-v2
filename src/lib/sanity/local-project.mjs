import { safeText, safeUrl } from './validate.mjs';
import { escapeHtml } from './normalize.mjs';

export const localProjectQuery = `*[_type == "project" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
  _id,title,slug,cardSummary,cardImage{alt,rights{status},image{asset->{_id,url,metadata{dimensions}}}}
}`;
export function assertLocalTarget(env) {
  if (env.NETLIFY || env.CI || env.CONTENT_SOURCE !== 'static' || env.CONTENT_LOCAL_TEST !== '1'
    || env.SANITY_PROJECT_ID !== 'p9xrr86a' || env.SANITY_DATASET !== 'ald118-test') {
    throw new Error('Local test requires explicit static overlay, p9xrr86a/ald118-test, and no hosting/CI.');
  }
}
export function normalizeLocalProjects(documents) {
  if (!Array.isArray(documents) || documents.length > 1) throw new Error('Expected zero or one isolated sample project.');
  const projects = [], caseStudies = {};
  for (const doc of documents) {
    const media = doc.cardImage, asset = media?.image?.asset;
    if (/^(drafts|versions)\./.test(doc._id) || doc.slug?.current !== 'sample-project'
      || ![doc.title, doc.cardSummary, media?.alt].every(safeText) || media?.rights?.status !== 'approved'
      || !safeUrl(asset?.url) || !asset?._id?.startsWith('image-')) throw new Error('Invalid isolated synthetic sample.');
    const url = new URL(asset.url), dimensions = asset.metadata?.dimensions;
    if (url.hostname !== 'cdn.sanity.io' || !/^\/images\/p9xrr86a\/ald118-test\/[a-zA-Z0-9-]+\.png$/.test(url.pathname)
      || url.search || !dimensions || ![dimensions.width, dimensions.height].every(n => Number.isInteger(n) && n > 0 && n <= 4096)) {
      throw new Error('Sample media must be a PNG in the isolated dataset with valid dimensions.');
    }
    const image = '/assets/ald118-sample.png', slug = 'sample-project';
    const variant = { src: image, srcset: `${image} ${dimensions.width}w`, width: dimensions.width, height: dimensions.height };
    projects.push({ title: doc.title, slug, href: `/work/${slug}/`, externalUrl: 'https://example.com',
      role: 'Synthetic test', tags: ['Synthetic test'], summary: doc.cardSummary, image, alt: media.alt, imageVariant: variant });
    caseStudies[slug] = { title: doc.title, heading: doc.title, eyebrow: 'Synthetic isolated CMS test',
      url: 'https://example.com', image, imageAlt: media.alt, imageVariant: variant,
      summary: doc.cardSummary, seoTitle: doc.title, seoDescription: doc.cardSummary, socialImage: image, noindex: true,
      creditText: 'Synthetic test content only.', details: [['Status', 'Synthetic test']],
      sections: [{ title: 'Sample', html: `<p>${escapeHtml(doc.cardSummary)}</p>` }],
      missingFacts: ['Synthetic demonstration. No client content or business claims.'] };
  }
  return { target: 'p9xrr86a/ald118-test', projects, caseStudies };
}
