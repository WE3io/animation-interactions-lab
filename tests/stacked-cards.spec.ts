import { expect, test, type Page } from "@playwright/test";

async function enterActiveZone(page: Page) {
  const top = await page.$eval("[data-stacked-cards-root]", (el) => {
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => {
    window.scrollTo(0, Math.max(0, y - window.innerHeight * 0.2 + 80));
  }, top);
  await page.waitForTimeout(500);
  await page.mouse.move(640, 450);
}

async function getScales(page: Page) {
  return page.$$eval("[data-stacked-cards-card]", (els) => {
    return els.slice(0, 4).map((el) => {
      const transform = getComputedStyle(el).transform;
      if (!transform || transform === "none") return 1;
      const match = transform.match(/matrix\(([^)]+)\)/);
      return match ? Number(match[1].split(",")[0].trim()) : null;
    });
  });
}

test("later cards stack above earlier cards", async ({ page }) => {
  await page.goto("/examples/stacked-cards");
  await page.waitForSelector("[data-stacked-cards-root]");

  const zIndexes = await page.$$eval("[data-stacked-cards-card]", (els) => {
    return els.slice(0, 4).map((el) => Number(getComputedStyle(el).zIndex));
  });

  expect(zIndexes).toEqual([1, 2, 3, 4]);
});

test("gsap pin mode keeps left column aligned with section while exiting", async ({ page }) => {
  await page.goto("/examples/stacked-cards");
  await page.waitForSelector("[data-stacked-cards-root]");
  await enterActiveZone(page);

  const before = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>("[data-stacked-cards-root]")!;
    const pinned = document.querySelector<HTMLElement>("[data-stacked-cards-pinned]")!;
    return {
      delta: pinned.getBoundingClientRect().top - root.getBoundingClientRect().top,
      position: getComputedStyle(pinned).position,
      pinMode: root.dataset.stackedCardsPinMode
    };
  });

  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(500);

  const after = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>("[data-stacked-cards-root]")!;
    const pinned = document.querySelector<HTMLElement>("[data-stacked-cards-pinned]")!;
    return pinned.getBoundingClientRect().top - root.getBoundingClientRect().top;
  });

  expect(before.pinMode).toBe("gsap");
  expect(before.position).toBe("static");
  expect(Math.abs(before.delta - after)).toBeLessThan(1);
});

test("direction changes mid-animation remain stable", async ({ page }) => {
  await page.goto("/examples/stacked-cards");
  await page.waitForSelector("[data-stacked-cards-root]");
  await enterActiveZone(page);

  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(800);
  expect(await getScales(page)).toEqual([0.85, 1, 1, 1]);

  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(800);
  expect(await getScales(page)).toEqual([0.85, 0.9, 1, 1]);

  await page.mouse.wheel(0, -700);
  await page.waitForTimeout(800);
  expect(await getScales(page)).toEqual([0.85, 1, 1, 1]);

  await page.mouse.wheel(0, -700);
  await page.waitForTimeout(800);
  expect(await getScales(page)).toEqual([1, 1, 1, 1]);
});

test("mobile viewport falls back to static mode", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto("/examples/stacked-cards");
  await page.waitForSelector("[data-stacked-cards-root]");

  const top = await page.$eval("[data-stacked-cards-root]", (el) => {
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 120)), top);
  await page.waitForTimeout(500);

  const enhanced = await page.$eval("[data-stacked-cards-root]", (el) => el.dataset.enhanced);
  expect(enhanced).toBe("false");
});
