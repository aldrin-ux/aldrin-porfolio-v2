import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const warn = (condition, message) => {
  if (!condition) warnings.push(message);
};

const files = {
  packageJson: JSON.parse(read("package.json")),
  gitignore: exists(".gitignore") ? read(".gitignore") : "",
  astroConfig: read("astro.config.mjs"),
  baseLayout: read("src/layouts/BaseLayout.astro"),
  siteData: read("src/content/site.ts"),
  contactForm: read("src/components/ContactForm.astro"),
  netlify: exists("netlify.toml") ? read("netlify.toml") : "",
};

assert(files.packageJson.scripts?.build === "astro build", "package.json must keep the Astro production build script.");
assert(files.packageJson.scripts?.check === "node scripts/validate-release.mjs", "package.json must expose the release validation check.");

for (const pattern of ["node_modules/", "dist/", ".astro/", ".env", ".env.*", "*.log", ".netlify/"]) {
  assert(files.gitignore.includes(pattern), `.gitignore must include ${pattern}.`);
}

for (const path of [
  "src/pages/index.astro",
  "src/pages/about.astro",
  "src/pages/contact.astro",
  "src/pages/contact/success.astro",
  "src/pages/work/index.astro",
  "src/pages/work/dazlab.astro",
  "src/pages/work/mortar.astro",
  "src/pages/work/handl.astro",
  "src/pages/work/tangilla.astro",
  "src/pages/404.astro",
  "src/pages/sitemap.xml.ts",
  "public/robots.txt",
  "netlify.toml",
]) {
  assert(exists(path), `${path} must exist.`);
}

assert(files.baseLayout.includes('rel="canonical"'), "BaseLayout must render canonical URLs.");
assert(files.baseLayout.includes('property="og:title"'), "BaseLayout must render Open Graph metadata.");
assert(files.baseLayout.includes('name="twitter:card"'), "BaseLayout must render Twitter card metadata.");
assert(files.baseLayout.includes('type="application/ld+json"'), "BaseLayout must render JSON-LD when provided.");
assert(files.baseLayout.includes('name="robots"'), "BaseLayout must render robots directives.");
assert(files.baseLayout.includes("sitePlaceholder"), "BaseLayout must guard placeholder domains from indexing.");

assert(files.contactForm.includes('data-netlify="true"'), "Contact form must keep Netlify form discovery markup.");
assert(files.contactForm.includes('netlify-honeypot="bot-field"'), "Contact form must keep a honeypot field.");
assert(files.contactForm.includes('method="POST"'), "Contact form must submit with POST.");

assert(files.netlify.includes('publish = "dist"'), "Netlify config must publish dist.");
assert(files.netlify.includes('command = "npm run build"'), "Netlify config must run the Astro build.");
assert(files.netlify.includes("X-Robots-Tag"), "Netlify deploy previews must be configured with noindex headers.");

for (const route of ["/work/dazlab/", "/work/mortar/", "/work/handl/", "/work/tangilla/"]) {
  assert(files.siteData.includes(`href: "${route}"`), `Project data must link cards internally to ${route}.`);
}
assert(files.siteData.includes("caseStudies"), "Case-study content must be structured for multiple project routes.");

warn(!files.astroConfig.includes("https://example.com"), "Production domain is still the placeholder https://example.com.");
warn(!files.siteData.includes("To be confirmed"), "Some experience dates are still explicitly unverified.");

if (exists("dist")) {
  const routes = {
    "/": "dist/index.html",
    "/about/": "dist/about/index.html",
    "/contact/": "dist/contact/index.html",
    "/contact/success/": "dist/contact/success/index.html",
    "/work/": "dist/work/index.html",
    "/work/dazlab/": "dist/work/dazlab/index.html",
    "/work/mortar/": "dist/work/mortar/index.html",
    "/work/handl/": "dist/work/handl/index.html",
    "/work/tangilla/": "dist/work/tangilla/index.html",
    "/404/": "dist/404.html",
  };

  for (const [route, path] of Object.entries(routes)) {
    assert(exists(path), `Built route ${route} must exist at ${path}.`);
  }

  for (const [route, path] of Object.entries(routes)) {
    if (!exists(path)) continue;
    const html = read(path);
    const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
    assert(h1Count === 1, `${route} must render exactly one h1; found ${h1Count}.`);
    assert(html.includes('rel="canonical"'), `${route} must include a canonical link.`);
    assert(html.includes('property="og:title"'), `${route} must include Open Graph title metadata.`);
    assert(html.includes('name="description"'), `${route} must include a meta description.`);
  }
}

const publicAssets = join(root, "public", "assets");
if (existsSync(publicAssets)) {
  const assetFiles = readdirSync(publicAssets).filter((file) => statSync(join(publicAssets, file)).isFile());
  for (const asset of ["aldrin-hero.webp", "dazlab.png", "mortar.png", "handl.png", "tangilla.png"]) {
    assert(assetFiles.includes(asset), `Expected public asset ${asset} to exist.`);
  }
}

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Release validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Release validation passed.");

