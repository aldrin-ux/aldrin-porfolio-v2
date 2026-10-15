// Independent public-data contract, matched to PR #10 (5f18174).
// This module deliberately does not import Studio rules or its validation engine.
const text = { kind: 'text' };
const optional = field => ({ ...field, optional: true });
const enumOf = (...values) => ({ kind: 'enum', values });
const ref = (...to) => ({ kind: 'reference', to });
const array = item => ({ kind: 'array', item, minimum: 1 });
const object = type => ({ kind: 'object', type });
const year = { kind: 'year' };
const boolean = { kind: 'boolean' };
const url = { kind: 'url' };
const section = {
  anchor: optional({ kind: 'anchor' }), eyebrow: optional(text), heading: text, description: optional(text),
};
const review = { editorialReview: object('editorialReview'), migration: optional(object('migrationMetadata')) };
export const models = {
  editorialReview: { state: enumOf('needsReview', 'approved'), publicWarnings: optional(array(text)) },
  migrationMetadata: { sourceSystem: text, sourceKey: text, sourceCommit: { kind: 'commit' }, sourceLocations: array(text), legacyPath: optional({ kind: 'path' }) },
  brand: { shortName: text, avatarText: text, avatarLabel: text },
  usageRights: { status: enumOf('unreviewed', 'approved', 'restricted', 'rejected'), creditLine: optional(text), publicNote: optional(text) },
  mediaUsage: {
    image: object('image'), alt: optional(text), decorative: boolean, caption: optional(text),
    cropIntent: enumOf('cardTop', 'fullScreenshot', 'portrait'), legacyAssetPaths: optional(array(text)), rights: object('usageRights'),
    reviewFlags: { kind: 'array', item: enumOf('testimonials', 'metrics', 'dashboard', 'thirdPartyLogo', 'portrait', 'provenanceUnknown'), minimum: 0 },
  },
  image: { asset: ref('sanity.imageAsset'), crop: optional(object('imageCrop')), hotspot: optional(object('imageHotspot')) },
  imageCrop: { top: { kind: 'fraction' }, bottom: { kind: 'fraction' }, left: { kind: 'fraction' }, right: { kind: 'fraction' } },
  imageHotspot: { x: { kind: 'fraction' }, y: { kind: 'fraction' }, width: { kind: 'fraction' }, height: { kind: 'fraction' } },
  link: { label: text, kind: enumOf('internal', 'external'), target: optional(ref('page', 'project')), fragment: optional({ kind: 'anchor' }), externalUrl: optional(url), newWindow: boolean },
  seoMetadata: { title: text, description: text, socialImage: optional(object('mediaUsage')), indexingRequest: enumOf('inherit', 'noindex') },
  capability: { name: text, applicability: enumOf('confirmed', 'contextOnly') },
  projectAttribution: { person: ref('portfolioProfile'), deliveryCredit: text, role: text, scope: enumOf('marketingWebsite'), contributionSummary: text, scopeStatement: text, capabilities: optional(array(object('capability'))) },
  narrativeSection: { heading: text, body: { kind: 'portableText' } },
  caseStudy: { eyebrow: text, heading: text, summary: text, heroImage: object('mediaUsage'), sections: array(object('narrativeSection')), publicNotices: optional(array(text)), seo: object('seoMetadata') },
  featureItem: { title: text, text },
  toolItem: { name: text, logo: optional(object('mediaUsage')), wordmark: optional(text) },
  heroSection: { ...section, heading: optional(text), introLabel: text, leftHeading: text, rightHeading: text, leftText: text, rightText: text, leftLink: object('link'), rightLink: object('link'), portrait: object('mediaUsage'), actions: array(object('link')) },
  textSection: { ...section, paragraphs: optional(array(text)), body: optional({ kind: 'portableText' }) },
  featureListSection: { ...section, items: array(object('featureItem')), actions: optional(array(object('link'))) },
  ctaSection: { ...section, body: optional(text), actions: array(object('link')) },
  projectCollectionSection: { ...section, selection: array(ref('project')), labels: optional(array(text)) },
  profileSection: { ...section, profile: ref('portfolioProfile'), variant: enumOf('summary', 'biography'), portrait: optional(object('mediaUsage')) },
  experienceSection: { ...section, entries: array(ref('professionalExperience')) },
  toolsSection: { ...section, items: array(object('toolItem')) },
  siteSettings: { siteName: text, language: enumOf('en'), defaultSeo: object('seoMetadata'), profile: ref('portfolioProfile'), primaryNavigation: ref('navigation'), brand: object('brand'), footerText: text, ...review },
  portfolioProfile: { name: text, professionalTitle: text, summaryParagraphs: array(text), biographyParagraphs: array(text), profileHeading: text, socialLinks: array(object('link')), heroPortrait: object('mediaUsage'), aboutPortrait: object('mediaUsage'), experience: array(ref('professionalExperience')), ...review },
  professionalExperience: { company: text, role: text, startYear: year, endYear: year, datePrecision: enumOf('year'), description: text, ...review },
  project: { title: text, slug: { kind: 'slug' }, externalUrl: url, cardRole: text, tags: array(text), cardSummary: text, cardImage: object('mediaUsage'), attribution: object('projectAttribution'), caseStudy: object('caseStudy'), portfolioStatus: enumOf('provisional', 'verified'), projectYear: optional(year), ...review },
  navigation: { title: text, items: array(object('link')), ...review },
  page: { title: text, routeKey: enumOf('home', 'about', 'work', 'contact'), seo: object('seoMetadata'), sections: { kind: 'sections' }, ...review },
};
export const documentTypes = ['siteSettings', 'portfolioProfile', 'professionalExperience', 'project', 'navigation', 'page'];
export const sectionTypes = ['heroSection', 'textSection', 'featureListSection', 'ctaSection', 'projectCollectionSection', 'profileSection', 'experienceSection', 'toolsSection'];
export const retainedSlugs = ['dazlab', 'mortar', 'handl', 'tangilla'];
export const reservedSlugs = ['index', 'new', 'preview', 'success'];
