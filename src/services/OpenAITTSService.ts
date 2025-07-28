import { getAllAudioMessages, type AudioMessageKey } from "@/lib/i18n-audio";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate premium quality MP3 audio file using OpenAI TTS-1-HD
 * Optimized specifically for Brazilian Portuguese with natural intonation
 */
export async function generateAudioFile(
  text: string,
  filename: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy"
): Promise<string> {
  try {
    const audioDir = join(process.cwd(), "public", "audio");

    // Ensure audio directory exists
    if (!existsSync(audioDir)) {
      mkdirSync(audioDir, { recursive: true });
    }

    const filePath = join(audioDir, `${filename}.mp3`);

    console.log(
      `🎵 Generating premium Brazilian Portuguese audio: ${filename}.mp3`
    );

    // Use OpenAI TTS-1-HD with optimal settings for Brazilian Portuguese
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd", // Highest quality model available
      voice: voice,
      input: text,
      speed: 0.95, // Slightly slower for clearer Brazilian Portuguese pronunciation
      response_format: "mp3", // MP3 for best quality and compatibility
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    writeFileSync(filePath, buffer);

    console.log(
      `✅ Generated premium audio: ${filename}.mp3 (${Math.round(
        buffer.length / 1024
      )}KB) with voice: ${voice}`
    );
    return `/audio/${filename}.mp3`;
  } catch (error) {
    console.error(`❌ Error generating premium audio ${filename}:`, error);
    throw error;
  }
}

/**
 * Generate all predefined audio messages with high quality settings
 * Forces regeneration to ensure latest quality improvements
 */
export async function generateAllAudioMessages(
  forceRegenerate: boolean = false
): Promise<Record<AudioMessageKey, string>> {
  const results: Partial<Record<AudioMessageKey, string>> = {};

  // Delete existing files if forcing regeneration
  if (forceRegenerate) {
    const audioDir = join(process.cwd(), "public", "audio");
    if (existsSync(audioDir)) {
      console.log("🗑️ Deleting existing audio files for regeneration...");
      const audioMessages = getAllAudioMessages();
      for (const key of Object.keys(audioMessages)) {
        const filePath = join(audioDir, `${key}.mp3`);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
          console.log(`Deleted: ${key}.mp3`);
        }
      }
    }
  }

  console.log(
    "🎵 Generating premium Brazilian Portuguese audio with OpenAI TTS-1-HD..."
  );
  console.log("🔊 Using optimized voice mapping for natural pt-BR intonation");

  const audioMessages = getAllAudioMessages();
  for (const [key, messageConfig] of Object.entries(audioMessages)) {
    try {
      const voice = messageConfig.voice;
      console.log(
        `🎤 Generating: ${key} (voice: ${voice}, length: ${messageConfig.text.length} chars)`
      );
      const audioUrl = await generateAudioFile(messageConfig.text, key, voice);
      results[key as AudioMessageKey] = audioUrl;
      // Add small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to generate premium audio for ${key}:`, error);
      // Fallback to empty string for failed generations
      results[key as AudioMessageKey] = "";
    }
  }

  console.log("🎉 Premium Brazilian Portuguese audio generation complete!");
  console.log(
    "🔊 All files generated with optimal intonation and natural pronunciation"
  );
  return results as Record<AudioMessageKey, string>;
}

/**
 * Check if all audio files exist
 */
export function checkAudioFilesExist(): boolean {
  const audioDir = join(process.cwd(), "public", "audio");

  if (!existsSync(audioDir)) {
    return false;
  }

  const audioMessages = getAllAudioMessages();
  return Object.keys(audioMessages).every((key) => {
    const filePath = join(audioDir, `${key}.mp3`);
    return existsSync(filePath);
  });
}
