#!/usr/bin/env tsx

/**
 * Enhanced Contrast Verification Test Script
 *
 * This script verifies that all text colors in the SOAR Feedback System
 * meet WCAG AA accessibility standards for contrast ratios using our
 * new contrast management utilities.
 *
 * WCAG AA Requirements:
 * - Normal text: 4.5:1 contrast ratio
 * - Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio
 */

import {
  getContrastRatio,
  meetsContrastStandard,
  getBestTextColor,
  COLOR_PALETTE,
  ContrastManager,
  generateContrastPalette,
  validateAccessibility,
  getSmartBackground,
  CONTRAST_STANDARDS,
} from "../src/lib/contrast";

interface ColorTest {
  name: string;
  foreground: string;
  background: string;
  expectedRatio: number;
  context: string;
  textSize?: "normal" | "large";
}

interface ComponentTest {
  name: string;
  component: string;
  scenarios: ColorTest[];
}

/**
 * Test cases based on our actual components and use cases
 */
const componentTests: ComponentTest[] = [
  {
    name: "Text Component",
    component: "src/components/atoms/Text/Text.tsx",
    scenarios: [
      {
        name: "Primary Text on White",
        foreground: COLOR_PALETTE.gray[900],
        background: COLOR_PALETTE.white,
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Main headings and primary content",
      },
      {
        name: "Secondary Text on White",
        foreground: COLOR_PALETTE.gray[700],
        background: COLOR_PALETTE.white,
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Secondary content and descriptions",
      },
      {
        name: "Muted Text on White",
        foreground: COLOR_PALETTE.gray[600],
        background: COLOR_PALETTE.white,
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Captions and less important text",
      },
    ],
  },
  {
    name: "SimpleFeedbackForm",
    component:
      "src/components/organisms/SimpleFeedbackForm/SimpleFeedbackForm.tsx",
    scenarios: [
      {
        name: "Form Title",
        foreground: COLOR_PALETTE.gray[900],
        background: COLOR_PALETTE.white,
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Form header text",
      },
      {
        name: "Success Message",
        foreground: COLOR_PALETTE.success[700],
        background: COLOR_PALETTE.success[50],
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Success state text",
      },
    ],
  },
  {
    name: "Smart Backgrounds",
    component: "src/components/providers/ContrastProvider.tsx",
    scenarios: [
      {
        name: "Neutral Background",
        foreground: getBestTextColor(COLOR_PALETTE.white),
        background: COLOR_PALETTE.white,
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Default neutral background",
      },
      {
        name: "Success Background",
        foreground: getBestTextColor(COLOR_PALETTE.success[50]),
        background: COLOR_PALETTE.success[50],
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Success message background",
      },
      {
        name: "Error Background",
        foreground: getBestTextColor(COLOR_PALETTE.error[50]),
        background: COLOR_PALETTE.error[50],
        expectedRatio: CONTRAST_STANDARDS.AA_NORMAL,
        context: "Error message background",
      },
    ],
  },
];

/**
 * Test smart background generation
 */
function testSmartBackgrounds(): void {
  console.log("🎨 Testing Smart Background Generation");
  console.log("=".repeat(50));
  console.log();

  const contentTypes = [
    "neutral",
    "success",
    "error",
    "warning",
    "info",
    "primary",
  ] as const;
  const intensities = ["subtle", "medium", "strong"] as const;

  let passedTests = 0;
  let totalTests = 0;

  contentTypes.forEach((contentType) => {
    intensities.forEach((intensity) => {
      totalTests++;
      const bg = getSmartBackground(contentType, intensity);
      const ratio = getContrastRatio(bg.textColor, bg.backgroundColor);
      const passed = ratio >= CONTRAST_STANDARDS.AA_NORMAL;

      console.log(`${contentType}-${intensity}:`);
      console.log(`  Background: ${bg.backgroundColor}`);
      console.log(`  Text: ${bg.textColor}`);
      console.log(`  Contrast: ${ratio.toFixed(2)}:1`);
      console.log(`  Result: ${passed ? "✅ PASS" : "❌ FAIL"}`);

      if (passed) passedTests++;
      console.log();
    });
  });

  console.log(`Smart Backgrounds: ${passedTests}/${totalTests} passed`);
  console.log();
}

/**
 * Test contrast manager functionality
 */
