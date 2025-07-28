#!/usr/bin/env node

/**
 * Test script to verify the global audio interceptor functionality
 *
 * This script checks:
 * 1. GlobalAudioInterceptor component exists and is properly structured
 * 2. useGlobalAudioInterceptor hook exists with correct interface
 * 3. GlobalAudioInterceptor is properly integrated into the root layout
 * 4. The hook listens for the correct events (click, keydown, touchstart)
 * 5. Audio stopping logic is implemented correctly
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

console.log(blue("🎯 Testing Global Audio Interceptor Implementation\n"));

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

// Test 1: Check if useGlobalAudioInterceptor hook exists
console.log(blue("\n1. Testing useGlobalAudioInterceptor Hook:"));
const hookContent = checkFile(
  "src/hooks/useGlobalAudioInterceptor.ts",
  "useGlobalAudioInterceptor hook file exists"
);

if (hookContent) {
  checkContent(
    hookContent,
    /export function useGlobalAudioInterceptor/,
    "Hook function is properly exported"
  );

  checkContent(
    hookContent,
    /events.*=.*\["click", "keydown", "touchstart"\]/,
    "Default events include click, keydown, and touchstart"
  );

  checkContent(hookContent, /useAudioStore/, "Hook uses the audio store");

  checkContent(
    hookContent,
    /stopAudio\(\)/,
    "Hook calls stopAudio when needed"
  );

  checkContent(
    hookContent,
    /document\.addEventListener/,
    "Hook adds document event listeners"
  );

  checkContent(
    hookContent,
    /document\.removeEventListener/,
    "Hook removes event listeners on cleanup"
  );

  checkContent(
    hookContent,
    /isPlaying/,
    "Hook checks if audio is playing before stopping"
  );
}

// Test 2: Check if GlobalAudioInterceptor component exists
console.log(blue("\n2. Testing GlobalAudioInterceptor Component:"));
const componentContent = checkFile(
  "src/components/providers/GlobalAudioInterceptor.tsx",
  "GlobalAudioInterceptor component file exists"
);

if (componentContent) {
  checkContent(
    componentContent,
    /export function GlobalAudioInterceptor/,
    "Component function is properly exported"
  );

  checkContent(
    componentContent,
    /useGlobalAudioInterceptor/,
    "Component uses the useGlobalAudioInterceptor hook"
  );

  checkContent(
    componentContent,
    /return null/,
    "Component returns null (invisible provider)"
  );

  checkContent(
    componentContent,
    /"use client"/,
    "Component is marked as client component"
  );
}

// Test 3: Check if GlobalAudioInterceptor is integrated into layout
console.log(blue("\n3. Testing Root Layout Integration:"));
const layoutContent = checkFile(
  "src/app/layout.tsx",
  "Root layout file exists"
);

if (layoutContent) {
  checkContent(
    layoutContent,
    /import.*GlobalAudioInterceptor.*from/,
    "GlobalAudioInterceptor is imported in layout"
  );

  checkContent(
    layoutContent,
    /<GlobalAudioInterceptor\s*\/>/,
    "GlobalAudioInterceptor is rendered in layout"
  );

  // Check that it's placed before children for proper event capture
  const componentBeforeChildren =
    /<GlobalAudioInterceptor[^>]*\/>\s*{children}/.test(layoutContent);
  if (componentBeforeChildren) {
    console.log(
      green(
        "✓ GlobalAudioInterceptor is placed before children for proper event capture"
      )
    );
  } else {
    console.log(
      yellow(
        "⚠ GlobalAudioInterceptor placement could be optimized (should be before children)"
      )
    );
  }
}

// Test 4: Check audio store has the necessary methods
console.log(blue("\n4. Testing Audio Store Compatibility:"));
const storeContent = checkFile(
  "src/stores/audioStore.ts",
  "Audio store file exists"
);

if (storeContent) {
  checkContent(
    storeContent,
    /stopAudio.*\(\)/,
    "Audio store has stopAudio method"
  );

  checkContent(
    storeContent,
    /isPlaying.*:/,
    "Audio store tracks isPlaying state"
  );

  checkContent(
    storeContent,
    /currentAudio.*pause\(\)/,
    "stopAudio method properly pauses current audio"
  );
}

// Test 5: Check for potential conflicts or edge cases
console.log(blue("\n5. Testing Implementation Quality:"));

if (hookContent) {
  checkContent(
    hookContent,
    /useCapture.*=.*true/,
    "Uses capture phase for early event interception"
  );

  checkContent(
    hookContent,
    /preventDefault.*=.*false/,
    "Does not prevent default behavior by default"
  );

  checkContent(hookContent, /clearTimeout/, "Properly cleans up timeouts");

  checkContent(hookContent, /console\.log/, "Provides helpful debugging logs");
}

// Test 6: Check TypeScript types and interfaces
console.log(blue("\n6. Testing TypeScript Integration:"));

if (hookContent) {
  checkContent(
    hookContent,
    /interface.*Options/,
    "Defines proper TypeScript interfaces"
  );

  checkContent(
    hookContent,
    /useEffect/,
    "Uses useEffect with proper dependencies"
  );
}

// Final summary
console.log(blue("\n" + "=".repeat(60)));
if (allTestsPassed) {
  console.log(green("🎉 All Global Audio Interceptor tests passed!"));
  console.log(green("\nThe implementation should now:"));
  console.log(green("• Stop any playing audio when user clicks anywhere"));
  console.log(green("• Stop audio on keyboard interactions (accessibility)"));
  console.log(green("• Stop audio on touch interactions (mobile support)"));
  console.log(green("• Not interfere with normal application behavior"));
  console.log(green("• Only activate when audio is actually playing"));
  console.log(green("• Work across the entire application globally"));
} else {
  console.log(red("❌ Some global audio interceptor tests failed."));
  console.log(yellow("Please review the implementation and fix any issues."));
  process.exit(1);
}

console.log(blue("\n📝 Next steps:"));
console.log("1. Build the application: pnpm build");
console.log("2. Test in browser: click while help audio is playing");
console.log("3. Test keyboard interactions while audio plays");
console.log("4. Test on mobile/touch devices");
console.log("5. Verify audio stops immediately on any interaction");
