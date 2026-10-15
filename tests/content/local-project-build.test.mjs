import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const output = new URL('../../test-results/ald-118-multiple/', import.meta.url);
const read = file => fs.readFileSync(new URL(file, output), 'utf8');
test('offline local builds: zero, one, multiple, then unpublish; drafts excluded and static projects retained', { timeout: 180000 }, () => {
  for (const count of [0, 1, 2, 1, 0]) {
    const env = { ...process.env, CONTENT_SOURCE: 'static', CONTENT_LOCAL_TEST: '1', CONTENT_INTEGRATION_TEST: '1',
      CONTENT_TEST_PROJECT_COUNT: String(count), ASTRO_TELEMETRY_DISABLED: '1',
      NODE_OPTIONS: `--import "${new URL('./deny-network.mjs', import.meta.url).href}"` };
    delete env.CI; delete env.NETLIFY; delete env.SANITY_READ_TOKEN;
    const result = spawnSync(process.execPath, ['node_modules/astro/astro.js', 'build', '--config', 'tests/content/astro.local-projects.fixture.config.mjs'],
      { cwd: root, env, encoding: 'utf8', timeout: 90000 });
    assert.equal(result.status, 0, (result.stdout ?? '') + (result.stderr ?? ''));
    for (const [slug, exists] of [['sample-project', count >= 1], ['mcfly-industries', count >= 2], ['draft-only', false], ['version-only', false]]) {
      assert.equal(fs.existsSync(new URL(`work/${slug}/index.html`, output)), exists, `${count}: ${slug}`);
      for (const file of ['work/index.html', 'sitemap.xml']) assert.equal(read(file).includes(`/work/${slug}/`), exists, `${count}: ${file}: ${slug}`);
      if (['sample-project', 'mcfly-industries'].includes(slug)) {
        assert.equal(fs.existsSync(new URL(`assets/ald118-${slug}.png`, output)), exists, `${count}: ${slug} image`);
      }
    }
    for (const slug of ['dazlab', 'mortar', 'handl', 'tangilla']) assert.ok(fs.existsSync(new URL(`work/${slug}/index.html`, output)));
    if (count) {
      const html = read('work/sample-project/index.html');
      assert.match(html, /<title>Synthetic case-study SEO<\/title>/);
      assert.match(html, /<h1[^>]*>Synthetic narrative heading<\/h1>/);
      assert.match(html, /<strong>Persistent rich narrative &amp; evidence\.<\/strong>/);
      assert.match(html, /Synthetic screenshot caption\./);
      assert.match(html, /name="description" content="Synthetic meta description\."/);
      assert.ok(fs.existsSync(new URL('assets/ald118-sample-project-social.png', output)));
    } else assert.ok(!fs.existsSync(new URL('assets/ald118-sample-project-social.png', output)));
  }
});
