"use client";
import { AudioMessageKey } from "@/lib/audioMessages";
import { useAudioStore } from "@/stores/audioStore";
import { useCallback } from "react";

export interface UseAdvancedAudioReturn {
  // Basic playback
  playAudio: (
    messageKey: AudioMessageKey,
    options?: { priority?: number; force?: boolean }
  ) => Promise<boolean>;
  queueAudio: (
    messageKey: AudioMessageKey,
    options?: { priority?: number }
  ) => void;
  stopAudio: () => void;

  // State
  isPlaying: boolean;
  isEnabled: boolean;
  canPlayAudio: boolean;
  queueLength: number;

  // Utility
  getAudioUrl: (messageKey: AudioMessageKey) => string;
  hasPlayed: (messageKey: AudioMessageKey) => boolean;
}

/**
 * Advanced audio hook using Zustand store
 * Provides centralized audio management with queue system
 */
export function useAdvancedAudio(): UseAdvancedAudioReturn {
  const {
    isEnabled,
    isPlaying,
    canPlayAudio,
    queue,
    playedAudios,
    playAudio: storePlayAudio,
    queueAudio: storeQueueAudio,
    stopAudio: storeStopAudio,
  } = useAudioStore();

  const playAudio = useCallback(
    async (
      messageKey: AudioMessageKey,
      options?: { priority?: number; force?: boolean }
    ) => {
      return storePlayAudio(messageKey, options);
    },
    [storePlayAudio]
  );

  const queueAudio = useCallback(
    (messageKey: AudioMessageKey, options?: { priority?: number }) => {
      storeQueueAudio(messageKey, options);
    },
    [storeQueueAudio]
  );

  const stopAudio = useCallback(() => {
    storeStopAudio();
  }, [storeStopAudio]);

  const getAudioUrl = useCallback((messageKey: AudioMessageKey) => {
    return `/audio/${messageKey}.mp3`;
  }, []);

  const hasPlayed = useCallback(
    (messageKey: AudioMessageKey) => {
      return playedAudios.has(messageKey);
    },
    [playedAudios]
  );

  return {
    // Basic playback
    playAudio,
    queueAudio,
    stopAudio,

    // State
    isPlaying,
    isEnabled,
    canPlayAudio,
    queueLength: queue.length,

    // Utility
    getAudioUrl,
    hasPlayed,
  };
}
