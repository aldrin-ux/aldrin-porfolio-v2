import { projectPath, slots } from './validate.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export function resolveLink(link, index, local = false) {
  if (link.kind === 'external') return { label: link.label, href: link.externalUrl, newWindow: true };
  const target = index.get(link.target._ref);
  const path = target._type === 'project' ? projectPath(target.slug.current) : { home: '/', work: '/work/', about: '/about/', contact: '/contact/' }[target.routeKey];
  return { label: link.label, href: (local && path === '/' && link.fragment ? '' : path) + (link.fragment ? `#${link.fragment}` : ''), newWindow: false };
}
export function renderPortableText(blocks, index) {
  return blocks.map(block => block.children.map(span => {
    let html = escapeHtml(span.text);
    for (const mark of span.marks) {
      if (mark === 'strong' || mark === 'em') html = `<${mark}>${html}</${mark}>`;
      else {
        const link = resolveLink(block.markDefs.find(m => m._key === mark), index);
        html = `<a href="${escapeHtml(link.href)}"${link.newWindow ? ' target="_blank" rel="noopener noreferrer"' : ''}>${html}</a>`;
      }
    }
    return html;
  }).join('')).map(html => `<p>${html}</p>`).join('');
}
export function textSectionHtml(section, index) {
  return section.body ? renderPortableText(section.body, index) : section.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}
