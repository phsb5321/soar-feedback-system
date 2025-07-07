import { expect, test } from "@playwright/test";

test.describe("SOAR Feedback System - Full User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("complete feedback flow - UI elements and interactions", async ({
    page,
  }) => {
    // Step 1: Verify landing page
    await expect(page.locator("h1")).toContainText("SOAR");
    await expect(
      page.locator("text=Sistema de Avaliação e Feedback")
    ).toBeVisible();

    // Step 2: Verify feedback form structure
    await expect(page.locator("text=Sistema de Avaliação SOAR")).toBeVisible();
    await expect(
      page.locator("text=Compartilhe sua experiência conosco")
    ).toBeVisible();

    // Step 3: Verify audio recording section
    await expect(page.locator("text=1. Grave seu feedback")).toBeVisible();
    const micButton = page.locator('button[aria-label="Start recording"]');
    await expect(micButton).toBeVisible();
    await expect(page.locator("text=Clique para gravar")).toBeVisible();

    // Step 4: Verify microphone button is interactive
    await expect(micButton).toBeEnabled();
    await expect(micButton).toHaveClass(/bg-blue-500/);

    // Step 5: Verify CSAT section is not visible initially
    await expect(page.locator("text=Como você avalia")).not.toBeVisible();

    // Step 6: Verify footer elements
    await expect(
      page.locator("text=Powered by AI • Seguro e Privado")
    ).toBeVisible();
    await expect(page.locator("text=Sistema Online")).toBeVisible();
    await expect(page.locator(".bg-green-500.animate-pulse")).toBeVisible();
  });

  test("text visibility and contrast validation", async ({ page }) => {
    // Test all critical text elements are visible
    const criticalTexts = [
      "SOAR",
      "Sistema de Avaliação e Feedback",
      "Sistema de Avaliação SOAR",
      "Compartilhe sua experiência conosco",
      "1. Grave seu feedback",
      "Clique para gravar",
      "Powered by AI • Seguro e Privado",
      "Sistema Online",
    ];

    for (const text of criticalTexts) {
      let element;
      if (text === "SOAR") {
        // Use more specific selector for SOAR to avoid multiple matches
        element = page.locator("h1:has-text('SOAR')");
      } else {
        element = page.locator(`text=${text}`);
      }
      await expect(element).toBeVisible();

      // Check that the element is not transparent or hidden
      const opacity = await element.evaluate(
        (el) => getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeGreaterThan(0);
    }
  });

  test("responsive design validation", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.locator('button[aria-label="Start recording"]')
    ).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.locator('button[aria-label="Start recording"]')
    ).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.locator('button[aria-label="Start recording"]')
    ).toBeVisible();
  });

  test("API endpoints accessibility", async ({ page }) => {
    // Test feedback API endpoint
    const feedbackResponse = await page.request.post("/api/feedback", {
      data: {
        transcription: "E2E test transcription",
        npsScore: 9,
        additionalComment: "Automated test feedback",
      },
    });

    expect(feedbackResponse.status()).toBe(200);
    const feedbackData = await feedbackResponse.json();
    expect(feedbackData).toHaveProperty("success", true);
    expect(feedbackData).toHaveProperty("id");

    // Test transcribe API endpoint (should handle empty/invalid data gracefully)
    const transcribeResponse = await page.request.post("/api/transcribe");
    expect(transcribeResponse.status()).toBeGreaterThanOrEqual(400); // Should return error for missing data
  });

  test("form layout and structure", async ({ page }) => {
    // Verify main container structure
    const mainContainer = page.locator("main");
    await expect(mainContainer).toHaveClass(/min-h-screen/);
    await expect(mainContainer).toHaveClass(/flex/);
    await expect(mainContainer).toHaveClass(/items-center/);
    await expect(mainContainer).toHaveClass(/justify-center/);

    // Verify gradient background
    await expect(mainContainer).toHaveClass(/bg-gradient-to-br/);

    // Verify form paper container
    const paperContainer = page.locator(".MuiPaper-root");
    await expect(paperContainer).toBeVisible();

    // Verify form sections are properly spaced
    const sections = page.locator(".space-y-8 > div");
    await expect(sections).toHaveCount(2); // Header and audio recording sections
  });

  test("accessibility features", async ({ page }) => {
    // Check that the microphone button has proper aria-label
    const micButton = page.locator('button[aria-label="Start recording"]');
    await expect(micButton).toBeVisible();

    // Check that headings are properly structured
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    const h3Elements = page.locator("h3");
    await expect(h3Elements).toHaveCount(2); // Should have exactly 2 h3 elements

    // Check that images have alt text
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute("alt");
      expect(altText).toBeTruthy();
    }
  });

  test("performance and loading", async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // Page should load reasonably fast (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // Critical elements should be visible quickly
    await expect(page.locator("h1")).toBeVisible({ timeout: 3000 });
    await expect(
      page.locator('button[aria-label="Start recording"]')
    ).toBeVisible({ timeout: 3000 });
  });

  test("database integration validation", async ({ page }) => {
    // Test that feedback can be submitted and stored
    const testFeedback = {
      transcription: `E2E Test Feedback - ${Date.now()}`,
      npsScore: 8,
      additionalComment: "This is an automated test submission",
    };

    const response = await page.request.post("/api/feedback", {
      data: testFeedback,
    });

    expect(response.status()).toBe(200);
    const result = await response.json();

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("message", "Feedback saved successfully");

    // Verify the ID is a number (auto-increment from database)
    expect(typeof result.id).toBe("number");
    expect(result.id).toBeGreaterThan(0);
  });
});
