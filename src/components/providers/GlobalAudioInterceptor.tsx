"use client";
import { useGlobalAudioInterceptor } from "@/hooks/useGlobalAudioInterceptor";

/**
 * Global Audio Interceptor Component
 *
 * This component provides global event interception to stop audio playback
 * when users interact with any part of the application. It should be placed
 * in the root layout to ensure coverage across the entire app.
 *
 * Features:
 * - Stops any playing audio when user clicks anywhere
 * - Stops audio on keyboard interactions (accessibility)
 * - Stops audio on touch interactions (mobile)
 * - Does not interfere with normal event handling
 * - Only activates when audio is actually playing
 */
export function GlobalAudioInterceptor() {
  // Use the hook with default settings
  // This will listen for click, keydown, and touchstart events
  useGlobalAudioInterceptor({
    events: ["click", "keydown", "touchstart"],
    useCapture: true, // Capture events early
    stopDelay: 0, // Stop immediately
    preventDefault: false, // Don't interfere with normal events
  });

  // This component renders nothing but provides the global behavior
  return null;
}
