import fs from 'node:fs';
import * as legacy from './site';
import { heroImage as legacyHero } from './imageAssets';
import { contentSource } from '../lib/sanity/retrieve.mjs';

// Server/frontmatter only. Static mode never reads the CMS cache or makes a request.
function resolve() {
  if (contentSource(process.env) === 'static') return {
    ...legacy, mode: 'static', heroImage: legacyHero,
    brand: { shortName: 'Aldrin C.', avatarText: 'AC', avatarLabel: 'About Aldrin' },
    footerHtml: '© 2025 Aldrin Camacho. Webflow Developer & Digital Experience Specialist.',
    pages: {},
  };
  const id = process.env.CONTENT_BUILD_ID, cache = process.env.CONTENT_BUILD_CACHE;
  if (!id || !cache) throw new Error('Validated CMS build snapshot is absent; no static fallback.');
  const result = JSON.parse(fs.readFileSync(cache, 'utf8'));
  if (result.id !== id || result.view?.mode !== 'sanity') throw new Error('Validated CMS build snapshot is stale or invalid.');
  return result.view;
}
export const content = resolve();
export const { siteMetadata, navItems, projects, services, workflow, experience, caseStudies, heroImage, pages, brand, footerHtml } = content;
