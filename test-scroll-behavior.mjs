import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to home page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Initial scroll position should be at top
    const initialScroll = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll position: ${initialScroll}`);

    // Scroll down the page
    console.log('Scrolling down...');
    await page.evaluate(() => {
      window.scrollBy(0, 800);
    });

    const scrolledPosition = await page.evaluate(() => window.scrollY);
    console.log(`After scroll down: ${scrolledPosition}px`);

    if (scrolledPosition <= 0) {
      console.log('❌ Failed to scroll down');
      process.exit(1);
    }

    // Click the Projects navigation link
    console.log('Clicking Projects link...');
    await page.click('a[href="/projects"]');

    // Wait for route change
    await page.waitForURL('**/projects');

    // Small delay to ensure scroll happened
    await page.waitForTimeout(100);

    const finalScroll = await page.evaluate(() => window.scrollY);
    console.log(`After clicking Projects link: ${finalScroll}px`);

    if (finalScroll === 0 || finalScroll < 50) {
      console.log('✅ SUCCESS: Page scrolled to top on navigation!');
    } else {
      console.log(`❌ FAILED: Page is at ${finalScroll}px, expected near 0px`);
      process.exit(1);
    }

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
