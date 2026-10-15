import fs from 'node:fs';
import { digest } from '../../src/lib/sanity/validate.mjs';
const read = name => JSON.parse(fs.readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8'));
export const fixture = () => read('published');
export const mediaBindings = read('local-media');
// Test authority is deliberately separate from editable CMS approval fields.
// Never import this provider in the public config. These are synthetic approvals.
export function fixturePolicy(snapshot) {
  const approvals = new Map(snapshot.documents.map(d => [d._id, { rev:d._rev, sha:digest(d) }]));
  return {
    assertDocument: (id,rev,sha) => approvals.get(id)?.rev === rev && approvals.get(id)?.sha === sha,
    resolveMedia: ({usage,asset}) => Object.values(mediaBindings).find(b => b.assetId === asset._id && usage.legacyAssetPaths?.includes(b.originalPath)),
  };
}
export function fifthProject(snapshot) {
  const project = structuredClone(snapshot.documents.find(d => d._type === 'project'));
  project._id = 'project-fixture-five'; project._rev = 'fixture-five-1'; project.slug.current = 'fixture-five';
  project.title = 'Synthetic fifth project'; project.caseStudy.heading = 'Synthetic fifth project - Webflow Marketing Website.';
  project.migration.sourceKey = 'synthetic/project/fixture-five'; project.migration.legacyPath = '/work/fixture-five/';
  snapshot.documents.push(project);
  for (const page of snapshot.documents.filter(d => d._type === 'page' && ['home','work'].includes(d.routeKey))) {
    page.sections.find(s => s._type === 'projectCollectionSection').selection.push({_key:'fixture-five',_type:'reference',_ref:project._id});
  }
  return snapshot;
}
