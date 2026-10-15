import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLocalTarget, normalizeLocalProjects, localProjectQuery } from '../../src/lib/sanity/local-project.mjs';

const env = { CONTENT_SOURCE: 'static', CONTENT_LOCAL_TEST: '1', SANITY_PROJECT_ID: 'p9xrr86a', SANITY_DATASET: 'ald118-test' };
const sample = () => ({ _id: 'test-document', title: 'Synthetic sample', slug: { current: 'sample-project' }, cardSummary: 'Synthetic summary.',
  cardImage: { alt: 'Synthetic diagram', decorative: false, rights: { status: 'approved' }, image: { asset: { _id: 'image-test',
    url: 'https://cdn.sanity.io/images/p9xrr86a/ald118-test/test-640x400.png', metadata: { dimensions: { width: 640, height: 400 } } } } } });
const paragraph = text => [{ _key: 'p1', _type: 'block', style: 'normal', markDefs: [], children: [
  { _key: 's1', _type: 'span', text, marks: ['strong', 'em'] },
] }];

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
    d => d.cardImage.alt = '', d => { d.cardImage.decorative = true; d.cardImage.alt = '<script>bad</script>'; },
    d => d.cardImage.rights.status = 'unreviewed',
    d => d.cardImage.image.asset.url = 'https://cdn.sanity.io/images/p9xrr86a/production/test.png',
    d => d.cardImage.image.asset.url = 'https://example.com/test.png',
    d => d.cardImage.image.asset.metadata.dimensions.width = 0]) {
    const doc = sample(); mutate(doc); assert.throws(() => normalizeLocalProjects([doc]));
  }
  assert.throws(() => normalizeLocalProjects([sample(), sample()]));
});

test('multiple published projects have independent routes and media; duplicate slugs are reported', () => {
  const first = sample(), second = sample();
  second._id = 'second'; second.title = 'MCFLY fixture'; second.slug.current = 'mcfly-industries';
  second.cardImage.image.asset.url = second.cardImage.image.asset.url.replace('.png', '.jpg');
  second.cardImage.decorative = true; second.cardImage.alt = null;
  const view = normalizeLocalProjects([first, second]);
  assert.deepEqual(view.projects.map(p => p.slug), ['sample-project', 'mcfly-industries']);
  assert.equal(view.projects[1].alt, '');
  assert.equal(view.projects[1].image, '/assets/ald118-mcfly-industries.jpg');
  assert.notEqual(view.projects[0].image, view.projects[1].image);
  second.slug.current = 'sample-project';
  assert.throws(() => normalizeLocalProjects([first, second]), /slug.current: duplicate published slug/);
});

test('validation reports every missing required field with the project identifier', () => {
  const doc = sample(); doc.title = ''; doc.cardSummary = null; doc.cardImage.alt = null;
  assert.throws(() => normalizeLocalProjects([doc]), error => {
    for (const field of ['title', 'cardSummary', 'cardImage.alt']) assert.ok(error.message.includes(`(test-document).${field}:`));
    return true;
  });
  for (const slug of ['index', 'new', 'preview', 'success', '../escape', 'Two Words']) {
    const invalid = sample(); invalid.slug.current = slug;
    assert.throws(() => normalizeLocalProjects([invalid]), /slug.current:/);
  }
});

test('stored case-study fields normalize into rich narrative, role/platform, SEO and separate media', () => {
  const doc = sample(); doc.cardRole = 'Developer'; doc.tags = ['Webflow'];
  doc.cardImage.caption = '**Literal image caption**';
  doc.caseStudy = { summary: 'Project overview.', heading: 'Case-study heading',
    sections: ['The Challenge', 'My Contribution', 'Development Approach', 'Outcome'].map((heading, i) => ({ _key: `section-${i}`, heading, body: paragraph(`Narrative ${i} & evidence.`) })),
    heroImage: structuredClone(doc.cardImage), seo: { title: 'Search title', description: 'Search description', socialImage: structuredClone(doc.cardImage) } };
  doc.screenshots = [{ ...structuredClone(doc.cardImage), _key: 'screenshot', caption: 'Additional screenshot.' }];
  const stored = JSON.parse(JSON.stringify(doc)); // ordinary stored Sanity values, no Markdown conversion.
  const view = normalizeLocalProjects([stored]), study = view.caseStudies['sample-project'];
  assert.equal(study.summary, 'Project overview.'); assert.equal(study.heading, 'Case-study heading');
  assert.match(study.sections[0].html, /<em><strong>Narrative 0 &amp; evidence\.<\/strong><\/em>/);
  assert.equal(study.sections[1].title, 'My Contribution');
  assert.equal(study.seoTitle, 'Search title'); assert.equal(study.seoDescription, 'Search description');
  assert.match(study.socialImage, /-social\.png$/); assert.equal(study.noindex, true);
  assert.equal(study.imageCaption, '**Literal image caption**');
  assert.equal(study.screenshots[0].caption, 'Additional screenshot.');
  assert.equal(new Set(view.mediaFiles.map(file => file.image)).size, 4);
  assert.ok(study.details.some(([key, value]) => key === 'Role' && value === 'Developer'));
  assert.equal(view.projects[0].tags[0], 'Webflow');
  assert.deepEqual(doc, stored, 'normalization must not mutate stored content');
});

test('missing optional narrative/SEO/media uses safe defaults; present invalid narrative fails by field', () => {
  const doc = sample();
  assert.deepEqual(normalizeLocalProjects([doc]).caseStudies['sample-project'].sections, []);
  assert.equal(normalizeLocalProjects([doc]).caseStudies['sample-project'].seoTitle, doc.title);
  for (const mutate of [d => d.caseStudy.sections[0].body = [], d => d.caseStudy.sections[0].heading = '',
    d => d.caseStudy.sections[0].body[0].children[0].text = '<script>x</script>',
    d => d.caseStudy.sections[0].body[0].children[0].marks = ['unsupported'],
    d => d.caseStudy.sections[0].body[0].listItem = 'bullet']) {
    const invalid = sample(); invalid.caseStudy = { sections: [{ _key: 's', heading: 'The Challenge', body: paragraph('Ordinary text.') }] };
    mutate(invalid); assert.throws(() => normalizeLocalProjects([invalid]), /caseStudy.sections\[0\]/);
  }
  doc.caseStudy = { seo: { title: '' } };
  assert.throws(() => normalizeLocalProjects([doc]), /caseStudy.seo.title/);
});
