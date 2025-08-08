"use client";
import { useAudioStore } from "@/stores/audioStore";
import { useEffect, useRef } from "react";

interface UseGlobalAudioInterceptorOptions {
  /**
   * Events to listen for that should stop audio
   * Default: ['click', 'keydown', 'touchstart']
   */
  events?: string[];
  /**
   * Whether to capture events in the capture phase
   * Default: true (to catch events before they reach specific components)
   */
  useCapture?: boolean;
  /**
   * Delay in milliseconds before stopping audio to avoid conflicts
   * Default: 0
   */
  stopDelay?: number;
  /**
   * Whether to prevent the event from propagating after stopping audio
   * Default: false (let normal event handling continue)
   */
  preventDefault?: boolean;
}

/**
 * Global hook that intercepts user interactions and stops any playing audio
 * This ensures that any user action anywhere in the app will stop help audio
 */
export function useGlobalAudioInterceptor(
  options: UseGlobalAudioInterceptorOptions = {},
) {
  const {
    events = ["click", "keydown", "touchstart"],
    useCapture = true,
    stopDelay = 0,
    preventDefault = false,
  } = options;

  const { isPlaying, isProtectedPlaying, stopAudio } = useAudioStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleUserInteraction = (event: Event) => {
      // Only stop audio if something is currently playing AND it's not protected
      if (!isPlaying || isProtectedPlaying) {
        return;
      }

      // Clear any pending stop action
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Stop audio after the specified delay
      if (stopDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          stopAudio();
          console.log(
            `Audio stopped due to user interaction: ${event.type} on`,
            event.target,
          );
        }, stopDelay);
      } else {
        stopAudio();
        console.log(
          `Audio stopped due to user interaction: ${event.type} on`,
          event.target,
        );
      }

      // Optionally prevent the event from continuing
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Add event listeners for all specified events
    events.forEach((eventType) => {
      document.addEventListener(eventType, handleUserInteraction, useCapture);
    });

    // Cleanup function
    return () => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Remove all event listeners
      events.forEach((eventType) => {
        document.removeEventListener(
          eventType,
          handleUserInteraction,
          useCapture,
        );
      });
    };
  }, [
    isPlaying,
    isProtectedPlaying,
    stopAudio,
    events,
    useCapture,
    stopDelay,
    preventDefault,
  ]);

  // Return current state for potential debugging
  return {
    isIntercepting: isPlaying,
    eventsListening: events,
  };
}
