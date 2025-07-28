"use client";
import { useAdvancedAudio } from "@/hooks/useAdvancedAudio";
import { AudioMessageKey } from "@/lib/audioMessages";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

interface AudioContextValue {
  playPageAudio: (
    messageKey: AudioMessageKey,
    priority?: number
  ) => Promise<boolean>;
  queuePageAudio: (messageKey: AudioMessageKey, priority?: number) => void;
  markPageInitialized: () => void;
  isPageInitialized: boolean;
}

const AudioContext = createContext<AudioContextValue | null>(null);

interface AudioProviderProps {
  children: ReactNode;
  pageId: string;
}

/**
 * Audio context provider for page-level audio management
 * Prevents audio loops and manages page-specific audio sequences
 */
export function AudioProvider({ children, pageId }: AudioProviderProps) {
  const audio = useAdvancedAudio();
  const pageInitialized = useRef(false);
  const playedPageAudios = useRef(new Set<string>());

  const markPageInitialized = () => {
    pageInitialized.current = true;
  };

  const playPageAudio = async (
    messageKey: AudioMessageKey,
    priority = 5
  ): Promise<boolean> => {
    const audioKey = `${pageId}-${messageKey}`;

    // Prevent duplicate page audio
    if (playedPageAudios.current.has(audioKey)) {
      console.info(`Page audio already played: ${audioKey}`);
      return false;
    }

    const result = await audio.playAudio(messageKey, { priority });
    if (result) {
      playedPageAudios.current.add(audioKey);
    }
    return result;
  };

  const queuePageAudio = (messageKey: AudioMessageKey, priority = 5) => {
    const audioKey = `${pageId}-${messageKey}`;

    // Prevent duplicate page audio
    if (playedPageAudios.current.has(audioKey)) {
      console.info(`Page audio already queued: ${audioKey}`);
      return;
    }

    audio.queueAudio(messageKey, { priority });
    playedPageAudios.current.add(audioKey);
  };

  // Handle auto-play audios on page load - REMOVED for user control
  // All audio is now triggered by user interaction via help buttons

  // Clear page audio history when page changes
  useEffect(() => {
    playedPageAudios.current.clear();
    pageInitialized.current = false;
  }, [pageId]);

  const contextValue: AudioContextValue = {
    playPageAudio,
    queuePageAudio,
    markPageInitialized,
    isPageInitialized: pageInitialized.current,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

/**
 * Hook to use audio context
 */
export function useAudioContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
}

/**
 * Hook for component-specific audio (prevents loops)
 */
export function useComponentAudio(componentId: string) {
  const audio = useAdvancedAudio();
  const playedAudios = useRef(new Set<string>());

  const playComponentAudio = async (
    messageKey: AudioMessageKey,
    priority = 5
  ): Promise<boolean> => {
    const audioKey = `${componentId}-${messageKey}`;

    if (playedAudios.current.has(audioKey)) {
      console.info(`Component audio already played: ${audioKey}`);
      return false;
    }

    const result = await audio.playAudio(messageKey, { priority });
    if (result) {
      playedAudios.current.add(audioKey);
    }
    return result;
  };

  const resetComponentAudio = () => {
    playedAudios.current.clear();
  };

  return {
    playComponentAudio,
    resetComponentAudio,
    ...audio,
  };
}
