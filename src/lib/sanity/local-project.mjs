import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { safeText, safeUrl, projectPath } from './validate.mjs';
import { retainedSlugs } from './model.mjs';
import { escapeHtml } from './normalize.mjs';

export const localProjectQuery = `*[_type == "project" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
  _id,title,slug,cardSummary,cardImage{alt,decorative,rights{status},image{asset->{_id,url,metadata{dimensions}}}}
} | order(slug.current asc, _id asc)`;
export function assertLocalTarget(env) {
  if (env.NETLIFY || env.CI || env.CONTENT_SOURCE !== 'static' || env.CONTENT_LOCAL_TEST !== '1'
    || env.SANITY_PROJECT_ID !== 'p9xrr86a' || env.SANITY_DATASET !== 'ald118-test') {
    throw new Error('Local test requires explicit static overlay, p9xrr86a/ald118-test, and no hosting/CI.');
  }
}
export function normalizeLocalProjects(documents) {
  if (!Array.isArray(documents)) throw new Error('Local project validation: expected an array of published projects.');
  const projects = [], caseStudies = {}, errors = [], slugs = new Set(), ids = new Set();
  for (const [index, doc] of documents.entries()) {
    const label = safeText(doc?.title) ? doc.title : `document ${index + 1}`;
    const invalid = (field, message) => errors.push(`${label} (${doc?._id ?? 'missing ID'}).${field}: ${message}`);
    const before = errors.length, media = doc?.cardImage, asset = media?.image?.asset, slug = doc?.slug?.current;
    if (!safeText(doc?._id) || /^(drafts|versions)\./.test(doc._id)) invalid('_id', 'must identify a published document, not a draft/version.');
    if (ids.has(doc?._id)) invalid('_id', 'duplicate document ID.');
    ids.add(doc?._id);
    try { projectPath(slug); } catch { invalid('slug.current', 'use a non-reserved lowercase slug with single hyphens.'); }
    if (retainedSlugs.includes(slug)) invalid('slug.current', `collides with existing static route /work/${slug}/.`);
    if (slugs.has(slug)) invalid('slug.current', `duplicate published slug "${slug}".`);
    slugs.add(slug);
    for (const field of ['title', 'cardSummary']) if (!safeText(doc?.[field])) invalid(field, 'required nonempty plain text without HTML.');
    if (typeof media?.decorative !== 'boolean') invalid('cardImage.decorative', 'choose informative or decorative.');
    if (media?.decorative !== true && !safeText(media?.alt)) invalid('cardImage.alt', 'required nonempty plain text for an informative image.');
    if (media?.decorative === true && media.alt != null && media.alt !== '' && !safeText(media.alt)) invalid('cardImage.alt', 'when supplied, use plain text without HTML.');
    if (media?.rights?.status !== 'approved') invalid('cardImage.rights.status', 'usage rights must be approved.');
    if (!asset?._id?.startsWith('image-')) invalid('cardImage.image.asset', 'required resolved image asset.');
    const url = safeUrl(asset?.url) ? new URL(asset.url) : null;
    const extension = url?.pathname.match(/^\/images\/p9xrr86a\/ald118-test\/[a-zA-Z0-9-]+\.(png|jpg|jpeg|webp)$/)?.[1];
    if (!url || url.hostname !== 'cdn.sanity.io' || !extension || url.search || url.hash) invalid('cardImage.image.asset.url', 'must be a PNG, JPEG or WebP in p9xrr86a/ald118-test.');
    const dimensions = asset?.metadata?.dimensions;
    if (!dimensions || ![dimensions.width, dimensions.height].every(n => Number.isInteger(n) && n > 0 && n <= 4096)) invalid('cardImage.image.asset.metadata.dimensions', 'width and height must be integers between 1 and 4096.');
    if (errors.length !== before) continue;
    const image = `/assets/ald118-${slug}.${extension}`, alt = media.decorative ? '' : media.alt;
    const variant = { src: image, srcset: `${image} ${dimensions.width}w`, width: dimensions.width, height: dimensions.height };
    projects.push({ title: doc.title, slug, href: `/work/${slug}/`, externalUrl: 'https://example.com',
      role: 'Local CMS test', tags: ['Local CMS test'], summary: doc.cardSummary, image, alt, imageVariant: variant });
    caseStudies[slug] = { title: doc.title, heading: doc.title, eyebrow: 'Isolated CMS test',
      url: 'https://example.com', image, imageAlt: alt, imageVariant: variant,
      summary: doc.cardSummary, seoTitle: doc.title, seoDescription: doc.cardSummary, socialImage: image, noindex: true,
      creditText: 'Local test content only.', details: [['Status', 'Isolated local test']],
      sections: [{ title: 'Sample', html: `<p>${escapeHtml(doc.cardSummary)}</p>` }],
      missingFacts: ['Isolated test dataset. Not part of the live portfolio.'] };
  }
  if (errors.length) throw new Error(`Local project validation:\n- ${errors.join('\n- ')}`);
  return { target: 'p9xrr86a/ald118-test', projects, caseStudies };
}

// Shared by the explicit local config and network-free build fixtures.
export function localProjectsIntegration({ fixture, fetchMedia = fetch } = {}) {
  const images = new Map();
  return { name: 'isolated-local-projects', hooks: {
    'astro:config:setup': async ({ config, updateConfig, injectRoute, command }) => {
      if (fixture) {
        if (process.env.NETLIFY || process.env.CONTENT_INTEGRATION_TEST !== '1') throw new Error('Offline local projects require the explicit test runner.');
      } else assertLocalTarget(process.env);
      if (command !== 'build') return;
      images.clear();
      let documents = fixture;
      if (!documents) {
        const { getProjectCliClient } = await import('../../../studio/node_modules/@sanity/cli-core/dist/apiClient.js');
        const client = await getProjectCliClient({ projectId: 'p9xrr86a', dataset: 'ald118-test',
          apiVersion: '2026-10-01', requireUser: true, useCdn: false, perspective: 'published' });
        try { documents = await client.fetch(localProjectQuery); }
        catch { throw new Error('Isolated published read failed; use existing CLI login/access. No static fallback.'); }
      }
      const view = normalizeLocalProjects(documents);
      for (const [index, doc] of documents.entries()) {
        const image = view.projects[index].image, extension = image.split('.').at(-1);
        const response = await fetchMedia(doc.cardImage.image.asset.url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
        const expectedType = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }[extension];
        if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== expectedType) throw new Error(`${doc.title}.cardImage: image retrieval/content-type failed.`);
        const bytes = Buffer.from(await response.arrayBuffer());
        const signature = extension === 'png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
          : extension === 'webp' ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
        if (bytes.length > 2_000_000 || !signature) throw new Error(`${doc.title}.cardImage: invalid image bytes or image exceeds 2 MB.`);
        images.set(image, bytes);
      }
      const root = fileURLToPath(config.root), cache = path.join(root, '.cache', 'ald-118', `${randomUUID()}.json`);
      await fs.mkdir(path.dirname(cache), { recursive: true });
      await fs.writeFile(cache, JSON.stringify(view));
      updateConfig({ vite: { define: { 'process.env.CONTENT_LOCAL_CACHE': JSON.stringify(cache) } } });
      injectRoute({ pattern: '/work/[slug]', entrypoint: './src/cms/pages/work/[slug].astro' });
    },
    'astro:build:done': async ({ dir }) => {
      for (const [image, bytes] of images) await fs.writeFile(new URL(image.slice(1), dir), bytes);
    },
  } };
}
