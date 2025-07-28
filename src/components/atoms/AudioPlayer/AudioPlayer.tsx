import { useEffect, useRef, useState } from "react";

export interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Audio player component for MP3 playback
 * Handles audio loading, playing, and error states
 */
export function AudioPlayer({
  src,
  autoPlay = false,
  onEnded,
  onError,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    setIsLoading(true);
    setError(null);

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        audio.play().catch((err) => {
          console.error("Auto-play failed:", err);
          setError("Auto-play failed");
          onError?.(new Error("Auto-play failed"));
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      const errorMsg = "Failed to load audio";
      setError(errorMsg);
      onError?.(new Error(errorMsg));
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Load the audio
    audio.load();

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src, autoPlay, onEnded, onError]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setError("Playback failed");
        onError?.(new Error("Playback failed"));
      });
    }
  };

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        Audio Error: {error}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <audio ref={audioRef} src={src} preload="auto" className="hidden" />

      <button
        onClick={togglePlayback}
        disabled={isLoading || !src}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white transition-colors"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <div className="w-3 h-3 flex space-x-0.5">
            <div className="w-1 h-full bg-white" />
            <div className="w-1 h-full bg-white" />
          </div>
        ) : (
          <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5" />
        )}
      </button>
    </div>
  );
}
