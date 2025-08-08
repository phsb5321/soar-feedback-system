#!/usr/bin/env tsx

/**
 * Contrast Verification Test Script
 *
 * This script verifies that all text colors in the SOAR Feedback System
 * meet WCAG AA accessibility standards for contrast ratios.
 *
 * WCAG AA Requirements:
 * - Normal text: 4.5:1 contrast ratio
 * - Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio
 */

interface ColorTest {
  name: string;
  foreground: string;
  background: string;
  expectedRatio: number;
  context: string;
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Test cases based on our color system
const colorTests: ColorTest[] = [
  // Primary text colors
  {
    name: "Primary Text",
    foreground: "#111827", // gray-900 (updated)
    background: "#ffffff", // white
    expectedRatio: 4.5,
    context: "Main headings and primary content",
  },
  {
    name: "Secondary Text",
    foreground: "#374151", // gray-700 (updated)
    background: "#ffffff", // white
    expectedRatio: 4.5,
    context: "Secondary content and descriptions",
  },
  {
    name: "Muted Text",
    foreground: "#4b5563", // gray-600 (updated)
    background: "#ffffff", // white
    expectedRatio: 4.5,
    context: "Captions and less important text",
  },

  // Semantic colors
  {
    name: "Success Text",
    foreground: "#15803d", // green-700 (updated)
    background: "#ffffff", // white
    expectedRatio: 4.5,
    context: "Success messages and confirmations",
  },
  {
    name: "Error Text",
    foreground: "#b91c1c", // red-700 (updated)
    background: "#ffffff", // white
    expectedRatio: 4.5,
    context: "Error messages and warnings",
  },
  {
    name: "Info Text",
    foreground: "#1d4ed8", // blue-700 (updated)
    background: "#ffffff", // white
    expectedRatio: 4.5,
    context: "Informational text and links",
  },

  // Text on colored backgrounds
  {
    name: "White on Primary Blue",
    foreground: "#ffffff", // white
    background: "#2563eb", // blue-600
    expectedRatio: 4.5,
    context: "Primary button text",
  },
  {
    name: "White on Success Green",
    foreground: "#ffffff", // white
    background: "#15803d", // green-700
    expectedRatio: 4.5,
    context: "Success button text",
  },

  // Light backgrounds
  {
    name: "Dark Text on Light Gray",
    foreground: "#111827", // gray-900
    background: "#f9fafb", // gray-50
    expectedRatio: 4.5,
    context: "Text on light gray backgrounds",
  },
  {
    name: "Secondary Text on Blue Tint",
    foreground: "#374151", // gray-700
    background: "#eff6ff", // blue-50
    expectedRatio: 4.5,
    context: "Text on tinted backgrounds",
  },
];

function runContrastTests(): void {
  console.log("🎨 SOAR Feedback System - Contrast Verification Test");
  console.log("=".repeat(60));
  console.log();

  let passedTests = 0;
  let totalTests = colorTests.length;

  colorTests.forEach((test, index) => {
    const ratio = getContrastRatio(test.foreground, test.background);
    const passed = ratio >= test.expectedRatio;

    console.log(`${index + 1}. ${test.name}`);
    console.log(`   Foreground: ${test.foreground}`);
    console.log(`   Background: ${test.background}`);
    console.log(`   Contrast Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`   Required: ${test.expectedRatio}:1`);
    console.log(`   Result: ${passed ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`   Context: ${test.context}`);

    if (passed) {
      passedTests++;
    } else {
      console.log(
        `   🔧 Recommendation: Adjust colors to meet WCAG AA standards`,
      );
    }

    console.log();
  });

  // Summary
  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(
    `   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`,
  );

  if (passedTests === totalTests) {
    console.log("🎉 All contrast tests passed! Your text is accessible.");
    console.log("✅ WCAG AA compliance achieved for all tested combinations.");
  } else {
    console.log(
      "⚠️  Some contrast tests failed. Review the recommendations above.",
    );
    console.log("📚 Learn more: https://webaim.org/resources/contrastchecker/");
  }

  console.log();
  console.log("🔍 Additional Accessibility Tips:");
  console.log("• Test with actual users who have visual impairments");
  console.log("• Use browser dev tools to simulate color blindness");
  console.log("• Consider WCAG AAA (7:1 ratio) for critical content");
  console.log("• Ensure focus indicators have adequate contrast");
  console.log("• Test in different lighting conditions");

  // Exit with appropriate code
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Color palette reference for developers
function showColorPalette(): void {
  console.log("🎨 SOAR Color Palette Reference");
  console.log("=".repeat(40));
  console.log();

  const palette = {
    "Primary Text": "#111827", // gray-900
    "Secondary Text": "#374151", // gray-700
    "Muted Text": "#4b5563", // gray-600
    Success: "#15803d", // green-700
    Error: "#b91c1c", // red-700
    Info: "#1d4ed8", // blue-700
    "Primary Blue": "#2563eb", // blue-600
    "Success Green": "#15803d", // green-700
    "Light Background": "#f9fafb", // gray-50
    White: "#ffffff",
  };

  Object.entries(palette).forEach(([name, color]) => {
    console.log(`${name.padEnd(18)}: ${color}`);
  });

  console.log();
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("--palette") || args.includes("-p")) {
    showColorPalette();
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log("SOAR Contrast Verification Tool");
    console.log();
    console.log("Usage:");
    console.log("  tsx scripts/test-contrast.ts           Run contrast tests");
    console.log("  tsx scripts/test-contrast.ts --palette Show color palette");
    console.log("  tsx scripts/test-contrast.ts --help    Show this help");
    console.log();
    console.log("This tool verifies WCAG AA compliance (4.5:1 contrast ratio)");
    return;
  }

  runContrastTests();
}

// Handle script execution
if (require.main === module) {
  main();
}

export { getContrastRatio, runContrastTests, showColorPalette };
