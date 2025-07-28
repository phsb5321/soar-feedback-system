// Audio messages and client-safe utilities for the SOAR system
// Now using the i18n system for premium Brazilian Portuguese audio
import {
  CURRENT_LANGUAGE,
  getAudioMessage,
  type AudioMessageKey as I18nAudioMessageKey,
} from "./i18n-audio";

// Extract text messages for backward compatibility
export const AUDIO_MESSAGES = Object.fromEntries(
  Object.entries(CURRENT_LANGUAGE.audioMessages).map(([key, message]) => [
    key,
    message.text,
  ])
);

export type AudioMessageKey = I18nAudioMessageKey;

/**
 * Get audio URL for a predefined message (client-safe)
 */
export function getAudioUrl(messageKey: AudioMessageKey): string {
  return `/audio/${messageKey}.mp3`;
}

/**
 * Get premium audio message configuration
 */
export function getAudioMessageConfig(messageKey: AudioMessageKey) {
  return getAudioMessage(messageKey);
}

/**
 * Check if an audio file exists by trying to load it (client-safe)
 */
export async function checkAudioFileExists(audioUrl: string): Promise<boolean> {
  try {
    const response = await fetch(audioUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
