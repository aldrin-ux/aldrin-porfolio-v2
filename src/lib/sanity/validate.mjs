import { createHash } from 'node:crypto';
import { documentTypes, models, sectionTypes, retainedSlugs, reservedSlugs } from './model.mjs';

export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fail = message => { throw new Error(`Content validation: ${message}`); };
const isRecord = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const present = v => v !== undefined && v !== null;
export function safeText(v) { return typeof v === 'string' && !!v.trim() && !/<\/?[a-z][^>]*>/i.test(v); }
export function safeUrl(v) {
  try { const u = new URL(v); return typeof v === 'string' && u.protocol === 'https:' && !!u.hostname && !u.username && !u.password; } catch { return false; }
}
export function projectPath(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || reservedSlugs.includes(slug)) fail('invalid or reserved project slug.');
  return `/work/${slug}/`;
}
const sys = ['_id', '_type', '_rev', '_createdAt', '_updatedAt', '_key'];
function onlyKeys(value, allowed, path) {
  if (Object.keys(value).some(k => !allowed.includes(k))) fail(`${path} contains an unexpected field.`);
}
function keys(list, path) {
  const primitives = list.filter(v => !isRecord(v));
  if (new Set(primitives).size !== primitives.length) fail(`${path} repeats a value.`);
  const objects = list.filter(isRecord), values = objects.map(v => v._key);
  if (values.some(v => typeof v !== 'string' || !v) || new Set(values).size !== values.length) fail(`${path} needs unique stable item keys.`);
  const refs = objects.filter(v => v._type === 'reference').map(v => v._ref);
  if (new Set(refs).size !== refs.length) fail(`${path} repeats a reference.`);
}
function validateValue(value, rule, path, state) {
  if (!present(value)) { if (!rule.optional) fail(`${path} is required.`); return; }
  switch (rule.kind) {
    case 'text': if (!safeText(value)) fail(`${path} must be nonempty plain text.`); break;
    case 'boolean': if (typeof value !== 'boolean') fail(`${path} must be boolean.`); break;
    case 'enum': if (!rule.values.includes(value)) fail(`${path} has an invalid choice.`); break;
    case 'year': if (!Number.isInteger(value) || value < 1000 || value > 9999) fail(`${path} must be a four-digit year, not a month or date.`); break;
    case 'fraction': if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) fail(`${path} must be between zero and one.`); break;
    case 'commit': if (!/^[a-f0-9]{40}$/.test(value)) fail(`${path} must identify the source commit.`); break;
    case 'anchor': if (!/^[a-z][a-z0-9-]*$/.test(value)) fail(`${path} is not a stable section anchor.`); break;
    case 'path': if (!/^\/(?:[a-z0-9-]+\/)*$/.test(value)) fail(`${path} is not an internal trailing-slash path.`); break;
    case 'url': if (!safeUrl(value)) fail(`${path} must be HTTPS without credentials.`); break;
    case 'slug':
      if (!isRecord(value) || value._type !== 'slug') fail(`${path} is not a slug.`);
      onlyKeys(value, ['_type', 'current'], path); projectPath(value.current); break;
    case 'reference': {
      if (!isRecord(value) || value._type !== 'reference' || typeof value._ref !== 'string' || !value._ref || value._weak === true || /^(drafts|versions)\./.test(value._ref)) fail(`${path} must be a strong published reference.`);
      onlyKeys(value, ['_type', '_ref', '_weak', '_key'], path);
      const target = state.index.get(value._ref);
      if (!target || !rule.to.includes(target._type)) fail(`${path} has a missing, unpublished or incorrectly typed reference.`);
      break;
    }
    case 'array':
      if (!Array.isArray(value) || value.length < rule.minimum) fail(`${path} needs its required items.`);
      keys(value, path); value.forEach((v, i) => validateValue(v, rule.item, `${path}[${i}]`, state)); break;
    case 'object': validateObject(value, rule.type, path, state); break;
    case 'portableText': validatePortableText(value, path, state); break;
    case 'sections':
      if (!Array.isArray(value) || !value.length) fail(`${path} needs sections.`);
      keys(value, path);
      value.forEach((v, i) => { if (!sectionTypes.includes(v?._type)) fail(`${path} has an unsupported section.`); validateObject(v, v._type, `${path}[${i}]`, state); }); break;
    default: fail('unknown validation contract.');
  }
}
function validatePortableText(value, path, state) {
  if (!Array.isArray(value) || !value.length) fail(`${path} needs paragraphs.`);
  keys(value, path);
  for (const block of value) {
    if (!isRecord(block) || block._type !== 'block' || block.style !== 'normal' || !Array.isArray(block.children) || !block.children.length || !Array.isArray(block.markDefs)) fail(`${path} only accepts ordinary paragraphs.`);
    onlyKeys(block, ['_key', '_type', 'style', 'children', 'markDefs'], path); keys(block.children, path); keys(block.markDefs, path);
    block.markDefs.forEach(v => validateObject(v, 'link', path, state));
    const marks = new Set(['strong', 'em', ...block.markDefs.map(m => m._key)]);
    for (const span of block.children) {
      if (!isRecord(span) || span._type !== 'span' || typeof span.text !== 'string' || (span.text !== '' && !safeText(span.text)) || !Array.isArray(span.marks) || span.marks.some(m => !marks.has(m))) fail(`${path} has unsafe or unsupported text.`);
      onlyKeys(span, ['_key', '_type', 'text', 'marks'], path);
    }
    if (!block.children.some(s => s.text.trim())) fail(`${path} has an empty paragraph.`);
  }
}
function validateObject(value, type, path, state) {
  if (!isRecord(value) || ![type, `sanity.${type}`].includes(value._type)) fail(`${path} has the wrong object type.`);
  onlyKeys(value, [...sys, ...Object.keys(models[type])], path);
  for (const [name, rule] of Object.entries(models[type])) {
    if (type === 'mediaUsage' && name === 'alt' && value.decorative === true && value.alt === '') continue;
    validateValue(value[name], rule, `${path}.${name}`, state);
  }
  if (type === 'mediaUsage') {
    if (!value.decorative && !safeText(value.alt)) fail(`${path} needs informative alt text.`);
    if (value.rights.status !== 'approved') fail(`${path} has unapproved media rights.`);
    if (present(value.rights.creditLine) || present(value.caption)) fail(`${path} requires a reviewed credit/caption presentation before publication.`);
    if (present(value.image.crop) || present(value.image.hotspot)) fail(`${path} requires reviewed crop/hotspot derivative ingestion before publication.`);
    state.media.push({ usage: value, path });
  }
  if (type === 'link') {
    if (value.kind === 'internal' && (!value.target || present(value.externalUrl) || value.newWindow !== false)) fail(`${path} has an invalid internal destination.`);
    if (value.kind === 'external' && (!value.externalUrl || present(value.target) || present(value.fragment) || value.newWindow !== true)) fail(`${path} has an invalid external destination.`);
    state.links.push(value);
  }
  if (type === 'textSection' && (Boolean(value.paragraphs?.length) === Boolean(value.body?.length))) fail(`${path} needs exactly one text content mode.`);
  if (type === 'toolItem' && !value.logo && !safeText(value.wordmark)) fail(`${path} needs a logo or wordmark.`);
  if (type === 'professionalExperience' && value.endYear < value.startYear) fail(`${path} has reversed employment years.`);
  if (type === 'narrativeSection' && ['My contribution', 'Scope and credit'].includes(value.heading)) fail(`${path} duplicates canonical attribution.`);
  if (type === 'project') {
    const slug = value.slug.current;
    if (retainedSlugs.includes(slug) && (value.attribution.deliveryCredit !== 'Dazlab' || value.attribution.role !== 'Sole Webflow developer')) fail(`${path} must retain Dazlab Webflow attribution.`);
    if (value.portfolioStatus === 'provisional' && !value.caseStudy.publicNotices?.length) fail(`${path} needs public provisional notices.`);
    if (value.migration?.legacyPath && value.migration.legacyPath !== projectPath(slug)) fail(`${path} changed an existing route.`);
  }
}
export function slots(page) {
  const sections = page.sections;
  const expected = {
    home: ['heroSection', 'toolsSection', 'projectCollectionSection', 'featureListSection', 'featureListSection', 'profileSection', 'experienceSection', 'ctaSection'],
    about: ['profileSection', 'experienceSection'], work: ['projectCollectionSection', 'ctaSection'],
    contact: ['textSection', 'featureListSection', 'featureListSection'],
  }[page.routeKey];
  if (JSON.stringify(sections.map(s => s._type)) !== JSON.stringify(expected)) fail(`${page.routeKey} does not match the approved template slots/order.`);
  const anchors = sections.map(s => s.anchor).filter(Boolean);
  if (new Set(anchors).size !== anchors.length) fail(`${page.routeKey} repeats a section anchor.`);
  if (page.routeKey === 'home' && JSON.stringify(sections.slice(2).map(s => s.anchor)) !== JSON.stringify(['work', 'expertise', 'workflow', 'about', 'experience', 'contact'])) fail('home anchor/order changed.');
  return sections;
}
/** Validates the whole snapshot independently, then requires trusted revision/media approval. */
export async function validateSnapshot(snapshot, policy) {
  if (!policy?.assertDocument || !policy?.resolveMedia) fail('publication approval provider is not configured; live CMS builds remain blocked.');
  if (!isRecord(snapshot) || !Array.isArray(snapshot.documents) || !Array.isArray(snapshot.assets)) fail('incomplete published snapshot.');
  onlyKeys(snapshot, ['documents', 'assets'], 'snapshot');
  const index = new Map();
  for (const doc of [...snapshot.documents, ...snapshot.assets]) {
    if (!isRecord(doc) || !safeText(doc._id) || !safeText(doc._rev) || /^(drafts|versions)\./.test(doc._id) || index.has(doc._id)) fail('duplicate, draft/version, missing ID or revision in published data.');
    index.set(doc._id, doc);
  }
  const state = { index, media: [], links: [] };
  for (const asset of snapshot.assets) {
    onlyKeys(asset, ['_id', '_type', '_rev', 'url', 'metadata'], 'asset');
    if (asset._type !== 'sanity.imageAsset' || !safeUrl(asset.url)) fail('invalid media asset.');
    const u = new URL(asset.url);
    if (u.hostname !== 'cdn.sanity.io' || !u.pathname.startsWith('/images/p9xrr86a/production/')) fail('asset is outside the approved project/dataset.');
    const d = asset.metadata?.dimensions;
    if (!d || !Number.isInteger(d.width) || !Number.isInteger(d.height) || d.width <= 0 || d.height <= 0) fail('missing asset dimensions.');
    onlyKeys(asset.metadata, ['dimensions'], 'asset metadata'); onlyKeys(d, ['width', 'height', 'aspectRatio'], 'asset dimensions');
  }
  for (const doc of snapshot.documents) {
    if (!documentTypes.includes(doc._type)) fail('unknown document type.');
    if (![doc._createdAt, doc._updatedAt].every(v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v)))) fail('missing or invalid document timestamps.');
    validateObject(doc, doc._type, doc._id, state);
    if (doc.editorialReview.state !== 'approved') fail(`${doc._id} still needs editorial review.`);
    if (await policy.assertDocument(doc._id, doc._rev, digest(doc)) !== true) fail(`${doc._id} lacks protected revision approval.`);
  }
  const single = (type, id) => {
    const docs = snapshot.documents.filter(d => d._type === type);
    if (docs.length !== 1 || docs[0]._id !== id) fail(`missing or duplicate required ${type}.`);
    return docs[0];
  };
  const settings = single('siteSettings', 'siteSettings'), profile = single('portfolioProfile', 'portfolioProfile'), navigation = single('navigation', 'navigation-primary');
  if (settings.profile._ref !== profile._id || settings.primaryNavigation._ref !== navigation._id || settings.siteName !== profile.name) fail('global identity/reference mismatch.');
  const pages = snapshot.documents.filter(d => d._type === 'page');
  if (pages.length !== 4 || new Set(pages.map(p => p.routeKey)).size !== 4) fail('missing or duplicate required page.');
  const pageMap = Object.fromEntries(pages.map(p => [p.routeKey, p]));
  pages.forEach(slots);
  const projects = snapshot.documents.filter(d => d._type === 'project');
  if (new Set(projects.map(p => p.slug.current)).size !== projects.length) fail('duplicate project slug.');
  const sourceKeys = snapshot.documents.map(d => d.migration?.sourceKey).filter(Boolean);
  if (new Set(sourceKeys).size !== sourceKeys.length) fail('duplicate migration source key.');
  for (const slug of retainedSlugs) {
    const p = projects.find(p => p.slug.current === slug);
    if (!p || p.migration?.sourceKey !== `portfolio-v2/project/${slug}` || p.migration?.legacyPath !== projectPath(slug)) fail(`missing or changed retained route ${slug}.`);
  }
  if (projects.some(p => p.attribution.person._ref !== profile._id)) fail('project contributor is not the approved profile.');
  const home = slots(pageMap.home), about = slots(pageMap.about), work = slots(pageMap.work), contact = slots(pageMap.contact);
  if (projects.some(p => p.cardImage.cropIntent !== 'cardTop' || p.caseStudy.heroImage.cropIntent !== 'fullScreenshot') ||
      [home[0].portrait, profile.heroPortrait, profile.aboutPortrait, about[0].portrait ?? profile.aboutPortrait].some(m => m.cropIntent !== 'portrait')) fail('media intent does not match its approved presentation slot.');
  const same = (a, b) => JSON.stringify(a.map(v => v._ref)) === JSON.stringify(b.map(v => v._ref));
  if (!same(home[2].selection, work[0].selection) || work[0].selection.length !== projects.length) fail('project selections must cover the same published projects.');
  if (home[5].profile._ref !== profile._id || about[0].profile._ref !== profile._id || home[5].variant !== 'summary' || about[0].variant !== 'biography' || !same(home[6].entries, profile.experience) || !same(about[1].entries, profile.experience)) fail('profile/experience selections are inconsistent.');
  if (profile.summaryParagraphs.length !== 2 || profile.biographyParagraphs.length !== 2 || home[0].actions.length !== 2 || home[7].actions.length !== 2 || contact[1].items.length !== 2 || contact[1].actions?.length !== 1 || contact[2].items.length !== 3 || work[1].actions.length !== 1) fail('content does not fit the approved presentation slots.');
  if (!/^[^.]+\. [^.]+\.$/.test(profile.profileHeading)) fail('profile heading must retain the two-part presentation pattern.');
  for (const link of state.links) if (link.kind === 'internal' && link.fragment) {
    const target = index.get(link.target._ref);
    if (target._type !== 'page' || !target.sections.some(s => s.anchor === link.fragment)) fail('link points to a nonexistent published fragment.');
  }
  const labels = navigation.items.map(l => l.label), destinations = navigation.items.map(l => l.kind === 'external' ? l.externalUrl : `${l.target._ref}#${l.fragment ?? ''}`);
  if (new Set(labels).size !== labels.length || new Set(destinations).size !== destinations.length) fail('duplicate navigation label or destination.');
  const media = new Map();
  for (const { usage, path } of state.media) {
    const asset = index.get(usage.image.asset._ref);
    const binding = await policy.resolveMedia({ usage, path, asset });
    if (!binding || binding.assetId !== asset._id || !usage.legacyAssetPaths?.includes(binding.originalPath)) fail(`${path} lacks approved local asset eligibility.`);
    media.set(usage, binding);
  }
  return { index, settings, profile, navigation, pageMap, projects: work[0].selection.map(r => index.get(r._ref)), media };
}
