import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture, fixturePolicy, fifthProject } from './fixtures.mjs';
import { validateSnapshot, digest, projectPath } from '../../src/lib/sanity/validate.mjs';
import { normalizeContent, renderPortableText } from '../../src/lib/sanity/normalize.mjs';
import { contentSource, createTransport, retrieveSnapshot } from '../../src/lib/sanity/retrieve.mjs';
import { documentsQuery } from '../../src/lib/sanity/queries.mjs';
import { models } from '../../src/lib/sanity/model.mjs';
import { sanityContentIntegration } from '../../src/lib/sanity/integration.mjs';
import fs from 'node:fs';
const project = s => s.documents.find(d => d._type === 'project');
const page = (s, key) => s.documents.find(d => d.routeKey === key);
const rejects = (name, mutate, pattern) => test(name, async () => {
  const s = fixture(); mutate(s);
  await assert.rejects(validateSnapshot(s,fixturePolicy(s)),pattern);
});
test('default static mode needs no Sanity target or credentials; invalid flag is rejected', () => {
  assert.equal(contentSource({}),'static'); assert.equal(contentSource({SANITY_READ_TOKEN:'ignored'}),'static');
  assert.throws(()=>contentSource({CONTENT_SOURCE:'automatic'}),/CONTENT_SOURCE/);
});
test('valid published snapshot normalizes approved content and preserves year precision', async () => {
  const s=fixture(),view=normalizeContent(await validateSnapshot(s,fixturePolicy(s)));
  assert.equal(view.projects.length,4); assert.equal(view.experience[0].period,'2025–2026');
  assert.equal(view.caseStudies.mortar.details[0][1],'Dazlab'); assert.equal(view.globalNoindex,true);
  assert.equal(view.pages.home.hero.leftLink.href,'#work'); assert.equal(view.navItems[1].href,'/#workflow');
  assert.ok(!JSON.stringify(view).includes('SYNTHETIC TEST APPROVAL'));
});
test('no policy or mismatched protected revision approval fails closed', async () => {
  const s=fixture(),policy=fixturePolicy(s); assert.equal(policy.assertDocument(s.documents[0]._id,s.documents[0]._rev,digest(s.documents[0])),true);
  await assert.rejects(validateSnapshot(s),/approval provider/);
  s.documents[0].footerText='Unapproved edited text'; await assert.rejects(validateSnapshot(s,policy),/protected revision approval/);
});
rejects('missing settings',s=>s.documents=s.documents.filter(d=>d._id!=='siteSettings'),/required siteSettings/);
rejects('duplicate singleton',s=>s.documents.push({...s.documents[0],_id:'another-settings'}),/duplicate required siteSettings/);
rejects('duplicate document ID',s=>s.documents.push(s.documents[0]),/duplicate/);
rejects('duplicate project slug',s=>s.documents.filter(d=>d._type==='project')[1].slug=project(s).slug,/changed an existing route|duplicate project slug/);
rejects('invalid slug traversal',s=>project(s).slug.current='../escape',/slug/);
rejects('reserved success slug',s=>project(s).slug.current='success',/reserved/);
rejects('changed retained slug',s=>project(s).slug.current='dazlab-new',/changed an existing route/);
rejects('draft document',s=>project(s)._id='drafts.project-dazlab',/draft/);
rejects('release version document',s=>project(s)._id='versions.release.project-dazlab',/draft\/version/);
rejects('missing contributor reference',s=>project(s).attribution.person._ref='absent',/missing, unpublished/);
rejects('unpublished reference',s=>project(s).attribution.person._ref='drafts.portfolioProfile',/strong published reference/);
rejects('weak reference',s=>project(s).attribution.person._weak=true,/strong published reference/);
rejects('unsafe URL',s=>project(s).externalUrl='javascript:alert(1)',/HTTPS/);
rejects('URL credentials',s=>project(s).externalUrl='https://user:pass@example.com',/HTTPS/);
rejects('missing alt text',s=>delete project(s).cardImage.alt,/alt text/);
rejects('unapproved media rights',s=>project(s).cardImage.rights.status='unreviewed',/media rights/);
rejects('required credit cannot be silently omitted',s=>project(s).cardImage.rights.creditLine='Required credit',/credit\/caption/);
rejects('unsupported caption fails closed',s=>project(s).cardImage.caption='Required caption',/credit\/caption/);
rejects('unreviewed hotspot derivatives',s=>project(s).cardImage.image.hotspot={_type:'sanity.imageHotspot',x:0.5,y:0.5,width:1,height:1},/derivative ingestion/);
rejects('wrong image presentation intent',s=>project(s).cardImage.cropIntent='portrait',/presentation slot/);
rejects('incorrect Dazlab attribution',s=>project(s).attribution.deliveryCredit='Personal SaaS',/Dazlab/);
rejects('missing attribution',s=>delete project(s).attribution,/required/);
rejects('missing SEO',s=>delete project(s).caseStudy.seo.description,/required/);
rejects('missing provisional notice',s=>delete project(s).caseStudy.publicNotices,/provisional/);
rejects('employment months',s=>s.documents.find(d=>d._type==='professionalExperience').startYear='2025-01',/four-digit/);
rejects('reversed employment years',s=>s.documents.find(d=>d._type==='professionalExperience').endYear=2020,/reversed/);
rejects('missing page',s=>s.documents=s.documents.filter(d=>d._id!=='page-contact'),/missing, unpublished|missing or duplicate/);
rejects('wrong section order',s=>page(s,'home').sections.reverse(),/slots\/order/);
rejects('unsafe nested Portable Text',s=>project(s).caseStudy.sections[0].body[0].children[0].text='<script>bad</script>',/unsafe/);
rejects('unsupported Portable Text embed',s=>project(s).caseStudy.sections[0].body[0]._type='image',/ordinary paragraphs/);
rejects('unknown nested protected field',s=>project(s).caseStudy.internalNotes='private',/unexpected field/);
rejects('missing published anchor',s=>page(s,'home').sections[0].leftLink.fragment='absent',/nonexistent published fragment/);
rejects('cross-dataset media',s=>s.assets[0].url='https://cdn.sanity.io/images/other/production/a.png',/approved project/);
test('local media eligibility cannot be granted by content rights field alone',async()=>{
 const s=fixture(); await assert.rejects(validateSnapshot(s,{...fixturePolicy(s),resolveMedia:()=>undefined}),/local asset eligibility/);
});
test('fifth project adds a route without a new file; omission removes optional route',async()=>{
 const s=fifthProject(fixture()); const v=normalizeContent(await validateSnapshot(s,fixturePolicy(s)));
 assert.equal(v.projects[4].href,'/work/fixture-five/'); assert.ok(v.caseStudies['fixture-five']);
 const original=fixture(); const plain=normalizeContent(await validateSnapshot(original,fixturePolicy(original)));
 assert.ok(!plain.projects.some(p=>p.slug==='fixture-five')); assert.throws(()=>projectPath('a/b'));
});
test('plain text escaping and approved Portable Text link rendering',async()=>{
 const s=fixture(),state=await validateSnapshot(s,fixturePolicy(s));
 const blocks=structuredClone(project(s).caseStudy.sections[0].body); blocks[0].children[0].text='A & B';
 assert.match(renderPortableText(blocks,state.index),/A &amp; B/);
});
test('transport uses published API, no CDN/cache/redirects, redacts failures',async()=>{
 let observed; const env={SANITY_PROJECT_ID:'p9xrr86a',SANITY_DATASET:'production',SANITY_READ_TOKEN:'SENTINEL_NOT_A_TOKEN'};
 const transport=createTransport(env,async(url,options)=>{observed={url,options};return {ok:true,json:async()=>({result:[]})};});
 assert.deepEqual(await transport(documentsQuery),[]); assert.equal(observed.url.hostname,'p9xrr86a.api.sanity.io');
 assert.equal(observed.url.searchParams.get('perspective'),'published'); assert.equal(observed.options.redirect,'error');
  assert.equal(observed.options.method,'POST');assert.match(observed.url.pathname,/\/data\/query\/production$/);
  assert.deepEqual(JSON.parse(observed.options.body),{query:documentsQuery.text,params:documentsQuery.params});
  assert.ok(!observed.options.body.includes(env.SANITY_READ_TOKEN));
 assert.equal(observed.options.cache,'no-store'); assert.ok(observed.options.signal instanceof AbortSignal);
 assert.match(documentsQuery.text,/drafts\.\*\*/); assert.match(documentsQuery.text,/versions\.\*\*/);
 assert.ok(!documentsQuery.text.includes('...')); assert.ok(!documentsQuery.text.includes('internalNotes'));
 await assert.rejects(createTransport(env,async()=>{throw Error(env.SANITY_READ_TOKEN);})(documentsQuery),e=>!e.message.includes(env.SANITY_READ_TOKEN));
 await assert.rejects(createTransport(env,async()=>({ok:false,status:403}))(documentsQuery),/403/);
 await assert.rejects(createTransport(env,async()=>({ok:true,json:async()=>({result:null})}))(documentsQuery),/incomplete/);
 assert.throws(()=>createTransport({}),/target/);
});
test('revision race fails instead of mixing snapshots',async()=>{
 const s=fixture(); let call=0;
 const transport=async()=>[s.documents,s.assets,s.documents.map(d=>({_id:d._id,_rev:d._rev}))][call++];
 assert.deepEqual(await retrieveSnapshot(transport),s);
 let n=0;await assert.rejects(retrieveSnapshot(async()=>[s.documents,s.assets,[]][n++]),/changed during retrieval/);
});
test('independent contract covers every PR10 generated schema field',()=>{
 const types=fs.readFileSync(new URL('../../src/lib/sanity/schema.types.d.ts',import.meta.url),'utf8');
 for(const [name,fields] of Object.entries(models)){
  if(['image','imageCrop','imageHotspot'].includes(name))continue;
  const typeName=name[0].toUpperCase()+name.slice(1); const block=types.match(new RegExp(`export type ${typeName} = \\{([\\s\\S]*?)\\n\\};`));
  assert.ok(block,`${name} registered`);
  const schemaFields=[...block[1].matchAll(/^  ([a-zA-Z]\w*)\??:/gm)].map(m=>m[1]).sort();
  assert.deepEqual(schemaFields,Object.keys(fields).sort(),`${name} exact field inventory`);
  for(const field of Object.keys(fields))assert.match(block[1],new RegExp(`\\b${field}\\??:`),`${name}.${field}`);
 }
});
test('integration rejects unapproved local source/variant bytes and fixture environment',async()=>{
 const previous=Object.fromEntries(['CONTENT_SOURCE','CONTENT_INTEGRATION_TEST','NETLIFY'].map(k=>[k,process.env[k]]));
 const s=fixture(),base=fixturePolicy(s);
 const run=policy=>sanityContentIntegration({fixture:s,policy}).hooks['astro:config:setup']({config:{root:new URL('../../',import.meta.url)},updateConfig:()=>{throw Error('Invalid data reached renderer');}});
 try {
  process.env.CONTENT_SOURCE='sanity';process.env.CONTENT_INTEGRATION_TEST='1';delete process.env.NETLIFY;
  await assert.rejects(run({...base,resolveMedia:input=>({...base.resolveMedia(input),sha256:'0'.repeat(64)})}),/source asset binding/);
  await assert.rejects(run({...base,resolveMedia:input=>({...base.resolveMedia(input),variantHashes:{}})}),/derivative manifest/);
  delete process.env.CONTENT_INTEGRATION_TEST;await assert.rejects(run(base),/local test runner/);
  process.env.CONTENT_INTEGRATION_TEST='1';process.env.NETLIFY='true';await assert.rejects(run(base),/local test runner/);
 } finally {for(const [key,value]of Object.entries(previous))if(value===undefined)delete process.env[key];else process.env[key]=value;}
});