/** Converts validated CMS records to presentation-only data; no review metadata/secrets survive. */
export function normalizeContent(state) {
  const { index, settings, profile, navigation, pageMap, projects, media } = state;
  const image = usage => {
    const binding = media.get(usage);
    if (!binding?.publicPath) throw new Error('Approved local image delivery is missing.');
    return { publicPath: binding.publicPath, card: binding.card, study: binding.study, hero: binding.hero, aboutPortrait: binding.aboutPortrait, alt: usage.alt ?? '' };
  };
  const home = slots(pageMap.home), about = slots(pageMap.about), work = slots(pageMap.work), contact = slots(pageMap.contact);
  const requiredImage = (usage, variant) => {
    const result = image(usage);
    if (!result[variant]) throw new Error(`Approved ${variant} image delivery is missing; no image fallback.`);
    return result;
  };
  requiredImage(about[0].portrait ?? profile.aboutPortrait, 'aboutPortrait');
  const experience = profile.experience.map(r => {
    const e = index.get(r._ref); return { company: e.company, role: e.role, description: e.description, period: `${e.startYear}–${e.endYear}` };
  });
  const cards = projects.map(p => ({ title: p.title, slug: p.slug.current, href: projectPath(p.slug.current), externalUrl: p.externalUrl,
    role: p.cardRole, tags: p.tags, summary: p.cardSummary, image: image(p.cardImage).publicPath, alt: p.cardImage.alt ?? '', imageVariant: requiredImage(p.cardImage, 'card').card,
  }));
  const caseStudies = Object.fromEntries(projects.map(p => [p.slug.current, {
    title: p.title, eyebrow: p.caseStudy.eyebrow, heading: p.caseStudy.heading, url: p.externalUrl,
    image: image(p.caseStudy.heroImage).publicPath, imageAlt: p.caseStudy.heroImage.alt ?? '', imageVariant: requiredImage(p.caseStudy.heroImage, 'study').study,
    seoTitle: p.caseStudy.seo.title, seoDescription: p.caseStudy.seo.description,
    socialImage: image(p.caseStudy.seo.socialImage ?? p.caseStudy.heroImage).publicPath,
    noindex: p.caseStudy.seo.indexingRequest === 'noindex' || settings.defaultSeo.indexingRequest === 'noindex',
    summary: p.caseStudy.summary,
    creditText: `Webflow marketing website project developed under ${p.attribution.deliveryCredit}. Case study by ${profile.name}.`,
    details: [['Project credit', p.attribution.deliveryCredit], ['My role', p.attribution.role], ['Scope', 'Marketing website'], ['Status', p.portfolioStatus === 'provisional' ? 'Provisional portfolio entry' : 'Verified portfolio entry']],
    sections: [...p.caseStudy.sections.map(s => ({ title: s.heading, html: renderPortableText(s.body, index) })),
      { title: 'My contribution', html: `<p>${escapeHtml(p.attribution.contributionSummary)}</p>` },
      { title: 'Scope and credit', html: `<p>${escapeHtml(p.attribution.scopeStatement)}</p>` }],
    missingFacts: p.caseStudy.publicNotices ?? [],
  }]));
  const seo = p => ({ title: p.seo.title, description: p.seo.description,
    image: image(p.seo.socialImage ?? settings.defaultSeo.socialImage ?? profile.heroPortrait).publicPath, noindex: p.seo.indexingRequest === 'noindex' || settings.defaultSeo.indexingRequest === 'noindex' });
  const profileHeading = profile.profileHeading.slice(0, -1).split('. ');
  profileHeading[0] += '.';
  const info = section => ({ heading: section.heading, eyebrow: section.eyebrow, description: section.description });
  const features = section => ({ ...info(section), items: section.items.map(({ title, text }) => ({ title, text })) });
  const siteMetadata = { name: settings.siteName, title: settings.defaultSeo.title, description: settings.defaultSeo.description,
    image: image(settings.defaultSeo.socialImage ?? profile.heroPortrait).publicPath, language: settings.language,
    socialLinks: profile.socialLinks.map(l => resolveLink(l, index).href) };
  return {
    mode: 'sanity', globalNoindex: settings.defaultSeo.indexingRequest === 'noindex', siteMetadata, navItems: navigation.items.map(l => resolveLink(l, index)), brand: settings.brand,
    footerHtml: escapeHtml(settings.footerText), projects: cards, caseStudies, experience,
    services: home[3].items.map(({ title, text }) => ({ title, text })), workflow: home[4].items.map(({ title, text }) => ({ title, text })),
    heroImage: requiredImage(home[0].portrait, 'hero').hero,
    pages: {
      home: { ...seo(pageMap.home), hero: { introLabel: home[0].introLabel, leftHeading: home[0].leftHeading, rightHeading: home[0].rightHeading, leftText: home[0].leftText, rightText: home[0].rightText, leftLink: resolveLink(home[0].leftLink, index, true), rightLink: resolveLink(home[0].rightLink, index, true), actions: home[0].actions.map(l => resolveLink(l, index, true)), alt: home[0].portrait.alt ?? '' },
        toolsHeading: home[1].heading, tools: home[1].items.map(t => ({ name: t.name, logo: t.logo ? image(t.logo).publicPath : undefined, wordmark: t.wordmark })),
        work: info(home[2]), services: info(home[3]), workflow: info(home[4]), about: info(home[5]), experience: info(home[6]),
        contact: { ...info(home[7]), body: home[7].body, actions: home[7].actions.map(l => resolveLink(l, index)) }, profileHeading, paragraphs: profile.summaryParagraphs,
        jobTitle: profile.professionalTitle.replace(' & ', ' and ') },
      about: { ...seo(pageMap.about), profile: info(about[0]), experience: info(about[1]), profileHeading, paragraphs: profile.biographyParagraphs, portrait: image(about[0].portrait ?? profile.aboutPortrait) },
      work: { ...seo(pageMap.work), section: { ...info(work[0]), labels: work[0].labels ?? [] }, cta: { ...info(work[1]), actions: work[1].actions.map(l => resolveLink(l, index)) }, count: cards.length },
      contact: { ...seo(pageMap.contact), hero: info(contact[0]), bodyHtml: textSectionHtml(contact[0], index), options: { ...features(contact[1]), actions: contact[1].actions.map(l => resolveLink(l, index)) }, working: features(contact[2]) },
    },
  };
}
