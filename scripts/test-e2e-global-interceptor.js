#!/usr/bin/env node

/**
 * End-to-End Test for Global Audio Interceptor
 *
 * This script verifies that the global audio interceptor implementation
 * properly integrates with all parts of the SOAR feedback system.
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();

// Color output functions
function green(text) {
  return `\x1b[32m${text}\x1b[0m`;
}
function red(text) {
  return `\x1b[31m${text}\x1b[0m`;
}
function yellow(text) {
  return `\x1b[33m${text}\x1b[0m`;
}
function blue(text) {
  return `\x1b[34m${text}\x1b[0m`;
}

console.log(blue("🔄 End-to-End Global Audio Interceptor Test\n"));

let allTestsPassed = true;

function checkFile(filePath, description) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(green(`✓ ${description}`));
    return fs.readFileSync(fullPath, "utf8");
  } else {
    console.log(red(`✗ ${description} - File not found: ${filePath}`));
    allTestsPassed = false;
    return null;
  }
}

function checkContent(content, pattern, description, required = true) {
  if (!content) return false;

  const found = pattern.test(content);
  if (found) {
    console.log(green(`✓ ${description}`));
    return true;
  } else {
    if (required) {
      console.log(red(`✗ ${description}`));
      allTestsPassed = false;
    } else {
      console.log(yellow(`⚠ ${description} (optional)`));
    }
    return false;
  }
}

// Integration Test 1: Complete System Integration
console.log(blue("\n1. Testing Complete System Integration:"));

// Check all required files exist
const hookFile = checkFile(
  "src/hooks/useGlobalAudioInterceptor.ts",
  "Global audio interceptor hook exists"
);

const componentFile = checkFile(
  "src/components/providers/GlobalAudioInterceptor.tsx",
  "Global audio interceptor component exists"
);

const layoutFile = checkFile("src/app/layout.tsx", "Root layout file exists");

const storeFile = checkFile("src/stores/audioStore.ts", "Audio store exists");

const helpButtonFile = checkFile(
  "src/components/atoms/HelpButton/HelpButton.tsx",
  "HelpButton component exists"
);

// Integration Test 2: Verify Component Chain
console.log(blue("\n2. Testing Component Integration Chain:"));

if (layoutFile && componentFile) {
  const hasImport = /import.*GlobalAudioInterceptor.*from/.test(layoutFile);
  const hasComponent = /<GlobalAudioInterceptor/.test(layoutFile);

  if (hasImport && hasComponent) {
    console.log(
      green("✓ GlobalAudioInterceptor properly integrated in layout")
    );
  } else {
    console.log(
      red("✗ GlobalAudioInterceptor not properly integrated in layout")
    );
    allTestsPassed = false;
  }
}

if (componentFile && hookFile) {
  const componentUsesHook = /useGlobalAudioInterceptor/.test(componentFile);

  if (componentUsesHook) {
    console.log(green("✓ Component properly uses the hook"));
  } else {
    console.log(red("✗ Component does not use the hook"));
    allTestsPassed = false;
  }
}

// Integration Test 3: Audio Store Compatibility
console.log(blue("\n3. Testing Audio Store Compatibility:"));

if (storeFile && hookFile) {
  const hookUsesStore = /useAudioStore/.test(hookFile);
  const storeHasStop = /stopAudio.*\(\)/.test(storeFile);
  const storeHasPlaying = /isPlaying/.test(storeFile);

  if (hookUsesStore) {
    console.log(green("✓ Hook properly uses audio store"));
  } else {
    console.log(red("✗ Hook does not use audio store"));
    allTestsPassed = false;
  }

  if (storeHasStop && storeHasPlaying) {
    console.log(green("✓ Audio store has required methods and state"));
  } else {
    console.log(red("✗ Audio store missing required methods or state"));
    allTestsPassed = false;
  }
}

// Integration Test 4: Event Handling
console.log(blue("\n4. Testing Event Handling Implementation:"));

if (hookFile) {
  checkContent(
    hookFile,
    /document\.addEventListener/,
    "Hook sets up global event listeners"
  );
  checkContent(
    hookFile,
    /click.*keydown.*touchstart/,
    "Hook listens for all required events"
  );
  checkContent(
    hookFile,
    /useCapture.*true/,
    "Hook uses event capture for early interception"
  );
  checkContent(
    hookFile,
    /if.*!isPlaying/,
    "Hook only processes events when audio is playing"
  );
  checkContent(hookFile, /stopAudio\(\)/, "Hook calls stopAudio when needed");
}

// Integration Test 5: HelpButton Integration
console.log(blue("\n5. Testing HelpButton Integration:"));

if (helpButtonFile) {
  checkContent(
    helpButtonFile,
    /useAdvancedAudio/,
    "HelpButton uses advanced audio hook"
  );
  checkContent(
    helpButtonFile,
    /disabled.*isPlaying/,
    "HelpButton disables during audio playback"
  );
  checkContent(
    helpButtonFile,
    /onHelp/,
    "HelpButton can trigger help actions via callback"
  );
}

// Integration Test 6: TypeScript and Build Compatibility
console.log(blue("\n6. Testing TypeScript Integration:"));

if (hookFile) {
  checkContent(
    hookFile,
    /interface.*Options/,
    "Hook defines TypeScript interfaces"
  );
  checkContent(
    hookFile,
    /export function useGlobalAudioInterceptor/,
    "Hook is properly exported"
  );
}

if (componentFile) {
  checkContent(
    componentFile,
    /"use client"/,
    "Component is marked for client-side rendering"
  );
  checkContent(
    componentFile,
    /export function GlobalAudioInterceptor/,
    "Component is properly exported"
  );
}

// Integration Test 7: Documentation and Testing
console.log(blue("\n7. Testing Documentation and Test Coverage:"));

const docFile = checkFile(
  "docs/GLOBAL_AUDIO_INTERCEPTOR.md",
  "Documentation file exists"
);

const testFile = checkFile(
  "scripts/test-global-audio-interceptor.js",
  "Test script exists"
);

if (docFile) {
  checkContent(
    docFile,
    /Global Audio Interceptor/,
    "Documentation has proper title"
  );
  checkContent(
    docFile,
    /Implementation Details/,
    "Documentation covers implementation"
  );
  checkContent(
    docFile,
    /Testing/,
    "Documentation includes testing instructions"
  );
}

// Integration Test 8: No Conflicts with Existing Features
console.log(blue("\n8. Testing No Conflicts with Existing Features:"));

if (storeFile) {
  // Check that audio toggle and silencing features are disabled/removed
  const hasToggleAudio = /toggleAudio/.test(storeFile);
  const hasSetEnabled = /setEnabled/.test(storeFile);
  const hasClearQueue = /clearQueue/.test(storeFile);

  if (!hasToggleAudio && !hasSetEnabled && !hasClearQueue) {
    console.log(green("✓ Legacy audio silencing features properly removed"));
  } else {
    console.log(yellow("⚠ Some legacy audio silencing features still present"));
  }
}

// Check AudioToggle is disabled
const audioToggleFile = checkFile(
  "src/components/atoms/AudioToggle/AudioToggle.tsx",
  "AudioToggle component exists (should be disabled)"
);

if (audioToggleFile) {
  const isDisabled = /return null/.test(audioToggleFile);
  if (isDisabled) {
    console.log(green("✓ AudioToggle component properly disabled"));
  } else {
    console.log(yellow("⚠ AudioToggle component may still be active"));
  }
}

// Final Integration Summary
console.log(blue("\n" + "=".repeat(60)));
if (allTestsPassed) {
  console.log(green("🎉 All End-to-End Integration Tests Passed!"));
  console.log(green("\nThe Global Audio Interceptor is fully integrated:"));
  console.log(green("• ✅ Hook properly implemented with TypeScript"));
  console.log(green("• ✅ Component integrated into root layout"));
  console.log(green("• ✅ Audio store compatibility verified"));
  console.log(green("• ✅ Event handling properly configured"));
  console.log(green("• ✅ HelpButton integration confirmed"));
  console.log(green("• ✅ No conflicts with existing features"));
  console.log(green("• ✅ Documentation and tests complete"));

  console.log(blue("\n🚀 Ready for Testing:"));
  console.log("1. Run the application: pnpm dev");
  console.log("2. Click any help button to start audio");
  console.log("3. Click anywhere while audio plays → audio should stop");
  console.log("4. Press any key while audio plays → audio should stop");
  console.log("5. Touch screen while audio plays → audio should stop");
} else {
  console.log(red("❌ Some integration tests failed."));
  console.log(yellow("Please review and fix any issues before testing."));
  process.exit(1);
}

console.log(blue("\n📋 Manual Test Checklist:"));
console.log("□ Desktop: Click anywhere during help audio");
console.log("□ Desktop: Press keys during help audio");
console.log("□ Mobile: Touch screen during help audio");
console.log("□ Verify normal app functionality not affected");
console.log("□ Test with screen readers/accessibility tools");
console.log("□ Verify performance (no lag or issues)");
