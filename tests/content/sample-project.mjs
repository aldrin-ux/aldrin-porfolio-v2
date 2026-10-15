import { fixture, fixturePolicy, mediaBindings } from './fixtures.mjs';

// Synthetic content only. Existing site fixtures supply the renderer's required globals.
export function sampleSnapshot(stage = 'published') {
  if (!['published', 'edited', 'unpublished'].includes(stage)) throw new Error('Unknown sample stage.');
  const snapshot = fixture();
  if (stage === 'unpublished') return snapshot;
  const title = stage === 'edited' ? 'Synthetic sample project — edited' : 'Synthetic sample project';
  const media = cropIntent => ({
    _type: 'mediaUsage', image: { _type: 'image', asset: { _type: 'reference', _ref: 'image-fixture-0' } },
    alt: 'Existing portfolio owner portrait used as an offline placeholder', decorative: false,
    cropIntent, legacyAssetPaths: ['/assets/aldrin-hero.webp'],
    rights: { _type: 'usageRights', status: 'approved', publicNote: 'Synthetic test flag only; no rights approval granted.' }, reviewFlags: [],
  });
  snapshot.documents.push({
    _id: 'synthetic-sample-project', _type: 'project', _rev: `sample-${stage}`,
    _createdAt: '2026-10-15T00:00:00Z', _updatedAt: '2026-10-15T00:00:00Z',
    title, slug: { _type: 'slug', current: 'sample-project' }, externalUrl: 'https://example.com',
    cardRole: 'Synthetic demonstration', tags: ['Offline sample'],
    cardSummary: 'Synthetic project for local CMS workflow verification. No client work or business claims.',
    cardImage: media('cardTop'), portfolioStatus: 'provisional',
    attribution: { _type: 'projectAttribution', person: { _type: 'reference', _ref: 'portfolioProfile' },
      deliveryCredit: 'Synthetic demonstration', role: 'Sample editor', scope: 'marketingWebsite',
      contributionSummary: 'Demonstrates local published-content rendering only.',
      scopeStatement: 'This invented sample does not describe a client engagement.' },
    caseStudy: { _type: 'caseStudy', eyebrow: 'Synthetic offline sample', heading: title,
      summary: 'A local fixture demonstrates publishing, editing and removal without contacting Sanity.',
      heroImage: media('fullScreenshot'), publicNotices: ['Synthetic sample. Portrait is an offline placeholder; no image rights approval is implied.'],
      seo: { _type: 'seoMetadata', title, description: 'Synthetic local CMS editing demonstration.', indexingRequest: 'noindex' },
      sections: [{ _key: 'sample-section', _type: 'narrativeSection', heading: 'Sample workflow', body: [
        { _key: 'sample-paragraph', _type: 'block', style: 'normal', markDefs: [], children: [
          { _key: 'sample-text', _type: 'span', text: 'Publish a sample, edit its title, then unpublish it before rebuilding locally.', marks: [] },
        ] },
      ] }] },
    editorialReview: { _type: 'editorialReview', state: 'approved' },
  });
  for (const page of snapshot.documents.filter(d => d._type === 'page' && ['home', 'work'].includes(d.routeKey))) {
    page.sections.find(s => s._type === 'projectCollectionSection').selection.push({
      _key: 'synthetic-sample', _type: 'reference', _ref: 'synthetic-sample-project',
    });
  }
  return snapshot;
}

export function samplePolicy(snapshot) {
  const policy = fixturePolicy(snapshot);
  const portrait = mediaBindings['/assets/aldrin-hero.webp'];
  return { ...policy, resolveMedia: input => {
    const binding = policy.resolveMedia(input);
    // Reuse an owner portrait, never a client's screenshot, for sample image slots.
    return binding === portrait && input.usage.cropIntent !== 'portrait'
      ? { ...portrait, card: portrait.hero, study: portrait.hero } : binding;
  } };
}
