// Optional local verification with the existing Studio dependency; not a root/CI dependency.
import assert from 'node:assert/strict';
import { parse,evaluate } from '../../studio/node_modules/groq-js/dist/index.js';
import { documentsQuery,assetsQuery,revisionsQuery } from '../../src/lib/sanity/queries.mjs';
import { fixture,fixturePolicy } from './fixtures.mjs';
import { validateSnapshot } from '../../src/lib/sanity/validate.mjs';
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
