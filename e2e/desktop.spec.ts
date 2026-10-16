import { expect, test } from '@playwright/test';

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop-only behaviour');

  test('case page is server-rendered inside a window', async ({ page }) => {
    await page.goto('/en/work/atlas-ir/');
    const win = page.locator('[data-window="project:atlas-ir"]');
    await expect(win).toBeVisible();
    await expect(win.getByRole('heading', { name: 'Atlas IR', level: 2 })).toBeVisible();
  });

  test('opening a project updates the URL and back closes it', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('link', { name: 'SDM Metall Prom' }).first().click();
    await expect(page).toHaveURL(/\/en\/work\/sdm-metall-prom\/$/);
    await expect(page.locator('[data-window="project:sdm-metall-prom"]')).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('[data-window="project:sdm-metall-prom"]')).toHaveCount(0);
  });

  test('zoom fills the work area and restores', async ({ page }) => {
    await page.goto('/en/work/atlas-ir/');
    const win = page.locator('[data-window="project:atlas-ir"]');
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
    await page.goto('/en/work/atlas-ir/');
    const win = page.locator('[data-window="project:atlas-ir"]');
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

  test('early works folder lists study projects', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('link', { name: 'Early works' }).click();
    const win = page.locator('[data-window="early"]');
    await expect(win.getByRole('link', { name: 'Parallax webpage' })).toBeVisible();
  });

  test('marquee selects several icons and they move together', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('html[data-ready]').waitFor({ state: 'attached' });
    const atlas = page.locator('a.icon', { hasText: 'Atlas IR' });
    const sdm = page.locator('a.icon', { hasText: 'SDM Metall Prom' });
    const a0 = (await atlas.boundingBox())!;
    const s0 = (await sdm.boundingBox())!;
    await page.mouse.move(Math.min(a0.x, s0.x) - 20, a0.y - 10);
    await page.mouse.down();
    await page.mouse.move(Math.max(a0.x + a0.width, s0.x + s0.width) + 10, s0.y + s0.height - 20, {
      steps: 6,
    });
    await page.mouse.up();
    await expect(atlas).toHaveClass(/selected/);
    await expect(sdm).toHaveClass(/selected/);
    const art = (await atlas.locator('.icon-art').boundingBox())!;
    await page.mouse.move(art.x + art.width / 2, art.y + art.height / 2);
    await page.mouse.down();
    await page.mouse.move(art.x + art.width / 2 + 200, art.y + art.height / 2 + 60, { steps: 6 });
    await page.mouse.up();
    expect((await atlas.boundingBox())!.x).toBeGreaterThan(a0.x + 150);
    expect((await sdm.boundingBox())!.x).toBeGreaterThan(s0.x + 150);
    await expect(page.locator('.win')).toHaveCount(0); // перетаскивание не открывает окно
  });

  test('mail opens a compose window, not a form that sends data', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('button', { name: 'Mail' }).first().click();
    const win = page.locator('[data-window="mail"]');
    await expect(win).toBeVisible();
    await expect(win.getByText('pipchenkova0701@gmail.com')).toBeVisible();
  });

  test('spotlight finds the hidden terminal', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('html[data-ready]').waitFor({ state: 'attached' });
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
    await page.getByRole('link', { name: 'Atlas IR' }).first().tap();
    const win = page.locator('[data-window="project:atlas-ir"]');
    await expect(win).toBeVisible();
    await win.getByRole('button', { name: 'Закрыть' }).last().tap();
    await expect(win).toHaveCount(0);
  });
});

test('recruiter mode lists cases and opens them in place', async ({ page }) => {
  await page.goto('/en/cv/');
  await page.getByRole('link', { name: /^Atlas IR —/ }).click();
  await expect(page).toHaveURL(/\/en\/cv\/atlas-ir\/$/);
  await expect(page.getByRole('heading', { name: 'Atlas IR' })).toBeVisible();
  await expect(page.locator('.win')).toHaveCount(0);
});
