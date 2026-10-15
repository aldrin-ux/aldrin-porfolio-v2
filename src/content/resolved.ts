import fs from 'node:fs';
import * as legacy from './site';
import { heroImage as legacyHero } from './imageAssets';
import { contentSource } from '../lib/sanity/retrieve.mjs';

// Server/frontmatter only. Default static mode never reads a CMS cache or makes a request.
function resolve() {
  if (contentSource(process.env) === 'static') {
    const base = {
      ...legacy, mode: 'static', heroImage: legacyHero,
      brand: { shortName: 'Aldrin C.', avatarText: 'AC', avatarLabel: 'About Aldrin' },
      footerHtml: '© 2025 Aldrin Camacho. Webflow Developer & Digital Experience Specialist.',
      pages: {},
    };
    if (process.env.CONTENT_LOCAL_TEST !== '1') return base;
    if (process.env.NETLIFY || process.env.CI) throw new Error('Local test content is forbidden on hosting/CI.');
    if (!process.env.CONTENT_LOCAL_CACHE) throw new Error('Use astro.local.config.mjs for the explicit local test build.');
    const local = JSON.parse(fs.readFileSync(process.env.CONTENT_LOCAL_CACHE, 'utf8'));
    if (local.target !== 'p9xrr86a/ald118-test') throw new Error('Invalid local test snapshot target.');
    return { ...base, localProjectSlugs: local.projects.map(p => p.slug),
      projects: [...legacy.projects, ...local.projects], caseStudies: { ...legacy.caseStudies, ...local.caseStudies } };
  }
  const id = process.env.CONTENT_BUILD_ID, cache = process.env.CONTENT_BUILD_CACHE;
  if (!id || !cache) throw new Error('Validated CMS build snapshot is absent; no static fallback.');
  const result = JSON.parse(fs.readFileSync(cache, 'utf8'));
  if (result.id !== id || result.view?.mode !== 'sanity') throw new Error('Validated CMS build snapshot is stale or invalid.');
  return result.view;
}
export const content = resolve();
export const { siteMetadata, navItems, projects, services, workflow, experience, caseStudies, heroImage, pages, brand, footerHtml } = content;
