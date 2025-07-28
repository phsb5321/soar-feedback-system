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

  // Actions
  playAudio: (
    messageKey: AudioMessageKey,
    options?: { priority?: number; force?: boolean }
  ) => Promise<boolean>;
  queueAudio: (
    messageKey: AudioMessageKey,
    options?: { priority?: number; immediate?: boolean }
  ) => void;
  stopAudio: () => void;
  processQueue: () => Promise<void>;

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
        (item) => item.messageKey === messageKey
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
        (a, b) => b.priority - a.priority
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
          error
        );

        // Retry logic
        if (nextItem.retryCount < 2) {
          const retryItem = {
            ...nextItem,
            retryCount: nextItem.retryCount + 1,
          };
          set((state) => ({
            queue: [...state.queue, retryItem].sort(
              (a, b) => b.priority - a.priority
            ),
          }));
        }
      }
    },

    // Internal: Create and configure audio element
    _createAudioElement: (messageKey: AudioMessageKey) => {
      const audioUrl = getAudioUrl(messageKey);
      const audio = new Audio(audioUrl);

      // Configure event handlers
      audio.onended = () => {
        set({ isPlaying: false, currentAudio: null });
        // Process next item in queue when current finishes
        setTimeout(() => get().processQueue(), 100);
      };

      audio.onerror = (error) => {
        console.error(`Failed to load audio: ${audioUrl}`, error);
        set({ isPlaying: false, currentAudio: null });
        // Continue processing queue even on error
        setTimeout(() => get().processQueue(), 100);
      };

      return audio;
    },
  }))
);

// Auto-process queue when items are added
useAudioStore.subscribe(
  (state) => state.queue,
  (queue) => {
    if (queue.length > 0) {
      // Small delay to allow for state updates
      setTimeout(() => useAudioStore.getState().processQueue(), 50);
    }
  }
);
