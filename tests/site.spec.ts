import { test, expect } from '@playwright/test';
const language = '/인공어/고대-라르다라쓰어';
const pages = [
  ['/', '카르틀란'], ['/인공어/', '인공어'], [`${language}/`, '고대 라르다라쓰어'],
  [`${language}/발음-체계`, '발음 체계'], [`${language}/명사`, '명사'], [`${language}/단어장`, '단어장'],
] as const;

test('original routes preserve canonical URLs, Korean content, IPA, and mobile layout', async ({ page }) => {
  for (const [path, title] of pages) {
    expect((await page.goto(path))?.status(), path).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL(path, 'https://www.khartllan.com').href);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      expect(size[0], `${path} at ${width}px`).toBeLessThanOrEqual(size[1]);
    }
  }
  await page.goto('/');
  await expect(page.locator('.hero-intro')).toContainText('카르틀란은 다섯 지성 종족이 살아가던 행성입니다.');
  await page.goto(`${language}/발음-체계`);
  for (const text of ['자음은 총 29개', 'th /θ/', 'gn /ɲ/', 'ng /ŋ/', 'uh /ə/', '6개의 단모음과 8개의 이중모음']) await expect(page.locator('.prose')).toContainText(text);
  await expect(page.locator('#자음-체계')).toBeVisible();
  await expect(page.locator('#모음-체계')).toBeVisible();
});

test('hierarchy, chapter order, breadcrumbs, mobile navigation, and dictionary link work', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${language}/발음-체계`);
  await expect(page.locator('.desktop-tree a')).toHaveText(['카르틀란 소개', '인공어', '고대 라르다라쓰어', '발음 체계', '명사', '단어장']);
  await expect(page.locator('.desktop-tree [aria-current="page"]')).toHaveText('발음 체계');
  await expect(page.locator('.breadcrumbs a')).toHaveText(['카르틀란', '인공어', '고대 라르다라쓰어']);
  await expect(page.getByRole('navigation', { name: '문서 순서' }).getByRole('link', { name: /다음 기록/ })).toHaveAttribute('href', `${language}/명사`);
  await page.locator('.desktop-toc').getByRole('link', { name: '모음 체계' }).click();
  await expect(page).toHaveURL(new RegExp(encodeURI('#모음-체계') + '$'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-tree summary').click();
  await page.locator('.mobile-tree').getByRole('link', { name: '단어장', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('단어장');
  await expect(page.locator('.prose a')).toHaveAttribute('href', 'https://docs.google.com/spreadsheets/d/1yyjEucWe45OcMyYciiNJ3iFMzzRP2uP4hl8NN0_OKfU/edit?usp=sharing');
});

test('original footnote anchors work in both directions', async ({ page }) => {
  await page.goto(`${language}/`);
  await expect(page.locator('#user-content-fn-1')).toContainText('데이노니쿠스');
  await expect(page.locator('#user-content-fn-2')).toContainText('씨앗에서 태어나');
  await page.locator('#user-content-fnref-1').click();
  await expect(page).toHaveURL(/#user-content-fn-1$/);
  await page.locator('#user-content-fn-1 a').click();
  await expect(page).toHaveURL(/#user-content-fnref-1$/);
  await expect(page.locator('.prose')).toContainText('사나사르히타린(Sanasarkhitarin)');
});

test('search handles titles, body text, IPA, query URLs, and empty states', async ({ page }) => {
  await page.goto('/search/');
  const query = page.getByRole('searchbox');
  const visible = page.locator('.search-results li:visible');
  await expect(visible).toHaveCount(6);
  for (const term of ['발음', 'θ', '쓰쿠우후']) {
    await query.fill(term);
    await expect(visible).toHaveCount(1);
  }
  await expect(visible).toContainText('고대 라르다라쓰어');
  await page.reload();
  await expect(query).toHaveValue('쓰쿠우후');
  await expect(visible).toHaveCount(1);
  await query.fill('zzzz-no-matching-document');
  await expect(visible).toHaveCount(0);
  await expect(page.locator('#no-results')).toBeVisible();
  await query.fill('');
  await expect(visible).toHaveCount(6);
  await expect(page.locator('#no-results')).toBeHidden();
});

test('internal links, feeds, sitemap, and legacy HTML addresses remain reachable', async ({ page, request }) => {
  const links = new Set<string>();
  for (const [path] of pages) {
    await page.goto(path);
    (await page.locator('a[href^="/"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')!))).forEach((href) => links.add(href));
  }
  for (const path of links) expect((await request.get(path)).status(), path).toBe(200);
  for (const leaf of ['발음-체계', '명사', '단어장']) {
    expect((await request.get(`${language}/${leaf}.html`)).status()).toBe(200);
    expect((await request.get(`${language}/${leaf}/`)).status()).toBe(200);
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const [path] of pages) expect(sitemap).toContain(new URL(path, 'https://www.khartllan.com').href);
  expect((await (await request.get('/index.xml')).text()).match(/<item>/g)).toHaveLength(5);
  expect((await request.get('/missing-record/')).status()).toBe(404);
});

test('reading and the full document list work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4331${language}/`);
  await expect(page.locator('.prose')).toContainText('범(凡)-라르다라쓰(Lardarath) 문화권');
  await expect(page.locator('.desktop-tree a')).toHaveCount(6);
  await page.goto('http://127.0.0.1:4331/search/');
  await expect(page.locator('.search-results li')).toHaveCount(6);
  await expect(page.locator('.search-fallback')).toBeVisible();
  await context.close();
});

test('keyboard access, pure white background, and local Noto fonts work', async ({ page }) => {
  const externalFonts: string[] = [];
  page.on('request', (request) => { if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFonts.push(request.url()); });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  const style = await page.locator('body').evaluate((body) => ({ background: getComputedStyle(document.documentElement).backgroundColor, font: getComputedStyle(body).fontFamily }));
  expect(style.background).toBe('rgb(255, 255, 255)');
  expect(style.font).toContain('Noto Sans');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('15px "Noto Sans KR Variable"', '카르틀란'))).toBe(true);
  expect(externalFonts).toHaveLength(0);
});
