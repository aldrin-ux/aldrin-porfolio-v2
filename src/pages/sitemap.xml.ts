import { content } from "../content/resolved";
const routes = [
  "/",
  "/work/",
  "/work/dazlab/",
  "/work/mortar/",
  "/work/handl/",
  "/work/tangilla/",
  "/about/",
  "/contact/",
  ...(content.localProjectSlugs ?? []).map(slug => `/work/${slug}/`),
];

export function GET({ site }: { site?: URL }) {
  const origin = site?.toString() ?? "https://example.com/";
  const urls = routes
    .map((route) => {
      const loc = new URL(route, origin).toString();
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

