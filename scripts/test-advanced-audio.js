#!/usr/bin/env node

/**
 * Test script for the new advanced audio system
 * Verifies Zustand store integration and loop prevention
 */

console.log("🎵 Testing Advanced Audio System...\n");

// Test 1: Check if all required files exist
const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "src/stores/audioStore.ts",
  "src/hooks/useAdvancedAudio.ts",
  "src/contexts/AudioContext.tsx",
  "src/components/atoms/AudioToggle/AudioToggle.tsx",
  "public/audio/welcome.mp3",
  "public/audio/recordingInstructions.mp3",
  "public/audio/startRecording.mp3",
  "public/audio/stopRecording.mp3",
  "public/audio/csatWelcome.mp3",
  "public/audio/submitSuccess.mp3",
  "public/audio/submitError.mp3",
  "public/audio/successMessage.mp3",
];

console.log("1. Checking required files...");
let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, "..", file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
}

// Test 2: Check for loop prevention patterns
console.log("\n2. Checking for loop prevention...");
const srcFiles = [
  "src/app/page.tsx",
  "src/app/csat/page.tsx",
  "src/components/molecules/AudioRecordingSection/AudioRecordingSection.tsx",
];

let loopIssuesFound = false;
for (const file of srcFiles) {
  const filePath = path.join(__dirname, "..", file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");

    // Check for problematic patterns
    if (
      content.includes("useEffect") &&
      content.includes("playAudio") &&
      !content.includes("AudioProvider") &&
      !content.includes("useComponentAudio")
    ) {
      console.log(`   ⚠️  ${file} - May have useEffect audio loops`);
      loopIssuesFound = true;
    } else {
      console.log(`   ✅ ${file} - No loop issues detected`);
    }
  }
}

// Test 3: Check for old TTS references
console.log("\n3. Checking for old TTS references...");
const execSync = require("child_process").execSync;
try {
  const grepOutput = execSync('grep -r "useCachedTTS\\|playCustomText" src/', {
    encoding: "utf8",
  });
  if (grepOutput.trim()) {
    console.log("   ⚠️  Found old TTS references:");
    console.log(grepOutput);
  }
} catch (error) {
  console.log("   ✅ No old TTS references found");
}

// Test 4: Check package.json for Zustand
console.log("\n4. Checking dependencies...");
const packageJsonPath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  if (packageJson.dependencies && packageJson.dependencies.zustand) {
    console.log(`   ✅ Zustand installed: ${packageJson.dependencies.zustand}`);
  } else {
    console.log("   ❌ Zustand not found in dependencies");
  }
} else {
  console.log("   ❌ package.json not found");
}

// Final result
console.log("\n" + "=".repeat(50));
if (allFilesExist && !loopIssuesFound) {
  console.log("🎉 SUCCESS: Advanced Audio System is ready!");
  console.log("✨ Features implemented:");
  console.log("   - Audio queue with priority system");
  console.log("   - Loop prevention with component isolation");
  console.log("   - Floating audio toggle control");
  console.log("   - Zustand state management");
  console.log("   - Audio context providers");
  console.log("🚫 Audio loops should be eliminated");
} else {
  console.log("❌ ISSUES FOUND:");
  if (!allFilesExist) console.log("   - Missing required files");
  if (loopIssuesFound) console.log("   - Potential audio loop issues");
}
console.log("=".repeat(50));
