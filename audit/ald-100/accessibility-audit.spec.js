import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.ALD100_BASE_URL ?? "http://127.0.0.1:4174";
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

const normalize = (path) => new URL(path, baseUrl).toString();

test.describe("ALD-100 accessibility and interaction audit", () => {
  test.setTimeout(60000);

  for (const route of routes) {
    test(`${route.name} has no critical axe violations`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(normalize(route.path), { waitUntil: "load" });
      await page.waitForTimeout(route.path === "/" ? 2600 : 300);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze();

      await testInfo.attach("axe-results", {
        body: JSON.stringify(results.violations, null, 2),
        contentType: "application/json",
      });

      await page.screenshot({
        path: `audit/ald-100/screenshots/${route.name}-desktop.png`,
        fullPage: true,
      });

      expect(results.violations).toEqual([]);
    });

    test(`${route.name} has accessible document basics`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.goto(normalize(route.path), { waitUntil: "load" });
      await page.waitForTimeout(route.path === "/" ? 2600 : 300);

      const basics = await page.evaluate(() => {
        const unnamedLinks = [...document.querySelectorAll("a")]
          .filter((link) => {
            const text = link.textContent?.trim();
            const label = link.getAttribute("aria-label")?.trim();
            const labelledBy = link.getAttribute("aria-labelledby")?.trim();
            return !text && !label && !labelledBy;
          })
          .map((link) => link.outerHTML);

        const unnamedButtons = [...document.querySelectorAll("button")]
          .filter((button) => {
            const text = button.textContent?.trim();
            const label = button.getAttribute("aria-label")?.trim();
            const labelledBy = button.getAttribute("aria-labelledby")?.trim();
            return !text && !label && !labelledBy;
          })
          .map((button) => button.outerHTML);

        const imagesWithoutAlt = [...document.images]
          .filter((image) => !image.hasAttribute("alt"))
          .map((image) => image.outerHTML);

        return {
          h1Count: document.querySelectorAll("h1").length,
          unnamedLinks,
          unnamedButtons,
          imagesWithoutAlt,
        };
      });

      await testInfo.attach("document-basics", {
        body: JSON.stringify(basics, null, 2),
        contentType: "application/json",
      });

      await page.screenshot({
        path: `audit/ald-100/screenshots/${route.name}-mobile.png`,
        fullPage: true,
      });

      expect(basics.h1Count).toBe(1);
      expect(basics.unnamedLinks).toEqual([]);
      expect(basics.unnamedButtons).toEqual([]);
      expect(basics.imagesWithoutAlt).toEqual([]);
    });
  }

  test("keyboard users can skip to main content and reach primary controls", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(normalize("/"), { waitUntil: "networkidle" });

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Explore design work ↗" })).toBeFocused();
  });

  test("mobile navigation traps and returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(normalize("/"), { waitUntil: "networkidle" });

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
    await expect(page.locator(".menu-close")).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(dialog.getByRole("link", { name: /Contact/ })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator(".menu-close")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  });

  test("contact form exposes durable labels and browser validation targets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(normalize("/contact/"), { waitUntil: "networkidle" });

    await expect(page.getByRole("group", { name: "Inquiry type" })).toBeVisible();
    await expect(page.getByLabel("Website Project")).toBeChecked();
    await expect(page.getByLabel("Remote Role")).not.toBeChecked();
    await expect(page.getByLabel("Your name or studio")).toBeVisible();
    await expect(page.getByLabel("Business email")).toBeVisible();
    await expect(page.getByLabel("Project details or message")).toBeVisible();

    await page.getByRole("button", { name: /send inquiry/i }).click();
    const invalidName = await page.getByLabel("Your name or studio").evaluate((input) => input.matches(":invalid"));
    expect(invalidName).toBe(true);
  });
});
