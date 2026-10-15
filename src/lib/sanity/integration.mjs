import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { contentSource, createTransport, retrieveSnapshot } from './retrieve.mjs';
import { validateSnapshot } from './validate.mjs';
import { normalizeContent } from './normalize.mjs';

/** No live approval provider is installed: the public config intentionally fails closed. */
export function sanityContentIntegration(options = {}) {
  return {
    name: 'portfolio-published-content',
    hooks: {
      'astro:config:setup': async ({ config, updateConfig }) => {
        if (contentSource(process.env) !== 'sanity') throw new Error('CMS renderer requires explicit CONTENT_SOURCE=sanity.');
        if (options.fixture && (process.env.NETLIFY || process.env.CONTENT_INTEGRATION_TEST !== '1')) throw new Error('Synthetic fixture rendering is restricted to the explicit local test runner.');
        if (!options.policy) throw new Error('Publication/media approval provider is not configured. Sanity builds remain blocked; no static fallback.');
        const snapshot = options.fixture ?? await retrieveSnapshot(createTransport(process.env));
        const state = await validateSnapshot(snapshot, options.policy);
        const root = fileURLToPath(config.root);
        // Only already-local, reviewed files may be delivered. No remote image fetch or CSP relaxation.
        for (const binding of state.media.values()) {
          const absolute = path.resolve(root, binding.sourceFile ?? '');
          if (!absolute.startsWith(path.resolve(root) + path.sep) || !/^(public\/assets\/|src\/assets\/)/.test(binding.sourceFile ?? '')) throw new Error('Asset delivery escaped the approved local asset boundary.');
          const actual = createHash('sha256').update(await fs.readFile(absolute)).digest('hex');
          if (actual !== binding.sha256 || binding.originalPath !== binding.publicPath && !binding.aboutPortrait) throw new Error('Approved source asset binding does not match local bytes.');
          if (binding.aboutPortrait && binding.sourceFile !== 'src/assets/aldrin-standing-studio-portrait.png') throw new Error('A different About portrait requires reviewed image ingestion.');
          for (const variant of [binding.card, binding.study, binding.hero].filter(Boolean)) {
            if (!Number.isInteger(variant.width) || !Number.isInteger(variant.height) || variant.width <= 0 || variant.height <= 0) throw new Error('Invalid approved image dimensions.');
            for (const url of [variant.src, ...variant.srcset.split(',').map(v => v.trim().split(/\s+/)[0])]) {
              if (!/^\/assets\/optimized\/[a-zA-Z0-9.-]+\.webp$/.test(url)) throw new Error('Invalid local optimized image URL.');
              const bytes = await fs.readFile(path.join(root, 'public', url));
              if (createHash('sha256').update(bytes).digest('hex') !== binding.variantHashes?.[url]) throw new Error('Approved optimized image bytes do not match the derivative manifest.');
            }
          }
        }
        const view = normalizeContent(state), id = randomUUID();
        const directory = path.join(root, '.cache', 'ald-117');
        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(path.join(directory, `${id}.json`), JSON.stringify({ id, view }));
        // Build-only values; Vite defines literals so separate render workers share one snapshot.
        updateConfig({ vite: { define: { 'process.env.CONTENT_BUILD_ID': JSON.stringify(id), 'process.env.CONTENT_BUILD_CACHE': JSON.stringify(path.join(directory, `${id}.json`)) } } });
      },
    },
  };
}
