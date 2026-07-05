const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    // Avoid caching
    extraHTTPHeaders: { "Cache-Control": "no-cache" },
  });
  const page = await context.newPage();

  // Track network requests
  const networkRequests = [];
  page.on("request", (req) => {
    networkRequests.push({ url: req.url(), method: req.method(), resourceType: req.resourceType() });
  });

  const BASE = "https://new-ashtabula-initiative.vercel.app/engineers/";
  console.log("1. Navigating to", BASE);
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Wait for React to mount by polling for body text length to exceed 100
  for (let i = 0; i < 30; i++) {
    const len = await page.evaluate(() => document.body.textContent?.length || 0);
    if (len > 100) break;
    await page.waitForTimeout(500);
  }

  const pageText = await page.evaluate(() => document.body.textContent || "");
  console.log("Page loaded, length:", pageText.length, "chars");
  console.log("Has Engineer's Assistant:", pageText.includes("Engineer's Assistant"));
  console.log("Has AI-Powered badge:", pageText.includes("AI-Powered"));
  console.log("Has API key configured:", !pageText.includes("API key not configured"));

  // Click Generate Summary
  const btn = page.locator("button:has-text('Generate Summary')");
  const btnCount = await btn.count();
  console.log("Generate Summary button count:", btnCount);

  if (btnCount > 0) {
    await btn.click();
    console.log("2. Clicked Generate Summary");

    // Wait up to 25 seconds for a result
    let resultFound = false;
    for (let i = 0; i < 50; i++) {
      const text = await page.evaluate(() => document.body.textContent || "");
      // Check for result content (bullets, engineering text) or error
      if (text.includes("•") || text.includes("bullet") || text.includes("structural") || text.includes("review") ||
          text.includes("error") || text.includes("API key")) {
        resultFound = true;
        break;
      }
      // Also check for non-placeholder content in result section
      if (!text.includes("Enter your project brief")) {
        resultFound = true;
        break;
      }
      await page.waitForTimeout(500);
    }

    console.log("Result found:", resultFound);

    // Take screenshot of result
    await page.screenshot({
      path: "/root/new-ashtabula-initiative/sitemap_screenshots/025_engineers_result.png",
      fullPage: true,
    });
    console.log("Result screenshot saved");
  }

  console.log("\n=== NETWORK REQUESTS ===");
  const xhrRequests = networkRequests.filter(r => r.resourceType === "xhr" || r.resourceType === "fetch");
  console.log("XHR/Fetch requests:", xhrRequests.length);
  xhrRequests.forEach(r => console.log(`  ${r.method} ${r.url}`));

  const geminiApi = networkRequests.filter(r => r.url.includes("generativelanguage.googleapis.com"));
  console.log("Gemini API hits:", geminiApi.length);

  const openrouterCalls = networkRequests.filter(r => r.url.includes("openrouter.ai"));
  console.log("OpenRouter API calls:", openrouterCalls.length);
  openrouterCalls.forEach(r => console.log(`  ${r.method} ${r.url}`));

  // Get final page text for evidence
  const finalText = await page.evaluate(() => document.body.textContent || "");
  console.log("\n=== BODY TEXT (first 800 chars) ===");
  console.log(finalText.substring(0, 800));

  const allPass = pageText.includes("Engineer's Assistant") &&
                  pageText.includes("AI-Powered") &&
                  !pageText.includes("Gemini") &&
                  openrouterCalls.length > 0 &&
                  geminiApi.length === 0;

  console.log(`\nAll checks pass: ${allPass ? "YES ✅" : "NO ❌"}`);
  console.log(`OpenRouter called: ${openrouterCalls.length > 0 ? "YES ✅" : "NO ❌"}`);
  console.log(`Gemini API avoided: ${geminiApi.length === 0 ? "YES ✅" : "NO ❌"}`);

  await browser.close();
  process.exit(allPass ? 0 : 1);
}

main().catch(err => {
  console.error("FAILED:", err.message);
  process.exit(1);
});
