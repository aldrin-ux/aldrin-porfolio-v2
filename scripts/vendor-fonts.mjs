import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

// Preserve the exact Google Fonts versions, weights, glyph subsets and swap behavior.
const url = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
// Match the measured browser's font selection, not a guessed future UA.
const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36" } });
if (!response.ok) throw new Error(`Font stylesheet returned ${response.status}`);
let css = await response.text();
const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map((match) => match[1]))];
if (!urls.length) throw new Error("Expected WOFF2 subsets, refusing a font-format substitution.");
await mkdir("public/fonts/optimized", { recursive: true });
const files = new Map();
for (const source of urls) {
  const font = await fetch(source);
  if (!font.ok) throw new Error(`Font returned ${font.status}`);
  const bytes = Buffer.from(await font.arrayBuffer());
  const family = source.includes("/inter/") ? "inter" : "jetbrains-mono";
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const local = `/fonts/optimized/${family}.${hash}.woff2`;
  await writeFile(`public${local}`, bytes);
  files.set(source, local);
  css = css.replaceAll(source, local);
}
for (const [family, license] of [["inter", "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt"], ["jetbrains-mono", "https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt"]]) {
  const document = await fetch(license);
  if (!document.ok) throw new Error(`Font license returned ${document.status}`);
  await writeFile(`public/fonts/OFL-${family}.txt`, await document.text());
}
// Let font-display: swap govern loading. Preloads delayed homepage paint in
// repeated Lighthouse mobile trials; keep original unicode-range selection.
await writeFile("src/styles/fonts.css", `/* Original Google Fonts faces, self-hosted; SIL OFL licenses in public/fonts/. */\n${css}`);
console.log(`Vendored ${files.size} exact WOFF2 files and two OFL licenses.`);
