#!/usr/bin/env node

/**
 * Test script to verify help button implementation and removal of auto-play audio
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Help Button Implementation and Auto-Play Removal\n");

// Test 1: Check that auto-play code has been removed
console.log("1️⃣ Checking for removal of auto-play code...");

const filesToCheck = [
  "src/app/page.tsx",
  "src/app/csat/page.tsx",
  "src/components/organisms/SimpleFeedbackForm/SimpleFeedbackForm.tsx",
  "src/components/molecules/AudioRecordingSection/AudioRecordingSection.tsx",
  "src/contexts/AudioContext.tsx",
];

let autoPlayFound = false;

filesToCheck.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");

    // Check for auto-play patterns
    const autoPlayPatterns = [
      /autoPlayAudios\s*=\s*\[.*\]/,
      /useEffect.*playPageAudio/,
      /useEffect.*playComponentAudio/,
      /playPageAudio.*delay/,
      /playComponentAudio.*useEffect/,
    ];

    autoPlayPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        console.log(`❌ Auto-play code found in ${file}`);
        autoPlayFound = true;
      }
    });
  }
});

if (!autoPlayFound) {
  console.log("✅ No auto-play code found - audio is now user-controlled");
}

// Test 2: Check that HelpButton component exists and is properly implemented
console.log("\n2️⃣ Checking HelpButton component implementation...");

const helpButtonPath = path.join(
  process.cwd(),
  "src/components/atoms/HelpButton/HelpButton.tsx"
);
if (fs.existsSync(helpButtonPath)) {
  const helpButtonContent = fs.readFileSync(helpButtonPath, "utf8");

  // Check for accessibility features
  const accessibilityFeatures = [
    /ariaLabel/,
    /aria-label/,
    /Tooltip/,
    /onKeyDown/,
    /Enter.*Space/,
    /role=/,
    /tabIndex/,
  ];

  let accessibilityScore = 0;
  accessibilityFeatures.forEach((feature) => {
    if (feature.test(helpButtonContent)) {
      accessibilityScore++;
    }
  });

  console.log(
    `✅ HelpButton component found with ${accessibilityScore}/7 accessibility features`
  );

  if (accessibilityScore >= 4) {
    console.log("✅ HelpButton has good accessibility implementation");
  } else {
    console.log("⚠️ HelpButton could use better accessibility features");
  }
} else {
  console.log("❌ HelpButton component not found");
}

// Test 3: Check that help buttons are used in components
console.log("\n3️⃣ Checking for HelpButton usage in components...");

const componentsWithHelpButtons = [
  { file: "src/app/page.tsx", expectedHelp: "welcome/info" },
  { file: "src/app/csat/page.tsx", expectedHelp: "CSAT instructions" },
  {
    file: "src/components/organisms/SimpleFeedbackForm/SimpleFeedbackForm.tsx",
    expectedHelp: "success message",
  },
  {
    file: "src/components/molecules/AudioRecordingSection/AudioRecordingSection.tsx",
    expectedHelp: "recording instructions",
  },
];

let helpButtonsFound = 0;

componentsWithHelpButtons.forEach(({ file, expectedHelp }) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");

    if (content.includes("HelpButton") && content.includes("onHelp")) {
      console.log(`✅ HelpButton found in ${file} (${expectedHelp})`);
      helpButtonsFound++;
    } else {
      console.log(`❌ HelpButton missing in ${file} (${expectedHelp})`);
    }
  }
});

console.log(
  `\n📊 Help buttons implemented: ${helpButtonsFound}/${componentsWithHelpButtons.length}`
);

// Test 4: Check that help icons exist
console.log("\n4️⃣ Checking for help icons...");

const iconFiles = ["public/help.svg", "public/info.svg"];
let iconsFound = 0;

iconFiles.forEach((iconFile) => {
  const iconPath = path.join(process.cwd(), iconFile);
  if (fs.existsSync(iconPath)) {
    console.log(`✅ Icon found: ${iconFile}`);
    iconsFound++;
  } else {
    console.log(`❌ Icon missing: ${iconFile}`);
  }
});

// Test 5: Check that AudioContext no longer has auto-play logic
console.log("\n5️⃣ Checking AudioContext for auto-play removal...");

const audioContextPath = path.join(
  process.cwd(),
  "src/contexts/AudioContext.tsx"
);
if (fs.existsSync(audioContextPath)) {
  const content = fs.readFileSync(audioContextPath, "utf8");

  if (
    !content.includes("autoPlayAudios") &&
    !content.includes("playAutoAudios")
  ) {
    console.log("✅ AudioContext no longer contains auto-play logic");
  } else {
    console.log("❌ AudioContext still contains auto-play logic");
  }
}

// Summary
console.log("\n📋 SUMMARY:");
console.log("==================");
console.log(
  `Auto-play removal: ${!autoPlayFound ? "✅ Complete" : "❌ Incomplete"}`
);
console.log(
  `HelpButton component: ${
    fs.existsSync(helpButtonPath) ? "✅ Implemented" : "❌ Missing"
  }`
);
console.log(
  `Help buttons in components: ${helpButtonsFound}/4 ${
    helpButtonsFound === 4 ? "✅" : "⚠️"
  }`
);
console.log(`Help icons: ${iconsFound}/2 ${iconsFound === 2 ? "✅" : "⚠️"}`);

const allTestsPassed =
  !autoPlayFound &&
  fs.existsSync(helpButtonPath) &&
  helpButtonsFound === 4 &&
  iconsFound === 2;

if (allTestsPassed) {
  console.log(
    "\n🎉 ALL TESTS PASSED! Auto-play removed and help buttons implemented successfully."
  );
} else {
  console.log("\n⚠️ Some tests failed. Please review the implementation.");
}

console.log("\n✨ Next steps:");
console.log("- Test help buttons manually in the browser");
console.log("- Verify accessibility with screen readers");
console.log("- Check that audio only plays when help buttons are clicked");
console.log("- Test keyboard navigation for help buttons");