function testContrastManager(): void {
  console.log("🔧 Testing Contrast Manager");
  console.log("=".repeat(50));
  console.log();

  const lightManager = new ContrastManager(false);
  const darkManager = new ContrastManager(true);

  console.log("Light Theme Colors:");
  const lightColors = lightManager.createThemeColors();
  Object.entries(lightColors).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  console.log("\nDark Theme Colors:");
  const darkColors = darkManager.createThemeColors();
  Object.entries(darkColors).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Test contrast ratios for both themes
  console.log("\nTheme Contrast Validation:");
  const lightValidation = validateAccessibility({
    textPrimary: lightColors.foreground,
    textSecondary: lightColors.secondary,
    textMuted: lightColors.muted,
    background: lightColors.background,
  });

  const darkValidation = validateAccessibility({
    textPrimary: darkColors.foreground,
    textSecondary: darkColors.secondary,
    textMuted: darkColors.muted,
    background: darkColors.background,
  });

  console.log(`Light Theme: ${lightValidation.valid ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Dark Theme: ${darkValidation.valid ? "✅ PASS" : "❌ FAIL"}`);

  if (!lightValidation.valid) {
    console.log("Light Theme Issues:");
    lightValidation.issues.forEach((issue) => {
      console.log(
        `  - ${issue.combination}: ${issue.ratio.toFixed(2)}:1 (needs ${issue.required}:1)`,
      );
    });
  }

  if (!darkValidation.valid) {
    console.log("Dark Theme Issues:");
    darkValidation.issues.forEach((issue) => {
      console.log(
        `  - ${issue.combination}: ${issue.ratio.toFixed(2)}:1 (needs ${issue.required}:1)`,
      );
    });
  }

  console.log();
}

/**
 * Run comprehensive contrast tests
 */
function runContrastTests(): void {
  console.log("🎨 SOAR Feedback System - Enhanced Contrast Verification");
  console.log("=".repeat(70));
  console.log();

  let totalPassed = 0;
  let totalTests = 0;

  componentTests.forEach((componentTest, componentIndex) => {
    console.log(`${componentIndex + 1}. ${componentTest.name}`);
    console.log(`   Component: ${componentTest.component}`);
    console.log("-".repeat(50));

    let componentPassed = 0;

    componentTest.scenarios.forEach((test, testIndex) => {
      totalTests++;
      const ratio = getContrastRatio(test.foreground, test.background);
      const passed = meetsContrastStandard(
        test.foreground,
        test.background,
        "AA",
        test.textSize || "normal",
      );

      console.log(`   ${testIndex + 1}. ${test.name}`);
      console.log(`      Foreground: ${test.foreground}`);
      console.log(`      Background: ${test.background}`);
      console.log(`      Contrast Ratio: ${ratio.toFixed(2)}:1`);
      console.log(`      Required: ${test.expectedRatio}:1`);
      console.log(`      Result: ${passed ? "✅ PASS" : "❌ FAIL"}`);
      console.log(`      Context: ${test.context}`);

      if (passed) {
        componentPassed++;
        totalPassed++;
      } else {
        const recommendation = getBestTextColor(
          test.background,
          "AA",
          test.textSize || "normal",
        );
        console.log(`      🔧 Recommended text color: ${recommendation}`);
      }

      console.log();
    });

    console.log(
      `   Component Summary: ${componentPassed}/${componentTest.scenarios.length} tests passed`,
    );
    console.log();
  });

  // Test smart backgrounds
  testSmartBackgrounds();

  // Test contrast manager
  testContrastManager();

  // Final summary
  console.log("=".repeat(70));
  console.log("📊 FINAL SUMMARY");
  console.log(`   Component Tests Passed: ${totalPassed}/${totalTests}`);
  console.log(
    `   Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`,
  );

  if (totalPassed === totalTests) {
    console.log("🎉 All contrast tests passed! Your interface is accessible.");
    console.log("✅ WCAG AA compliance achieved for all tested combinations.");
  } else {
    console.log(
      "⚠️  Some contrast tests failed. Review the recommendations above.",
    );
    console.log("📚 Learn more: https://webaim.org/resources/contrastchecker/");
  }

  console.log();
  console.log("🔍 Accessibility Best Practices:");
  console.log("• Use our ContrastProvider for consistent color management");
  console.log("• Test with actual users who have visual impairments");
  console.log("• Use browser dev tools to simulate color blindness");
  console.log("• Consider WCAG AAA (7:1 ratio) for critical content");
  console.log("• Ensure focus indicators have adequate contrast");
  console.log("• Test in different lighting conditions");

  // Exit with appropriate code
  process.exit(totalPassed === totalTests ? 0 : 1);
}

