import { AudioMessageKey, getAudioUrl } from "@/lib/audioMessages";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface AudioQueueItem {
  id: string;
  messageKey: AudioMessageKey;
  priority: number;
  retryCount: number;
}

interface AudioStore {
  // State
  isEnabled: boolean;
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
  queue: AudioQueueItem[];
  playedAudios: Set<string>;
  canPlayAudio: boolean;

  // Protected audio state (cannot be interrupted)
  isProtectedPlaying: boolean;
  protectedAudio: HTMLAudioElement | null;

  // Actions
  playAudio: (
    messageKey: AudioMessageKey,
    options?: { priority?: number; force?: boolean },
  ) => Promise<boolean>;
  queueAudio: (
    messageKey: AudioMessageKey,
    options?: { priority?: number; immediate?: boolean },
  ) => void;
  stopAudio: () => void;
  processQueue: () => Promise<void>;

  // Protected audio actions
  playProtectedAudio: (messageKey: AudioMessageKey) => Promise<boolean>;
  stopProtectedAudio: () => void;

  // Internal methods
  _playNext: () => Promise<void>;
  _createAudioElement: (messageKey: AudioMessageKey) => HTMLAudioElement;
}

export const useAudioStore = create<AudioStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isEnabled: true,
    isPlaying: false,
    currentAudio: null,
    queue: [],
    playedAudios: new Set(),
    canPlayAudio: false,

    // Protected audio initial state
    isProtectedPlaying: false,
    protectedAudio: null,

    // Main play audio method
    playAudio: async (messageKey: AudioMessageKey, options = {}) => {
      const {
        isEnabled,
        isPlaying,
        currentAudio,
        _createAudioElement,
        playedAudios,
      } = get();

      if (!isEnabled) {
        console.info(`Audio disabled, skipping: ${messageKey}`);
        return false;
      }

      const { force = false } = options;

      // If not forcing and audio was already played, skip
      if (!force && playedAudios.has(messageKey)) {
        console.info(`Audio already played, skipping: ${messageKey}`);
        return false;
      }

      // Stop current audio if playing
      if (currentAudio && isPlaying) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      try {
        const audio = _createAudioElement(messageKey);
        set({ currentAudio: audio, isPlaying: true });

        await audio.play();
        set({ canPlayAudio: true });

        // Mark as played
        const newPlayedAudios = new Set(playedAudios);
        newPlayedAudios.add(messageKey);
        set({ playedAudios: newPlayedAudios });

        console.log(`Successfully playing audio: ${messageKey}`);
        return true;
      } catch (error) {
        console.warn(`Audio autoplay blocked for: ${messageKey}`, error);
        set({ isPlaying: false, currentAudio: null });
        return false;
      }
    },

    // Queue audio for later playback
    queueAudio: (messageKey: AudioMessageKey, options = {}) => {
      const { isEnabled, queue, playAudio } = get();

      if (!isEnabled) {
        console.info(`Audio disabled, not queuing: ${messageKey}`);
        return;
      }

      const { priority = 5, immediate = false } = options;

      // If immediate, play right away
      if (immediate) {
        playAudio(messageKey, { priority, force: true });
        return;
      }

      // Check if already in queue
      const existingIndex = queue.findIndex(
        (item) => item.messageKey === messageKey,
      );
      if (existingIndex !== -1) {
        console.info(`Audio already in queue: ${messageKey}`);
        return;
      }

      const queueItem: AudioQueueItem = {
        id: `${messageKey}-${Date.now()}`,
        messageKey,
        priority,
        retryCount: 0,
      };

      // Insert based on priority (higher priority first)
      const newQueue = [...queue, queueItem].sort(
        (a, b) => b.priority - a.priority,
      );
      set({ queue: newQueue });

      console.log(`Queued audio: ${messageKey} (priority: ${priority})`);
    },

    // Stop current audio
    stopAudio: () => {
      const { currentAudio } = get();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      set({ isPlaying: false, currentAudio: null });
    },

    // Play protected audio (cannot be interrupted)
    playProtectedAudio: async (messageKey: AudioMessageKey) => {
      const { isEnabled, protectedAudio, _createAudioElement } = get();

      if (!isEnabled) {
        console.info(`Audio disabled, skipping protected: ${messageKey}`);
        return false;
      }

      // Stop any current protected audio
      if (protectedAudio) {
        protectedAudio.pause();
        protectedAudio.currentTime = 0;
      }

      try {
        const audio = _createAudioElement(messageKey);

        // Configure protected audio specific handlers with improved event handling
        const cleanupProtectedAudio = () => {
          set({ isProtectedPlaying: false, protectedAudio: null });
        };

        audio.onended = () => {
          cleanupProtectedAudio();
          console.log(`Protected audio ended: ${messageKey}`);
        };

        audio.onerror = (error) => {
          console.error(`Failed to load protected audio: ${messageKey}`, error);
          cleanupProtectedAudio();
        };

        // Add additional event listeners for better completion detection
        audio.onpause = () => {
          // If audio is paused and has reached the end, consider it finished
          if (audio.currentTime >= audio.duration - 0.1) {
            cleanupProtectedAudio();
            console.log(
              `Protected audio completed via pause event: ${messageKey}`,
            );
          }
        };

        audio.onstalled = () => {
          console.warn(`Protected audio stalled: ${messageKey}`);
          // Don't automatically cleanup on stall, but log it
        };

        // Timeout fallback - automatically cleanup after reasonable time
        const timeoutId = setTimeout(() => {
          if (get().isProtectedPlaying && get().protectedAudio === audio) {
            console.warn(
              `Protected audio timeout reached for: ${messageKey}, auto-cleanup`,
            );
            cleanupProtectedAudio();
          }
        }, 30000); // 30 second timeout

        // Clear timeout when audio ends naturally
        audio.addEventListener("ended", () => {
          clearTimeout(timeoutId);
        });

        set({ protectedAudio: audio, isProtectedPlaying: true });
        await audio.play();

        console.log(`Successfully playing protected audio: ${messageKey}`);
        return true;
      } catch (error) {
        console.warn(
          `Protected audio autoplay blocked for: ${messageKey}`,
          error,
        );
        set({ isProtectedPlaying: false, protectedAudio: null });
        return false;
      }
    },

    // Stop protected audio
    stopProtectedAudio: () => {
      const { protectedAudio } = get();
      if (protectedAudio) {
        protectedAudio.pause();
        protectedAudio.currentTime = 0;
      }
      set({ isProtectedPlaying: false, protectedAudio: null });
    },

    // Process the audio queue
    processQueue: async () => {
      const { queue, isPlaying, _playNext } = get();

      if (queue.length === 0 || isPlaying) {
        return;
      }

      await _playNext();
    },

    // Internal: Play next item in queue
    _playNext: async () => {
      const { queue, playAudio } = get();

      if (queue.length === 0) {
        return;
      }

      const [nextItem, ...remainingQueue] = queue;
      set({ queue: remainingQueue });

      try {
        await playAudio(nextItem.messageKey, { force: true });
      } catch (error) {
        console.error(
          `Failed to play queued audio: ${nextItem.messageKey}`,
          error,
        );

        // Retry logic
        if (nextItem.retryCount < 2) {
          const retryItem = {
            ...nextItem,
            retryCount: nextItem.retryCount + 1,
          };
          set((state) => ({
            queue: [...state.queue, retryItem].sort(
              (a, b) => b.priority - a.priority,
            ),
          }));
        }
      }
    },

    // Internal: Create and configure audio element
    _createAudioElement: (messageKey: AudioMessageKey) => {
      const audioUrl = getAudioUrl(messageKey);
      const audio = new Audio(audioUrl);

      // Configure event handlers with improved completion detection
      const cleanupRegularAudio = () => {
        set({ isPlaying: false, currentAudio: null });
        // Process next item in queue when current finishes
        setTimeout(() => get().processQueue(), 100);
      };

      audio.onended = () => {
        cleanupRegularAudio();
      };

      audio.onerror = (error) => {
        console.error(`Failed to load audio: ${audioUrl}`, error);
        cleanupRegularAudio();
      };

      // Additional event listeners for better completion detection
      audio.onpause = () => {
        // If audio is paused and has reached the end, consider it finished
        if (audio.currentTime >= audio.duration - 0.1) {
          cleanupRegularAudio();
        }
      };

      return audio;
    },
  })),
);

// Auto-process queue when items are added
useAudioStore.subscribe(
  (state) => state.queue,
  (queue) => {
    if (queue.length > 0) {
      // Small delay to allow for state updates
      setTimeout(() => useAudioStore.getState().processQueue(), 50);
    }
  },
);
