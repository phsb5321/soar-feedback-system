#!/usr/bin/env tsx
/**
 * Premium Audio Generation Script for Brazilian Portuguese
 * Generates high-quality TTS audio files using OpenAI's best practices
 *
 * Usage: tsx scripts/generate-premium-audio.ts
 */

import { config } from "dotenv";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

// Load environment variables
config({ path: ".env.local" });

// Brazilian Portuguese optimized messages with phonetic improvements
const PREMIUM_AUDIO_MESSAGES = {
  welcome: {
    text: "Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar.",
    voice: "nova" as const,
    speed: 0.9,
    description: "Warm welcome message",
  },
  recordingInstructions: {
    text: "Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente.",
    voice: "nova" as const,
    speed: 0.95,
    description: "Friendly recording instructions",
  },
  startRecording: {
    text: "Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões.",
    voice: "shimmer" as const,
    speed: 0.9,
    description: "Encouraging start recording",
  },
  stopRecording: {
    text: "Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês.",
    voice: "alloy" as const,
    speed: 1.0,
    description: "Professional recording completion",
  },
  csatWelcome: {
    text: "Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente.",
    voice: "nova" as const,
    speed: 0.85,
    description: "Inviting evaluation request",
  },
  submitSuccess: {
    text: "Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós.",
    voice: "shimmer" as const,
    speed: 0.9,
    description: "Grateful success message",
  },
  submitError: {
    text: "Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes.",
    voice: "alloy" as const,
    speed: 0.95,
    description: "Clear error message",
  },
  successMessage: {
    text: "Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!",
    voice: "shimmer" as const,
    speed: 0.85,
    description: "Celebratory final message",
  },
} as const;

type AudioMessageKey = keyof typeof PREMIUM_AUDIO_MESSAGES;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a single premium audio file with optimal Brazilian Portuguese settings
 */
async function generatePremiumAudioFile(
  key: AudioMessageKey,
  message: (typeof PREMIUM_AUDIO_MESSAGES)[AudioMessageKey]
): Promise<string> {
  const audioDir = join(process.cwd(), "public", "audio");

  if (!existsSync(audioDir)) {
    mkdirSync(audioDir, { recursive: true });
  }

  const filePath = join(audioDir, `${key}.mp3`);

  console.log(`🎵 Generating premium pt-BR audio: ${key}`);
  console.log(
    `   Voice: ${message.voice} | Speed: ${message.speed} | ${message.description}`
  );

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd", // Highest quality model
      voice: message.voice,
      input: message.text,
      speed: message.speed, // Optimized speed for Brazilian Portuguese
      response_format: "mp3",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    writeFileSync(filePath, buffer);

    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`✅ Generated: ${key}.mp3 (${sizeKB}KB)`);

    return `/audio/${key}.mp3`;
  } catch (error) {
    console.error(`❌ Failed to generate ${key}:`, error);
    throw error;
  }
}

/**
 * Delete all existing audio files
 */
function deleteExistingAudioFiles(): void {
  const audioDir = join(process.cwd(), "public", "audio");

  if (!existsSync(audioDir)) {
    return;
  }

  console.log("🗑️ Deleting existing audio files...");

  for (const key of Object.keys(PREMIUM_AUDIO_MESSAGES)) {
    const filePath = join(audioDir, `${key}.mp3`);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`   Deleted: ${key}.mp3`);
    }
  }
}

/**
 * Generate all premium audio files
 */
async function generateAllPremiumAudio(): Promise<void> {
  console.log("🚀 Starting premium Brazilian Portuguese audio generation");
  console.log("🎯 Using OpenAI TTS-1-HD with optimized pt-BR settings\n");

  // Delete existing files
  deleteExistingAudioFiles();

  const results: Partial<Record<AudioMessageKey, string>> = {};
  const keys = Object.keys(PREMIUM_AUDIO_MESSAGES) as AudioMessageKey[];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const message = PREMIUM_AUDIO_MESSAGES[key];

    try {
      const audioUrl = await generatePremiumAudioFile(key, message);
      results[key] = audioUrl;

      // Progress indicator
      console.log(`📊 Progress: ${i + 1}/${keys.length} files generated\n`);

      // Rate limiting delay to ensure quality
      if (i < keys.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${key}:`, error);
      results[key] = "";
    }
  }

  console.log("🎉 Premium audio generation complete!");
  console.log(
    "🔊 All files generated with optimal Brazilian Portuguese pronunciation"
  );

  // Summary
  const successful = Object.values(results).filter((url) => url !== "").length;
  console.log(
    `📈 Summary: ${successful}/${keys.length} files generated successfully`
  );
}

// Run the script
if (require.main === module) {
  generateAllPremiumAudio()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

export { generateAllPremiumAudio, PREMIUM_AUDIO_MESSAGES };
