import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sampleSnapshot } from './sample-project.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = new URL('../../test-results/ald-118-sample/', import.meta.url);
const read = name => fs.readFileSync(new URL(name, output), 'utf8');
function build(stage) {
  const env = { ...process.env, CONTENT_SOURCE: 'sanity', CONTENT_INTEGRATION_TEST: '1',
    CONTENT_SAMPLE_STAGE: stage, ASTRO_TELEMETRY_DISABLED: '1',
    NODE_OPTIONS: `--import "${new URL('./deny-network.mjs', import.meta.url).href}"` };
  delete env.SANITY_READ_TOKEN; delete env.SANITY_PROJECT_ID; delete env.SANITY_DATASET;
  const result = spawnSync(process.execPath, ['node_modules/astro/astro.js', 'build', '--config',
    'tests/content/astro.sample.config.mjs'], { cwd: root, env, encoding: 'utf8', timeout: 90000 });
  assert.equal(result.status, 0, (result.stdout ?? '') + (result.stderr ?? ''));
}

test('synthetic sample: published route, edited title, unpublish removes stale route and links', { timeout: 180000 }, () => {
  const baseline = sampleSnapshot('unpublished');
  for (const stage of ['published', 'edited', 'unpublished']) {
    // Supporting records and existing case studies never change, except sample selection refs.
    for (const original of baseline.documents) {
      if (original._type !== 'page') assert.deepEqual(sampleSnapshot(stage).documents.find(d => d._id === original._id), original);
    }
    build(stage);
    const exists = fs.existsSync(new URL('work/sample-project/index.html', output));
    assert.equal(exists, stage !== 'unpublished');
    for (const route of ['index.html', 'work/index.html', 'sitemap.xml']) {
      assert.equal(read(route).includes('/work/sample-project/'), stage !== 'unpublished', `${stage}: ${route}`);
    }
    assert.match(read('work/index.html'), stage === 'unpublished' ? /All Work \(4\)/ : /All Work \(5\)/);
    if (exists) {
      const html = read('work/sample-project/index.html');
      assert.match(html, /Synthetic offline sample/);
      assert.match(html, /noindex/);
      const hero = html.match(/<figure\b[^>]*>([\s\S]*?)<\/figure>/)?.[1];
      assert.match(hero, /aldrin-hero-512/); // Owner placeholder, separate from unchanged related-work cards.
      assert.match(html, stage === 'edited' ? /<title>Synthetic sample project — edited/ : /<title>Synthetic sample project</);
      assert.match(html, stage === 'edited' ? /<h1[^>]*>Synthetic sample project — edited/ : /<h1[^>]*>Synthetic sample project</);
    }
  }
});
