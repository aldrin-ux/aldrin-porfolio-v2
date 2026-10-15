import { defineConfig } from 'astro/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { assertLocalTarget, localProjectQuery, normalizeLocalProjects } from './src/lib/sanity/local-project.mjs';

// Explicit local config only; normal/production Astro config never imports CLI auth.
assertLocalTarget(process.env);
let imageBytes;
export default defineConfig({ site: 'https://example.com', outDir: './test-results/ald-118-live',
  integrations: [{ name: 'isolated-local-sample', hooks: {
    'astro:config:setup': async ({ config, updateConfig, injectRoute, command }) => {
      if (command !== 'build') return;
      const { getProjectCliClient } = await import('./studio/node_modules/@sanity/cli-core/dist/apiClient.js');
      const client = await getProjectCliClient({ projectId: 'p9xrr86a', dataset: 'ald118-test',
        apiVersion: '2026-10-01', requireUser: true, useCdn: false, perspective: 'published' });
      let documents;
      try { documents = await client.fetch(localProjectQuery); }
      catch { throw new Error('Isolated published read failed; use existing CLI login/access. No static fallback.'); }
      const view = normalizeLocalProjects(documents);
      if (documents.length) {
        const response = await fetch(documents[0].cardImage.image.asset.url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
        if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== 'image/png') throw new Error('Sample PNG retrieval failed.');
        imageBytes = Buffer.from(await response.arrayBuffer());
        if (imageBytes.length > 2_000_000 || !imageBytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Invalid sample PNG.');
      }
      const root = fileURLToPath(config.root), cache = path.join(root, '.cache', 'ald-118', `${randomUUID()}.json`);
      await fs.mkdir(path.dirname(cache), { recursive: true });
      await fs.writeFile(cache, JSON.stringify(view));
      updateConfig({ vite: { define: { 'process.env.CONTENT_LOCAL_CACHE': JSON.stringify(cache) } } });
      injectRoute({ pattern: '/work/[slug]', entrypoint: './src/cms/pages/work/[slug].astro' });
    },
    'astro:build:done': async ({ dir }) => {
      if (imageBytes) await fs.writeFile(new URL('assets/ald118-sample.png', dir), imageBytes);
    },
  } }],
});
