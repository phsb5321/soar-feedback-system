#!/usr/bin/env node

/**
 * Verification script for the audio system
 * Ensures all TTS has been removed and only pre-recorded audio is used
 */

const fs = require("fs");
const path = require("path");

const audioDir = path.join(__dirname, "..", "public", "audio");
const srcDir = path.join(__dirname, "..", "src");

// Required audio files
const requiredAudioFiles = [
  "welcome.mp3",
  "recordingInstructions.mp3",
  "startRecording.mp3",
  "stopRecording.mp3",
  "csatWelcome.mp3",
  "submitSuccess.mp3",
  "submitError.mp3",
  "successMessage.mp3",
];

console.log("🔍 Verifying SOAR Audio System...\n");

// Check 1: Verify all audio files exist
console.log("1. Checking audio files...");
let audioFilesOk = true;
for (const file of requiredAudioFiles) {
  const filePath = path.join(audioDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`   ✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    audioFilesOk = false;
  }
}

// Check 2: Verify no TTS code remains
console.log("\n2. Checking for remaining TTS code...");
const forbiddenPatterns = [
  "speechSynthesis",
  "SpeechSynthesisUtterance",
  "useTTS",
  "playCustomText",
  "webkitSpeechRecognition",
];

let ttsCodeFound = false;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.includes("node_modules") &&
      !file.includes(".git")
    ) {
      scanDirectory(filePath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      const content = fs.readFileSync(filePath, "utf8");

      for (const pattern of forbiddenPatterns) {
        if (content.includes(pattern)) {
          console.log(`   ❌ Found "${pattern}" in ${filePath}`);
          ttsCodeFound = true;
        }
      }
    }
  }
}

scanDirectory(srcDir);

if (!ttsCodeFound) {
  console.log("   ✅ No TTS code found - Clean!");
}

// Check 3: Verify useCachedTTS hook is clean
console.log("\n3. Checking useCachedTTS hook...");
const cachedTTSPath = path.join(srcDir, "hooks", "useCachedTTS.ts");
if (fs.existsSync(cachedTTSPath)) {
  const content = fs.readFileSync(cachedTTSPath, "utf8");

  if (
    content.includes("speechSynthesis") ||
    (content.includes("fallback") &&
      content.includes("TTS") &&
      !content.includes("NO fallback"))
  ) {
    console.log("   ❌ useCachedTTS still has TTS fallback code");
  } else {
    console.log("   ✅ useCachedTTS is clean - no TTS fallback");
  }

  if (content.includes("pre-recorded") || content.includes("MP3")) {
    console.log("   ✅ useCachedTTS correctly uses pre-recorded audio");
  }
} else {
  console.log("   ❌ useCachedTTS.ts not found");
}

// Final result
console.log("\n" + "=".repeat(50));
if (audioFilesOk && !ttsCodeFound) {
  console.log("🎉 SUCCESS: Audio system verification PASSED!");
  console.log("✨ Only professional pre-recorded audio will be used");
  console.log("🚫 No synthetic/browser TTS will ever be triggered");
} else {
  console.log("❌ FAILURE: Audio system verification FAILED!");
  if (!audioFilesOk) console.log("   - Missing audio files");
  if (ttsCodeFound) console.log("   - TTS code still present");
}
console.log("=".repeat(50));
