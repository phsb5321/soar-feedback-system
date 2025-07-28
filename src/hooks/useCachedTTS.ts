"use client";
import { AudioMessageKey, getAudioUrl } from "@/lib/audioMessages";
import { useCallback, useState } from "react";

export interface CachedTTSHookReturn {
  playAudio: (messageKey: AudioMessageKey) => Promise<boolean>;
  stop: () => void;
  isPlaying: boolean;
  getAudioUrl: (messageKey: AudioMessageKey) => string;
  canPlayAudio: boolean;
}

/**
 * Hook for pre-recorded audio playback only
 * Uses polished MP3 files for all audio messages
 * NO fallback to synthetic TTS - only high-quality pre-recorded audio
 */
export function useCachedTTS(): CachedTTSHookReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [canPlayAudio, setCanPlayAudio] = useState(false);

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  }, [currentAudio]);

  const playAudio = useCallback(
    async (messageKey: AudioMessageKey): Promise<boolean> => {
      // Stop any current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }

      const audioUrl = getAudioUrl(messageKey);
      const audio = new Audio(audioUrl);

      // Set up event handlers
      audio.onloadstart = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
      audio.onerror = (error) => {
        setIsPlaying(false);
        setCurrentAudio(null);
        console.error(`Failed to load pre-recorded audio: ${audioUrl}`, error);
        // Show user-friendly message instead of falling back to synthetic TTS
        console.info(
          `Audio file not available: ${messageKey}. Please ensure audio files are generated.`
        );
      };

      setCurrentAudio(audio);

      try {
        await audio.play();
        setCanPlayAudio(true);
        console.log(`Successfully playing polished audio: ${messageKey}`);
        return true;
      } catch (error) {
        setIsPlaying(false);
        setCurrentAudio(null);
        console.warn(
          `Audio autoplay blocked for: ${audioUrl}. User interaction required.`,
          error
        );
        // Do NOT fall back to synthetic TTS - only use pre-recorded audio
        return false;
      }
    },
    [currentAudio]
  );

  return {
    playAudio,
    stop,
    isPlaying,
    getAudioUrl,
    canPlayAudio,
  };
}
