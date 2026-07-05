// Playwright script to verify Engineer's Assistant migration
// Using CommonJS for better module resolution
const { chromium } = require("playwright");
const { writeFileSync } = require("fs");

const BASE = "https://new-ashtabula-initiative.vercel.app/engineers/";
const OUTPUT = "/root/new-ashtabula-initiative/sitemap_screenshots";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Track all network requests
  const networkRequests = [];
  page.on("request", (req) => {
    networkRequests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
    });
  });

  // Navigate to the page
  console.log("Navigating to", BASE);
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 30000 });
  // Wait for React to mount — look for the page content
  await page.waitForSelector(".page", { timeout: 10000 }).catch(() => console.log("  .page selector timeout — trying text"));
  await page.waitForSelector(".header", { timeout: 5000 }).catch(() => console.log("  .header selector timeout"));
  await page.waitForTimeout(2000); // Extra settling time for React

  // === CHECK 1: Visual UI state ===
  console.log("\n=== CHECK 1: Visual UI State ===");

  // Badge check - use evaluate for more reliable reading
  const pageText = await page.evaluate(() => document.body.textContent || "");
  console.log("Page length:", pageText.length, "chars");

  const hasAiPoweredBadge = pageText.includes("AI-Powered");
  console.log("Badge 'AI-Powered' visible:", hasAiPoweredBadge);

  const hasGeminiBadge = pageText.includes("Gemini");
  console.log("Gemini badge visible (should be false):", hasGeminiBadge);

  const hasBannerKeywords =
    pageText.includes("Setup") ||
    pageText.includes("setup") ||
    pageText.includes("API key required") ||
    pageText.includes("configure your");
  console.log("Setup/banner keywords visible (should be false):", hasBannerKeywords);

  const hasAiPoweredHero = pageText.includes("AI‑powered") || pageText.includes("AI-powered");
  console.log("Hero 'AI‑powered' text:", hasAiPoweredHero);

  // Check for specific Engineer's Assistant content
  const hasEngineerBrand = pageText.includes("Engineer's Assistant");
  console.log("Engineer's Assistant branding:", hasEngineerBrand);

  // Screenshot before clicking
  await page.screenshot({
    path: `${OUTPUT}/025_engineers_before_generate.png`,
    fullPage: true,
  });
  console.log("Pre-generate screenshot saved");

  // === CHECK 2: Test Generate Summary function ===
  console.log("\n=== CHECK 2: Generate Summary Function ===");

  // Click the Generate Summary button
  const generateBtn = page.locator("button:has-text('Generate Summary')");
  const btnExists = (await generateBtn.count()) > 0;
  console.log("Generate Summary button found:", btnExists);

  if (btnExists) {
    await generateBtn.click();
    console.log("Clicked Generate Summary");

    // Wait for response to appear — either result or error
    await page.waitForTimeout(2000);

    try {
      await page.waitForFunction(
        () => {
          const body = document.body.textContent || "";
          return (
            body.includes("bullet") ||
            body.includes("engineering") ||
            body.includes("structural") ||
            body.includes("error") ||
            body.includes("not configured") ||
            body.includes("API key")
          );
        },
        { timeout: 20000 }
      );
      console.log("Response appeared in DOM");
    } catch (e) {
      console.log("Timeout waiting for response — checking current state");
    }

    await page.waitForTimeout(2000);
  }

  // === CHECK 3: Network request analysis ===
  console.log("\n=== CHECK 3: Network Request Analysis ===");

  console.log(`Total network requests: ${networkRequests.length}`);

  // Check for Gemini API endpoints specifically (not Google Fonts)
  const geminiApiRequests = networkRequests.filter(
    (r) =>
      r.url.includes("generativelanguage.googleapis.com") ||
      r.url.includes("gemini.googleapis") ||
      r.url.includes("/v1beta/models/gemini")
  );
  console.log(`Requests to Gemini *API* endpoints: ${geminiApiRequests.length}`);
  geminiApiRequests.forEach((r) => console.log(`  GEMINI: ${r.url}`));

  // Check for OpenRouter API endpoints
  const openrouterRequests = networkRequests.filter((r) =>
    r.url.includes("openrouter.ai")
  );
  console.log(`Requests to OpenRouter API endpoints: ${openrouterRequests.length}`);
  openrouterRequests.forEach((r) => console.log(`  OPENROUTER: ${r.method} ${r.url}`));

  // All fetch/XHR requests
  const apiRequests = networkRequests.filter(
    (r) => r.resourceType === "xhr" || r.resourceType === "fetch"
  );
  console.log("All fetch/XHR requests:");
  apiRequests.forEach((r) => console.log(`  ${r.method} ${r.url} (${r.resourceType})`));

  // === CHECK 4: DOM check for Gemini references ===
  console.log("\n=== CHECK 4: DOM Gemini References ===");
  const fullHtml = await page.content();
  const geminiInDom =
    fullHtml.includes("Gemini") ||
    fullHtml.includes("gemini") ||
    fullHtml.includes("GEMINI");
  console.log("Gemini references in DOM:", geminiInDom);

  // Also check JS source for Gemini
  const jsRefs = await page.evaluate(() => {
    const scripts = document.querySelectorAll("script");
    const refs = [];
    scripts.forEach((s) => {
      if (s.src) refs.push(s.src);
      if (s.textContent && (s.textContent.includes("Gemini") || s.textContent.includes("gemini"))) {
        refs.push("inline script has Gemini ref");
      }
    });
    return refs;
  });
  console.log("Script src references:", jsRefs);

  // Screenshot after interaction
  await page.screenshot({
    path: `${OUTPUT}/025_engineers_after_generate.png`,
    fullPage: true,
  });
  console.log("Post-generate screenshot saved");

  // Print body excerpt
  const bodyText = await page.evaluate(() => document.body.textContent || "");
  console.log("\nPage body excerpt (first 500 chars):");
  console.log(bodyText.substring(0, 500));

  // Final summary
  console.log("\n=== FINAL SUMMARY ===");
  const results = {
    ui: {
      hasAiPoweredBadge,
      hasGeminiBadge: !!hasGeminiBadge,
      hasBannerKeywords: !!hasBannerKeywords,
      hasAiPoweredHero,
      hasEngineerBrand: !!hasEngineerBrand,
    },
    network: {
      geminiApiRequests: geminiApiRequests.length,
      openrouterRequests: openrouterRequests.length,
    },
    dom: { geminiReferences: geminiInDom },
  };
  console.log(JSON.stringify(results, null, 2));

  const allPass =
    results.ui.hasAiPoweredBadge &&
    !results.ui.hasGeminiBadge &&
    !results.ui.hasBannerKeywords &&
    results.ui.hasAiPoweredHero &&
    results.ui.hasEngineerBrand &&
    results.network.geminiApiRequests === 0 &&
    !results.dom.geminiReferences;

  console.log(`\nAll checks pass: ${allPass ? "YES ✅" : "NO ❌"}`);

  await browser.close();
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
