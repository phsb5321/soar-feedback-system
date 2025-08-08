"use client";
import { AudioMessageKey } from "@/lib/audioMessages";
import { useAudioStore } from "@/stores/audioStore";
import { useCallback } from "react";

export interface UseProtectedAudioReturn {
  // Protected audio playback
  playProtectedAudio: (messageKey: AudioMessageKey) => Promise<boolean>;
  stopProtectedAudio: () => void;

  // State
  isProtectedPlaying: boolean;
  isEnabled: boolean;

  // Utility
  getAudioUrl: (messageKey: AudioMessageKey) => string;
}

/**
 * Protected audio hook for help buttons
 *
 * This hook provides audio playback that cannot be interrupted by user interactions.
 * When protected audio is playing, the UI will be blocked with an overlay until
 * the audio completes naturally.
 *
 * Use this for:
 * - Help button audio that should play completely
 * - Important instructions that users should hear fully
 * - Audio feedback that requires user attention
 *
 * @example
 * ```tsx
 * const { playProtectedAudio, isProtectedPlaying } = useProtectedAudio();
 *
 * const handleHelpClick = () => {
 *   playProtectedAudio("welcomeMessage");
 * };
 * ```
 */
export function useProtectedAudio(): UseProtectedAudioReturn {
  const {
    isEnabled,
    isProtectedPlaying,
    playProtectedAudio: storePlayProtectedAudio,
    stopProtectedAudio: storeStopProtectedAudio,
  } = useAudioStore();

  const playProtectedAudio = useCallback(
    async (messageKey: AudioMessageKey) => {
      if (!isEnabled) {
        console.info(`Audio disabled, skipping protected audio: ${messageKey}`);
        return false;
      }

      if (isProtectedPlaying) {
        console.info("Protected audio already playing, ignoring new request");
        return false;
      }

      try {
        const success = await storePlayProtectedAudio(messageKey);
        if (success) {
          console.log(`Protected audio started: ${messageKey}`);
        }
        return success;
      } catch (error) {
        console.error(`Failed to play protected audio: ${messageKey}`, error);
        return false;
      }
    },
    [isEnabled, isProtectedPlaying, storePlayProtectedAudio],
  );

  const stopProtectedAudio = useCallback(() => {
    if (isProtectedPlaying) {
      storeStopProtectedAudio();
      console.log("Protected audio stopped by user");
    }
  }, [isProtectedPlaying, storeStopProtectedAudio]);

  const getAudioUrl = useCallback((messageKey: AudioMessageKey) => {
    return `/audio/${messageKey}.mp3`;
  }, []);

  return {
    // Protected audio playback
    playProtectedAudio,
    stopProtectedAudio,

    // State
    isProtectedPlaying,
    isEnabled,

    // Utility
    getAudioUrl,
  };
}
