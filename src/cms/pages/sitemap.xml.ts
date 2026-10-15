import { projects } from "../../content/resolved";
const routes = ["/", "/work/", ...projects.map(p => p.href), "/about/", "/contact/"];
export function GET({ site }: { site?: URL }) {
  const urls = routes.map(route => `  <url><loc>${new URL(route, site ?? "https://example.com/").toString()}</loc></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
