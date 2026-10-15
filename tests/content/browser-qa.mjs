// Optional local Chromium QA. Uses only local build output and never submits forms.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
const output='test-results/ald-117-browser';fs.mkdirSync(output,{recursive:true});
const roots={static:path.resolve('dist'),cms:path.resolve('test-results/ald-117-fixture')};
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try {
  const [mode,...parts]=new URL(req.url,'http://localhost').pathname.slice(1).split('/');
  const base=roots[mode];if(!base)throw Error();
  let file=path.resolve(base,parts.join('/'));
  if(!file.startsWith(base+path.sep)&&file!==base)throw Error();
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.setHeader('Content-Type',mime[path.extname(file)]??'application/octet-stream');res.end(fs.readFileSync(file));
 }catch{res.statusCode=404;res.end('Missing');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});const results=[];
try {
 // Route absolute asset/navigation requests back into the selected local output tree.
 for(const mode of ['static','cms'])for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]) {
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.origin!==origin)return route.abort();
   if(!u.pathname.startsWith(`/${mode}/`))u.pathname=`/${mode}${u.pathname}`;
   return route.continue({url:u.href});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/about/','/work/','/work/dazlab/','/work/mortar/','/work/handl/','/work/tangilla/','/contact/','/contact/success/',...(mode==='cms'?['/work/fixture-five/']:[])]) {
   const response=await page.goto(`${origin}/${mode}${route}`);assert.equal(response.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}});
   const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,
    broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),
    h1:document.querySelector('h1')?.textContent,heroPrepared:document.querySelector('[data-hero-split]')?.classList.contains('is-prep')}));
   assert.equal(metrics.overflow,false,`${mode} ${route} ${viewport.width} overflow`);assert.deepEqual(metrics.broken,[]);
   if(route==='/')assert.equal(metrics.heroPrepared,false,'reduced motion leaves hero usable');
   if(route==='/' && viewport.width===390) {
    await page.locator('.menu-button').click();
    assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'false');
   }
   if(['/', '/about/', '/contact/', '/work/dazlab/'].includes(route))await page.screenshot({path:`${output}/${mode}-${route==='/'?'home':route.split('/').filter(Boolean).join('-')}-${viewport.width}.png`,fullPage:true,animations:'disabled'});
   if(route==='/')await page.screenshot({path:`${output}/${mode}-hero-${viewport.width}.png`,animations:'disabled'});
   results.push({mode,route,width:viewport.width,...metrics});
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 // Normal animation and JavaScript-disabled usability on the CMS renderer.
 for(const javaScriptEnabled of [true,false]) {
  const context=await browser.newContext({viewport:{width:1440,height:900},javaScriptEnabled});
  await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==origin)return r.abort();if(!u.pathname.startsWith('/cms/'))u.pathname='/cms'+u.pathname;return r.continue({url:u.href});});
  const page=await context.newPage();await page.goto(`${origin}/cms/`);
  if(javaScriptEnabled)await page.locator('[data-hero-split].is-complete').waitFor({timeout:10000});
  assert.ok(await page.locator('h1').isVisible());assert.ok(await page.locator('.hero-portrait').isVisible());
  if(!javaScriptEnabled)assert.equal(await page.locator('.is-prep').count(),0);
  await context.close();
 }
 const screenshotParity=[];
 for(const name of ['hero','about','contact','work-dazlab'])for(const width of [390,768,1440]) {
  const same=fs.readFileSync(`${output}/static-${name}-${width}.png`).equals(fs.readFileSync(`${output}/cms-${name}-${width}.png`));
  assert.ok(same,`${name} at ${width}px visual parity`);screenshotParity.push(`${name}-${width}`);
 }
 fs.writeFileSync(`${output}/results.json`,JSON.stringify({browser:browser.version(),checks:results.length,results,screenshotParity,normalAnimation:true,javaScriptDisabled:true,mobileMenuKeyboard:true,formsSubmitted:0},null,2));
 console.log(`Chromium ${browser.version()}: ${results.length} route/viewport checks passed, plus animation and JS-disabled checks; screenshots in ${output}.`);
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