/**
 * Show our enhanced color palette
 */
function showColorPalette(): void {
  console.log("🎨 SOAR Enhanced Color Palette");
  console.log("=".repeat(50));
  console.log();

  console.log("Base Colors:");
  console.log(`  White: ${COLOR_PALETTE.white}`);
  console.log(`  Black: ${COLOR_PALETTE.black}`);
  console.log();

  console.log("Gray Scale:");
  Object.entries(COLOR_PALETTE.gray).forEach(([shade, color]) => {
    console.log(`  Gray ${shade}: ${color}`);
  });
  console.log();

  console.log("Primary Colors:");
  Object.entries(COLOR_PALETTE.primary).forEach(([shade, color]) => {
    console.log(`  Primary ${shade}: ${color}`);
  });
  console.log();

  console.log("Semantic Colors:");
  ["success", "error", "warning", "info"].forEach((semantic) => {
    console.log(`  ${semantic.charAt(0).toUpperCase() + semantic.slice(1)}:`);
    Object.entries(
      COLOR_PALETTE[semantic as keyof typeof COLOR_PALETTE],
    ).forEach(([shade, color]) => {
      if (typeof color === "string") {
        console.log(`    ${shade}: ${color}`);
      }
    });
    console.log();
  });

  // Show contrast-safe combinations
  console.log("✅ Recommended Text/Background Combinations:");
  console.log(
    `  Dark text on white: ${COLOR_PALETTE.gray[900]} / ${COLOR_PALETTE.white}`,
  );
  console.log(
    `  White text on dark: ${COLOR_PALETTE.white} / ${COLOR_PALETTE.gray[900]}`,
  );
  console.log(
    `  Success text: ${COLOR_PALETTE.success[700]} / ${COLOR_PALETTE.white}`,
  );
  console.log(
    `  Error text: ${COLOR_PALETTE.error[700]} / ${COLOR_PALETTE.white}`,
  );
  console.log(
    `  Info text: ${COLOR_PALETTE.primary[700]} / ${COLOR_PALETTE.white}`,
  );
  console.log();
}

/**
 * Interactive contrast checker
 */
function interactiveChecker(): void {
  console.log("🔍 Interactive Contrast Checker");
  console.log("=".repeat(40));
  console.log();
  console.log("Example usage:");
  console.log();

  const examples = [
    { fg: "#111827", bg: "#ffffff", name: "Primary text on white" },
    { fg: "#ffffff", bg: "#2563eb", name: "White text on primary blue" },
    { fg: "#15803d", bg: "#f0fdf4", name: "Success text on success bg" },
    { fg: "#dc2626", bg: "#fef2f2", name: "Error text on error bg" },
  ];

  examples.forEach((example) => {
    const ratio = getContrastRatio(example.fg, example.bg);
    const passes = meetsContrastStandard(
      example.fg,
      example.bg,
      "AA",
      "normal",
    );
    console.log(`${example.name}:`);
    console.log(`  Colors: ${example.fg} on ${example.bg}`);
    console.log(`  Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`  WCAG AA: ${passes ? "✅ PASS" : "❌ FAIL"}`);
    console.log();
  });
}

/**
 * Main execution function
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("--palette") || args.includes("-p")) {
    showColorPalette();
    return;
  }

  if (args.includes("--interactive") || args.includes("-i")) {
    interactiveChecker();
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log("SOAR Enhanced Contrast Verification Tool");
    console.log();
    console.log("Usage:");
    console.log(
      "  tsx scripts/test-contrast.ts              Run all contrast tests",
    );
    console.log(
      "  tsx scripts/test-contrast.ts --palette    Show color palette",
    );
    console.log(
      "  tsx scripts/test-contrast.ts --interactive Interactive checker",
    );
    console.log("  tsx scripts/test-contrast.ts --help       Show this help");
    console.log();
    console.log("Features:");
    console.log("• WCAG AA/AAA compliance testing");
    console.log("• Smart background validation");
    console.log("• Contrast manager testing");
    console.log("• Component-specific scenarios");
    console.log("• Enhanced color palette");
    return;
  }

  runContrastTests();
}

// Handle script execution
if (require.main === module) {
  main();
}

export {
  runContrastTests,
  showColorPalette,
  testSmartBackgrounds,
  testContrastManager,
  componentTests,
};
