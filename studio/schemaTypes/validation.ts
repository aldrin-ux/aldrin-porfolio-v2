import type { ValidationContext } from "sanity";

export const apiVersion = "2026-10-01";
export const originalSlugs = ["dazlab", "mortar", "handl", "tangilla"];
export const reservedSlugs = ["index", "new", "preview", "success"];
export const singletonIds: Record<string, string> = {
  siteSettings: "siteSettings", portfolioProfile: "portfolioProfile", navigation: "navigation-primary",
};
export const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

export function plainText(value: unknown) {
  if (value === undefined) return true;
  return typeof value === "string" && value.trim().length > 0 && !/<\/?[a-z][^>]*>/i.test(value)
    || "Use nonempty plain text, without HTML or scripts.";
}
export function httpsUrl(value: unknown) {
  if (value === undefined) return true;
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password
      || "Use a complete HTTPS URL without embedded credentials.";
  } catch { return "Use a complete HTTPS URL."; }
}
export function referenceShape(value: unknown) {
  if (value === undefined) return true;
  const ref = record(value);
  return ref._type === "reference" && typeof ref._ref === "string" && !!ref._ref.trim()
    && !/^(drafts|versions)\./.test(ref._ref) && ref._weak !== true
    || "Choose a strong reference to a published document (not a draft/version ID).";
}
export function uniqueItems(value: unknown) {
  if (!Array.isArray(value)) return true;
  const keys = value.filter(x => x && typeof x === "object").map(x => record(x)._key);
  if (keys.some(key => typeof key !== "string" || !key) || new Set(keys).size !== keys.length)
    return "Each list item needs a different stable item key.";
  const refs = value.map(x => record(x)._ref).filter(Boolean);
  return new Set(refs).size === refs.length || "Do not select the same referenced record twice.";
}
export function linkRules(value: unknown) {
  if (value === undefined) return true;
  const link = record(value);
  if (link.kind === "internal") {
    if (!link.target || link.externalUrl) return "Choose an internal destination only.";
    if (link.newWindow !== false) return "Internal links must open in the same window.";
  } else if (link.kind === "external") {
    if (!link.externalUrl || link.target || link.fragment) return "Choose an external HTTPS URL only, without an internal destination or fragment.";
    if (link.newWindow !== true) return "External links must open in a new window.";
  }
  return true;
}
export function mediaRules(value: unknown) {
  if (value === undefined) return true;
  const media = record(value);
  if (media.decorative !== true && (typeof media.alt !== "string" || !media.alt.trim()))
    return "Describe this informative image in the alt text.";
  if (record(media.rights).status !== "approved")
    return "Media cannot be published until usage rights are approved. Public visibility is not permission.";
  return true;
}
export function portableTextRules(value: unknown) {
  if (value === undefined) return true;
  if (!Array.isArray(value) || !value.length) return "Add at least one ordinary paragraph.";
  for (const block of value) {
    const b = record(block);
    if (b._type !== "block" || b.style !== "normal" || b.listItem || !Array.isArray(b.children) || !b.children.length)
      return "Use ordinary paragraphs only, without embeds, lists or custom HTML.";
    const children = b.children.map(record);
    if (!children.some(c => typeof c.text === "string" && !!c.text.trim())) return "Paragraphs must contain text.";
    if (children.some(c => c._type !== "span" || (c.text !== "" && plainText(c.text) !== true))) return "Use plain text spans, without executable markup.";
    const definitions = Array.isArray(b.markDefs) ? b.markDefs.map(record) : [];
    if (definitions.some(d => d._type !== "link")) return "Only reviewed website links are allowed as annotations.";
    const marks = new Set(["strong", "em", ...definitions.map(d => String(d._key))]);
    if (children.some(c => Array.isArray(c.marks) && c.marks.some(m => !marks.has(String(m))))) return "Use only bold, emphasis or defined link annotations.";
  }
  return true;
}
export function slugFormat(value: unknown) {
  if (value === undefined) return true;
  const slug = record(value).current;
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !reservedSlugs.includes(slug)
    || "Use lowercase words separated by single hyphens, without slashes or reserved route names.";
}
export async function uniqueField(value: string, field: "slug.current" | "routeKey", context: ValidationContext) {
  const id = String(context.document?._id ?? "").replace(/^drafts\./, "");
  try {
    const client = context.getClient({ apiVersion }).withConfig({ perspective: "raw", useCdn: false });
    const count = await client.fetch<number>(
      `count(*[_type == $type && ${field} == $value && !(_id in $self) && !(_id in path("versions.**"))])`,
      { type: context.document?._type, value, self: [id, `drafts.${id}`] },
    );
    return count === 0 || "This route is already used by another document (including drafts).";
  } catch { return "Route uniqueness could not be checked. Retry when project access is available."; }
}
export async function projectSlug(value: unknown, context: ValidationContext) {
  if (value === undefined) return true;
  const format = slugFormat(value);
  if (format !== true) return format;
  const slug = String(record(value).current);
  const migration = record(context.document?.migration);
  if (typeof migration.legacyPath === "string" && migration.legacyPath !== `/work/${slug}/`)
    return "Keep the existing /work/{slug}/ route. Slug changes need a separately reviewed redirect.";
  if (typeof migration.sourceKey === "string") {
    const legacy = originalSlugs.find(s => migration.sourceKey === `portfolio-v2/project/${s}`);
    if (legacy && slug !== legacy) return "Preserve this existing project's approved slug.";
  }
  const unique = await uniqueField(slug, "slug.current", context);
  if (unique !== true) return unique;
  const id = String(context.document?._id ?? "").replace(/^drafts\./, "");
  if (!id) return true;
  try {
    const published = await context.getClient({ apiVersion }).withConfig({ perspective: "raw", useCdn: false })
      .fetch<{ slug?: { current?: string } } | null>(`*[_id == $id][0]{slug}`, { id });
    return !published?.slug?.current || published.slug.current === slug
      || "The published slug is locked. Request a reviewed redirect before changing it.";
  } catch { return "The published route could not be checked. Retry when project access is available."; }
}
export function projectRules(value: unknown) {
  if (value === undefined) return true;
  const project = record(value), attribution = record(project.attribution);
  if (originalSlugs.includes(String(record(project.slug).current)) &&
      (attribution.deliveryCredit !== "Dazlab" || attribution.role !== "Sole Webflow developer"))
    return "These four projects must credit Dazlab and the sole Webflow developer role, for marketing websites only.";
  if (project.portfolioStatus === "provisional" &&
      (!Array.isArray(record(project.caseStudy).publicNotices) || !(record(project.caseStudy).publicNotices as unknown[]).length))
    return "Provisional entries need their public facts/rights notice.";
  return true;
}
export function experienceRules(value: unknown) {
  const experience = record(value);
  return typeof experience.startYear !== "number" || typeof experience.endYear !== "number"
    || experience.endYear >= experience.startYear || "The end year must not precede the start year.";
}

