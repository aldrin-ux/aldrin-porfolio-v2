import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../../',import.meta.url));
const sentinel='ALD117_FAKE_SECRET_SENTINEL';
function build(overrides={}, fixture=false) {
  const env={...process.env,ASTRO_TELEMETRY_DISABLED:'1',SANITY_READ_TOKEN:sentinel,
    NODE_OPTIONS:`--import "${new URL('./deny-network.mjs',import.meta.url).href}"`,...overrides};
  delete env.SANITY_PROJECT_ID; delete env.SANITY_DATASET; delete env.NETLIFY;
  if(!Object.hasOwn(overrides,'CONTENT_SOURCE'))delete env.CONTENT_SOURCE;
  const result=spawnSync(process.execPath,['node_modules/astro/astro.js','build',...(fixture?['--config','tests/content/astro.fixture.config.mjs']:[])],{cwd:root,env,encoding:'utf8',timeout:90000});
  return {code:result.status,log:(result.stdout??'')+(result.stderr??'')};
}
const all = directory => Object.fromEntries(fs.readdirSync(directory,{withFileTypes:true}).flatMap(e => e.isDirectory()
  ? Object.entries(all(path.join(directory,e.name))).map(([k,v])=>[`${e.name}/${k}`,v])
  : [[e.name,createHash('sha256').update(fs.readFileSync(path.join(directory,e.name))).digest('hex')]]));
const read=(dir,file)=>fs.readFileSync(path.join(root,dir,file),'utf8');
const routes=['index.html','about/index.html','work/index.html',...['dazlab','mortar','handl','tangilla'].map(s=>`work/${s}/index.html`),'contact/index.html','contact/success/index.html'];
const metadata = html => ({
 title:html.match(/<title>(.*?)<\/title>/s)?.[1],
 description:html.match(/<meta name="description" content="(.*?)"/s)?.[1],
 robots:html.match(/<meta name="robots" content="(.*?)"/s)?.[1],
 canonical:html.match(/<link rel="canonical" href="(.*?)"/s)?.[1],
 og:[...html.matchAll(/<meta property="(og:[^"]+)" content="(.*?)"/g)].map(m=>[m[1],m[2]]),
 twitter:[...html.matchAll(/<meta name="(twitter:[^"]+)" content="(.*?)"/g)].map(m=>[m[1],m[2]]),
 jsonLd:[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])),
});
test('offline full builds: default static, fifth CMS route, metadata parity, rejection and no exposure',{timeout:180000},()=>{
 const staticResult=build();assert.equal(staticResult.code,0,staticResult.log);
 const before=all(path.join(root,'dist'));assert.equal(Object.keys(before).length,81);
 const original=Object.fromEntries(routes.map(route=>[route,read('dist',route)]));
 const valid=build({CONTENT_SOURCE:'sanity',CONTENT_INTEGRATION_TEST:'1'},true);assert.equal(valid.code,0,valid.log);
 const directory='test-results/ald-117-fixture';const cms=all(path.join(root,directory));
 assert.ok(cms['work/fixture-five/index.html']); assert.match(read(directory,'work/index.html'),/All Work \(5\)/);
 assert.match(read(directory,'sitemap.xml'),/\/work\/fixture-five\//);
 for(const route of routes) {
  const html=read(directory,route);assert.deepEqual(metadata(html),metadata(original[route]),`${route} SEO/JSON-LD parity`);
  if(route==='contact/index.html')assert.equal(html.match(/<form[\s\S]*?<\/form>/)?.[0],original[route].match(/<form[\s\S]*?<\/form>/)?.[0],'contact form unchanged');
 }
 // Public originals, variants, fonts, form detector, robots and headers retain their exact bytes.
 for(const [file,hash] of Object.entries(before))if(!file.endsWith('.html')&&!file.endsWith('.css')&&!file.endsWith('.js')&&file!=='sitemap.xml')assert.equal(cms[file],hash,file);
 for(const file of Object.keys(cms).filter(f=>/\.(html|js|css|xml|txt)$/.test(f))) {
  const text=read(directory,file);
  for(const forbidden of [sentinel,'SANITY_READ_TOKEN','CONTENT_BUILD_CACHE','SYNTHETIC TEST APPROVAL','editorialReview','sourceLocations','fixture-asset-1'])assert.ok(!text.includes(forbidden),`${file} leaks ${forbidden}`);
 }
 const invalid=build({CONTENT_SOURCE:'sanity',CONTENT_INTEGRATION_TEST:'1',CONTENT_TEST_INVALID:'1'},true);
 assert.notEqual(invalid.code,0);assert.match(invalid.log,/Content validation:.*slug/);
 const live=build({CONTENT_SOURCE:'sanity'});assert.notEqual(live.code,0);assert.match(live.log,/approval provider is not configured/);
 assert.ok(!live.log.includes(sentinel));
 const unknown=build({CONTENT_SOURCE:'invalid'});assert.notEqual(unknown.code,0);assert.match(unknown.log,/CONTENT_SOURCE must/);
 const after=build();assert.equal(after.code,0,after.log);assert.deepEqual(all(path.join(root,'dist')),before,'CMS opt-in does not alter a later static build');
});
