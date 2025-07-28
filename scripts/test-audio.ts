#!/usr/bin/env tsx
/**
 * Test script to verify all premium audio files are accessible
 */

import { existsSync, statSync } from "fs";
import { join } from "path";
import { getAllAudioMessages } from "../src/lib/i18n-audio";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

async function testAudioFiles() {
  console.log(
    `${BLUE}🧪 Testing premium Brazilian Portuguese audio files${RESET}\n`
  );

  const audioMessages = getAllAudioMessages();
  const audioDir = join(process.cwd(), "public", "audio");

  let totalFiles = 0;
  let successCount = 0;

  for (const [key, config] of Object.entries(audioMessages)) {
    totalFiles++;
    const filePath = join(audioDir, `${key}.mp3`);

    if (existsSync(filePath)) {
      const stats = statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(
        `${GREEN}✅ ${key}.mp3${RESET} - ${sizeKB}KB (${config.voice}, speed: ${config.speed})`
      );
      console.log(`   Text: "${config.text.substring(0, 60)}..."`);
      console.log(`   Category: ${config.category} | ${config.description}\n`);
      successCount++;
    } else {
      console.log(`${RED}❌ ${key}.mp3 - FILE NOT FOUND${RESET}\n`);
    }
  }

  console.log(`${BLUE}📊 Test Results:${RESET}`);
  console.log(`   Total files expected: ${totalFiles}`);
  console.log(`   Files found: ${successCount}`);
  console.log(
    `   Success rate: ${Math.round((successCount / totalFiles) * 100)}%`
  );

  if (successCount === totalFiles) {
    console.log(`${GREEN}🎉 All premium audio files are ready!${RESET}`);
    process.exit(0);
  } else {
    console.log(
      `${RED}⚠️  Some audio files are missing. Run 'npm run audio:generate' to regenerate.${RESET}`
    );
    process.exit(1);
  }
}

testAudioFiles();