const allowedSections: Record<string, string[]> = {
  home: ["heroSection", "toolsSection", "projectCollectionSection", "featureListSection", "profileSection", "experienceSection", "ctaSection"],
  about: ["profileSection", "experienceSection"],
  work: ["projectCollectionSection", "ctaSection"],
  contact: ["textSection", "featureListSection", "ctaSection"],
};
export function pageSections(value: unknown, context: ValidationContext) {
  if (!Array.isArray(value)) return true;
  const route = String(context.document?.routeKey ?? "");
  if (!allowedSections[route]) return "Choose the page's fixed route before adding sections.";
  if (value.some(s => !allowedSections[route].includes(String(record(s)._type)))) return "A section is not allowed in this page template.";
  const anchors = value.map(s => record(s).anchor).filter(Boolean);
  if (new Set(anchors).size !== anchors.length) return "Section anchors must be unique within the page.";
  const types = value.map(s => record(s)._type);
  const required = route === "home" ? ["heroSection", "toolsSection", "projectCollectionSection", "profileSection", "experienceSection", "ctaSection"]
    : route === "about" ? ["profileSection", "experienceSection"] : route === "work" ? ["projectCollectionSection", "ctaSection"] : ["textSection", "featureListSection"];
  if (required.some(t => !types.includes(t))) return "Add the required sections for this page template.";
  if (route === "home" && (types[0] !== "heroSection" || types.filter(t => t === "heroSection").length !== 1))
    return "The home page starts with exactly one split hero.";
  if (route === "home" && ["work", "expertise", "workflow", "about", "experience", "contact"].some(a => !anchors.includes(a)))
    return "Preserve the home anchors: work, expertise, workflow, about, experience and contact.";
  return true;
}
