// Optional local verification with the existing Studio dependency; not a root/CI dependency.
import assert from 'node:assert/strict';
import { parse,evaluate } from '../../studio/node_modules/groq-js/dist/index.js';
import { documentsQuery,assetsQuery,revisionsQuery } from '../../src/lib/sanity/queries.mjs';
import { fixture,fixturePolicy } from './fixtures.mjs';
import { validateSnapshot } from '../../src/lib/sanity/validate.mjs';
import { localProjectQuery, normalizeLocalProjects } from '../../src/lib/sanity/local-project.mjs';
const snapshot=fixture();const draft={...snapshot.documents[0],_id:'drafts.siteSettings'};
const version={...snapshot.documents[0],_id:'versions.test.siteSettings'};
const dataset=[...snapshot.documents,...snapshot.assets,draft,version,{_id:'private',_type:'privateSecret',secret:'not projected'}];
const run=async query=>(await evaluate(parse(query.text),{dataset,params:query.params})).get();
const documents=await run(documentsQuery);
assert.equal(documents.length,snapshot.documents.length);
assert.ok(!documents.some(d=>/^(drafts|versions)\./.test(d._id)));
const assets=await run({...assetsQuery,params:{ids:snapshot.assets.map(a=>a._id)}});
await validateSnapshot({documents,assets},fixturePolicy({documents}));
assert.equal((await run(revisionsQuery)).length,documents.length);
console.log('GROQ parser/evaluator: all three actual projections pass; drafts, versions and unknown types excluded; projected snapshot validates.');

const localAsset = { _id: 'image-local-case', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/p9xrr86a/ald118-test/fixture-1x1.png', metadata: { dimensions: { width: 1, height: 1 } } };
const localMedia = { alt: 'Synthetic screenshot', decorative: false, caption: 'Synthetic caption.', rights: { status: 'approved' }, image: { asset: { _type: 'reference', _ref: localAsset._id } } };
const localDoc = { _id: 'local-case', _type: 'project', title: 'Synthetic query case', slug: { current: 'query-case' }, cardSummary: 'Card summary.', cardImage: localMedia,
  caseStudy: { summary: 'Overview via actual projection.', sections: [{ _key: 's', heading: 'My Contribution', body: [{ _key: 'p', _type: 'block', style: 'normal', markDefs: [],
    children: [{ _key: 'text', _type: 'span', text: 'Rich text via GROQ.', marks: ['strong'] }] }] }],
    seo: { title: 'Projected SEO title', description: 'Projected description.', socialImage: localMedia } },
  screenshots: [{ ...localMedia, _key: 'shot' }] };
const projected = await (await evaluate(parse(localProjectQuery), { dataset: [localAsset, localDoc,
  { ...localDoc, _id: 'drafts.local-case', title: 'PRIVATE DRAFT SENTINEL' }, { ...localDoc, _id: 'versions.release.local-case' }] })).get();
assert.equal(projected.length, 1);
const view = normalizeLocalProjects(projected), study = view.caseStudies['query-case'];
assert.equal(study.summary, 'Overview via actual projection.');
assert.match(study.sections[0].html, /<strong>Rich text via GROQ\.<\/strong>/);
assert.equal(study.seoTitle, 'Projected SEO title');
assert.equal(study.screenshots[0].caption, 'Synthetic caption.');
assert.ok(!JSON.stringify(view).includes('PRIVATE DRAFT SENTINEL'));
console.log('Local case-study projection: narrative, rich text, SEO, social image and screenshots persist; drafts/versions excluded.');
