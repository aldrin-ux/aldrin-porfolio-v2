import { test, expect } from "@playwright/test";

const baseUrl = process.env.ALD98_BASE_URL ?? "https://aldrin-camacho.netlify.app";
const routes = [
  { path: "/", name: "home" },
  { path: "/work/", name: "work" },
  { path: "/work/dazlab/", name: "dazlab" },
  { path: "/work/mortar/", name: "mortar" },
  { path: "/work/handl/", name: "handl" },
  { path: "/work/tangilla/", name: "tangilla" },
  { path: "/about/", name: "about" },
  { path: "/contact/", name: "contact" },
];

const widths = [320, 375, 390, 430, 768, 1024, 1440, 1920];
const representativeWidths = new Set([320, 768, 1440, 1920]);

const normalize = (path) => new URL(path, baseUrl).toString();

test.describe("ALD-98 live responsive audit", () => {
  test.setTimeout(60000);

  for (const route of routes) {
    for (const width of widths) {
      test(`${route.name} has no horizontal overflow at ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: width < 768 ? 900 : 1100 });
        await page.goto(normalize(route.path), { waitUntil: "load" });
        await page.waitForTimeout(route.path === "/" && width >= 1024 ? 2800 : 400);
        await page.evaluate(async () => {
          const step = Math.max(window.innerHeight * 0.75, 400);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => window.setTimeout(resolve, 70));
          }
          window.scrollTo(0, 0);
          await new Promise((resolve) => window.setTimeout(resolve, 120));
        });

        const metrics = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const overflowing = [...document.querySelectorAll("body *")]
            .map((node) => {
              const rect = node.getBoundingClientRect();
              const styles = window.getComputedStyle(node);
              return {
                tag: node.tagName.toLowerCase(),
                className: typeof node.className === "string" ? node.className : "",
                text: (node.textContent ?? "").trim().slice(0, 80),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowX: styles.overflowX,
                position: styles.position,
              };
            })
            .filter((item) => item.width > 0 && (item.left < -1 || item.right > doc.clientWidth + 1));

          return {
            clientWidth: doc.clientWidth,
            scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
            overflowing,
            h1Count: document.querySelectorAll("h1").length,
            visibleImages: [...document.images].map((img) => ({
              src: img.currentSrc || img.src,
              alt: img.alt,
              complete: img.complete,
              naturalWidth: img.naturalWidth,
              renderedWidth: Math.round(img.getBoundingClientRect().width),
            })),
          };
        });

        await testInfo.attach("metrics", {
          body: JSON.stringify(metrics, null, 2),
          contentType: "application/json",
        });

        if (representativeWidths.has(width)) {
          await page.screenshot({
            path: `audit/ald-98/screenshots/${route.name}-${width}.png`,
            fullPage: true,
          });
        }

        expect(metrics.h1Count).toBe(1);
        expect(metrics.scrollWidth, JSON.stringify(metrics.overflowing, null, 2)).toBeLessThanOrEqual(metrics.clientWidth + 1);
        expect(
          metrics.visibleImages
            .filter((img) => img.renderedWidth > 0)
            .every((img) => !img.complete || img.naturalWidth > 0)
        ).toBe(true);
      });
    }
  }

  test("mobile navigation opens, traps focus, and closes with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(normalize("/"), { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
    await expect(page.locator(".menu-close")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  });

  test("Selected Work card links route internally and live links stay external", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1000 });
    await page.goto(normalize("/work/"), { waitUntil: "networkidle" });

    const slugs = ["dazlab", "mortar", "handl", "tangilla"];
    for (const slug of slugs) {
      await expect(page.locator(`a[href="/work/${slug}/"]`).first()).toBeVisible();
    }

    const externalUrls = [
      "https://dazlab.digital/",
      "https://mortar.design/",
      "https://handl.works/",
      "https://tangilla.com/",
    ];
    for (const href of externalUrls) {
      const link = page.locator(`a[href="${href}"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });
});
