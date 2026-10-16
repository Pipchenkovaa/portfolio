import { expect, test } from '@playwright/test';

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop-only behaviour');

  test('case page is server-rendered inside a window', async ({ page }) => {
    await page.goto('/en/work/travly/');
    const win = page.locator('[data-window="project:travly"]');
    await expect(win).toBeVisible();
    await expect(win.getByRole('heading', { name: 'Travly', level: 2 })).toBeVisible();
  });

  test('opening a project updates the URL and back closes it', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('link', { name: 'Frontier' }).first().click();
    await expect(page).toHaveURL(/\/en\/work\/frontier\/$/);
    await expect(page.locator('[data-window="project:frontier"]')).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('[data-window="project:frontier"]')).toHaveCount(0);
  });

  test('zoom fills the work area and restores', async ({ page }) => {
    await page.goto('/en/work/travly/');
    const win = page.locator('[data-window="project:travly"]');
    await page.waitForTimeout(400); // дождаться анимации появления
    const before = await win.boundingBox();
    await win.getByRole('button', { name: 'Zoom' }).click();
    await expect.poll(async () => (await win.boundingBox())?.width).toBeGreaterThan(1300);
    await win.getByRole('button', { name: 'Zoom' }).click();
    await expect
      .poll(async () => Math.round((await win.boundingBox())?.width ?? 0))
      .toBe(Math.round(before!.width));
  });

  test('resize from the corner', async ({ page }) => {
    await page.goto('/en/work/travly/');
    const win = page.locator('[data-window="project:travly"]');
    await page.waitForTimeout(400);
    const before = (await win.boundingBox())!;
    const handle = (await win.locator('.rh-se').boundingBox())!;
    await page.mouse.move(handle.x + 5, handle.y + 5);
    await page.mouse.down();
    await page.mouse.move(handle.x + 125, handle.y + 85, { steps: 6 });
    await page.mouse.up();
    const after = (await win.boundingBox())!;
    expect(after.width).toBeGreaterThan(before.width + 100);
  });

  test('spotlight finds the hidden terminal', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('ControlOrMeta+k');
    await page.getByRole('combobox').fill('terminal');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-window="terminal"]')).toBeVisible();
  });
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only behaviour');

  test('home screen opens a sheet with a close button', async ({ page }) => {
    await page.goto('/ru/');
    await page.getByRole('link', { name: 'Travly' }).first().tap();
    const win = page.locator('[data-window="project:travly"]');
    await expect(win).toBeVisible();
    await win.getByRole('button', { name: 'Закрыть' }).last().tap();
    await expect(win).toHaveCount(0);
  });
});

test('recruiter mode lists cases and opens them in place', async ({ page }) => {
  await page.goto('/en/cv/');
  await page.getByRole('link', { name: /Travly/ }).click();
  await expect(page).toHaveURL(/\/en\/cv\/travly\/$/);
  await expect(page.getByRole('heading', { name: 'Travly' })).toBeVisible();
  await expect(page.locator('.win')).toHaveCount(0);
});
