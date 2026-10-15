import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { safeText, safeUrl, projectPath } from './validate.mjs';
import { retainedSlugs } from './model.mjs';
import { renderPortableText } from './normalize.mjs';

const mediaProjection = '{_key,alt,decorative,caption,rights{status,creditLine},image{asset->{_id,url,metadata{dimensions}}}}';
export const localProjectQuery = `*[_type == "project" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
  _id,title,slug,cardSummary,cardRole,tags,externalUrl,cardImage${mediaProjection},screenshots[]${mediaProjection},
  caseStudy{summary,heading,eyebrow,heroImage${mediaProjection},seo{title,description,socialImage${mediaProjection}},
    sections[]{_key,heading,body[]{_key,_type,style,listItem,level,children[]{_key,_type,text,marks},markDefs[]{_key,_type}}}}
} | order(slug.current asc, _id asc)`;
export function assertLocalTarget(env) {
  if (env.NETLIFY || env.CI || env.CONTENT_SOURCE !== 'static' || env.CONTENT_LOCAL_TEST !== '1'
    || env.SANITY_PROJECT_ID !== 'p9xrr86a' || env.SANITY_DATASET !== 'ald118-test') {
    throw new Error('Local test requires explicit static overlay, p9xrr86a/ald118-test, and no hosting/CI.');
  }
}
export function normalizeLocalProjects(documents) {
  if (!Array.isArray(documents)) throw new Error('Local project validation: expected an array of published projects.');
  const projects = [], caseStudies = {}, mediaFiles = [], errors = [], slugs = new Set(), ids = new Set();
  for (const [index, doc] of documents.entries()) {
    const label = safeText(doc?.title) ? doc.title : `document ${index + 1}`;
    const invalid = (field, message) => errors.push(`${label} (${doc?._id ?? 'missing ID'}).${field}: ${message}`);
    const before = errors.length, slug = doc?.slug?.current;
    const optionalText = (value, field) => { if (value != null && !safeText(value)) invalid(field, 'when supplied, use nonempty plain text without HTML.'); };
    if (!safeText(doc?._id) || /^(drafts|versions)\./.test(doc._id)) invalid('_id', 'must identify a published document, not a draft/version.');
    if (ids.has(doc?._id)) invalid('_id', 'duplicate document ID.');
    ids.add(doc?._id);
    try { projectPath(slug); } catch { invalid('slug.current', 'use a non-reserved lowercase slug with single hyphens.'); }
    if (retainedSlugs.includes(slug)) invalid('slug.current', `collides with existing static route /work/${slug}/.`);
    if (slugs.has(slug)) invalid('slug.current', `duplicate published slug "${slug}".`);
    slugs.add(slug);
    for (const field of ['title', 'cardSummary']) if (!safeText(doc?.[field])) invalid(field, 'required nonempty plain text without HTML.');
    const image = (media, field, suffix = '') => {
      const start = errors.length, asset = media?.image?.asset;
      if (typeof media?.decorative !== 'boolean') invalid(`${field}.decorative`, 'choose informative or decorative.');
      if (media?.decorative !== true && !safeText(media?.alt)) invalid(`${field}.alt`, 'required nonempty plain text for an informative image.');
      if (media?.decorative === true && media.alt != null && media.alt !== '' && !safeText(media.alt)) invalid(`${field}.alt`, 'when supplied, use plain text without HTML.');
      optionalText(media?.caption, `${field}.caption`); optionalText(media?.rights?.creditLine, `${field}.rights.creditLine`);
      if (media?.rights?.status !== 'approved') invalid(`${field}.rights.status`, 'usage rights must be approved.');
      if (!asset?._id?.startsWith('image-')) invalid(`${field}.image.asset`, 'required resolved image asset.');
      const url = safeUrl(asset?.url) ? new URL(asset.url) : null;
      const extension = url?.pathname.match(/^\/images\/p9xrr86a\/ald118-test\/[a-zA-Z0-9-]+\.(png|jpg|jpeg|webp)$/)?.[1];
      if (!url || url.hostname !== 'cdn.sanity.io' || !extension || url.search || url.hash) invalid(`${field}.image.asset.url`, 'must be a PNG, JPEG or WebP in p9xrr86a/ald118-test.');
      const dimensions = asset?.metadata?.dimensions;
      if (!dimensions || ![dimensions.width, dimensions.height].every(n => Number.isInteger(n) && n > 0 && n <= 4096)) invalid(`${field}.image.asset.metadata.dimensions`, 'width and height must be integers between 1 and 4096.');
      if (errors.length !== start) return null;
      const src = `/assets/ald118-${slug}${suffix}.${extension}`;
      mediaFiles.push({ image: src, url: asset.url, label: `${label}.${field}` });
      return { src, srcset: `${src} ${dimensions.width}w`, width: dimensions.width, height: dimensions.height,
        alt: media.decorative ? '' : media.alt, caption: media.caption ?? '', credit: media.rights.creditLine ?? '' };
    };
    const cover = image(doc?.cardImage, 'cardImage');
    const study = doc?.caseStudy;
    if (study != null && (typeof study !== 'object' || Array.isArray(study))) invalid('caseStudy', 'must be a case-study object.');
    for (const field of ['summary', 'heading', 'eyebrow']) optionalText(study?.[field], `caseStudy.${field}`);
    optionalText(doc?.cardRole, 'cardRole');
    if (doc?.externalUrl != null && !safeUrl(doc.externalUrl)) invalid('externalUrl', 'use HTTPS without embedded credentials.');
    if (doc?.tags != null && (!Array.isArray(doc.tags) || doc.tags.some(tag => !safeText(tag)) || new Set(doc.tags).size !== doc.tags.length)) invalid('tags', 'use unique, nonempty plain-text platform names.');
    const seo = study?.seo;
    if (seo != null && (typeof seo !== 'object' || Array.isArray(seo))) invalid('caseStudy.seo', 'must be an SEO object.');
    optionalText(seo?.title, 'caseStudy.seo.title'); optionalText(seo?.description, 'caseStudy.seo.description');
    const hero = study?.heroImage ? image(study.heroImage, 'caseStudy.heroImage', '-hero') : cover;
    const social = seo?.socialImage ? image(seo.socialImage, 'caseStudy.seo.socialImage', '-social') : hero;
    const screenshots = [], screenshotKeys = new Set();
    if (doc?.screenshots != null && !Array.isArray(doc.screenshots)) invalid('screenshots', 'must be a list of media usages.');
    if (Array.isArray(doc?.screenshots)) for (const [i, usage] of doc.screenshots.entries()) {
      if (typeof usage?._key !== 'string' || !usage._key || screenshotKeys.has(usage._key)) invalid(`screenshots[${i}]._key`, 'use a unique stable screenshot key.');
      screenshotKeys.add(usage?._key);
      const result = image(usage, `screenshots[${i}]`, `-screenshot-${i + 1}`); if (result) screenshots.push(result);
    }
    const sections = [], sectionKeys = new Set();
    if (study?.sections != null && !Array.isArray(study.sections)) invalid('caseStudy.sections', 'must be a list of narrative sections.');
    if (Array.isArray(study?.sections)) for (const [i, section] of study.sections.entries()) {
      const field = `caseStudy.sections[${i}]`, start = errors.length;
      if (typeof section?._key !== 'string' || !section._key || sectionKeys.has(section._key)) invalid(`${field}._key`, 'use a unique stable section key.');
      sectionKeys.add(section?._key);
      if (!safeText(section?.heading)) invalid(`${field}.heading`, 'required nonempty plain text.');
      const body = section?.body, blockKeys = new Set();
      if (!Array.isArray(body) || !body.length) invalid(`${field}.body`, 'add at least one ordinary paragraph.');
      if (Array.isArray(body)) for (const [j, block] of body.entries()) {
        const children = block?.children, spanKeys = new Set();
        if (typeof block?._key !== 'string' || !block._key || blockKeys.has(block._key) || block._type !== 'block' || block.style !== 'normal' || block.listItem != null || block.level != null
          || !Array.isArray(block.markDefs) || block.markDefs.length || !Array.isArray(children) || !children.length
          || !children.some(span => typeof span?.text === 'string' && span.text.trim())) invalid(`${field}.body[${j}]`, 'use keyed ordinary paragraphs with text, bold/emphasis only, and no link annotations.');
        blockKeys.add(block?._key);
        if (Array.isArray(children)) for (const span of children) {
          if (typeof span?._key !== 'string' || !span._key || spanKeys.has(span._key) || span._type !== 'span' || typeof span.text !== 'string'
            || (span.text !== '' && !safeText(span.text)) || !Array.isArray(span.marks) || span.marks.some(mark => !['strong', 'em'].includes(mark))) invalid(`${field}.body[${j}]`, 'use keyed plain-text spans and supported bold/emphasis marks.');
          spanKeys.add(span?._key);
        }
      }
      if (errors.length === start) sections.push({ title: section.heading, html: renderPortableText(body, new Map()) });
    }
    if (errors.length !== before) continue;
    projects.push({ title: doc.title, slug, href: `/work/${slug}/`, externalUrl: doc.externalUrl ?? 'https://example.com',
      role: doc.cardRole ?? 'Local CMS test', tags: doc.tags ?? ['Local CMS test'], summary: doc.cardSummary, image: cover.src, alt: cover.alt, imageVariant: cover });
    caseStudies[slug] = { title: doc.title, heading: study?.heading ?? doc.title, eyebrow: study?.eyebrow ?? 'Isolated CMS test',
      url: doc.externalUrl ?? 'https://example.com', image: hero.src, imageAlt: hero.alt, imageVariant: hero,
      imageCaption: hero.caption, imageCredit: hero.credit, screenshots,
      summary: study?.summary ?? doc.cardSummary, seoTitle: seo?.title ?? doc.title,
      seoDescription: seo?.description ?? study?.summary ?? doc.cardSummary, socialImage: social.src, noindex: true,
      creditText: 'Local test content only.', details: [['Status', 'Isolated local test'],
        ...(doc.cardRole ? [['Role', doc.cardRole]] : []), ...(doc.tags?.length ? [['Platform', doc.tags.join(', ')]] : [])],
      sections,
      missingFacts: ['Isolated test dataset. Not part of the live portfolio.'] };
  }
  if (errors.length) throw new Error(`Local project validation:\n- ${errors.join('\n- ')}`);
  return { target: 'p9xrr86a/ald118-test', projects, caseStudies, mediaFiles };
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
      const { mediaFiles, ...view } = normalizeLocalProjects(documents);
      for (const { image, url, label } of mediaFiles) {
        const extension = image.split('.').at(-1);
        const response = await fetchMedia(url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
        const expectedType = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }[extension];
        if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== expectedType) throw new Error(`${label}: image retrieval/content-type failed.`);
        const bytes = Buffer.from(await response.arrayBuffer());
        const signature = extension === 'png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
          : extension === 'webp' ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
        if (bytes.length > 2_000_000 || !signature) throw new Error(`${label}: invalid image bytes or image exceeds 2 MB.`);
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
