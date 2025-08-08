"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Text } from "@/components/atoms/Text/Text";

export interface TTSPlayerProps {
  text: string;
  audioUrl?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  className?: string;
}

export function TTSPlayer({
  text,
  audioUrl,
  autoPlay = false,
  onPlay,
  onPause,
  onEnd,
  className = "",
}: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("play", () => {
        setIsPlaying(true);
        onPlay?.();
      });

      audio.addEventListener("pause", () => {
        setIsPlaying(false);
        onPause?.();
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        onEnd?.();
      });

      audio.addEventListener("loadstart", () => {
        setIsLoading(true);
      });

      audio.addEventListener("canplay", () => {
        setIsLoading(false);
      });

      if (autoPlay) {
        audio.play().catch(console.error);
      }

      return () => {
        audio.pause();
        audio.removeEventListener("play", () => {});
        audio.removeEventListener("pause", () => {});
        audio.removeEventListener("ended", () => {});
        audio.removeEventListener("loadstart", () => {});
        audio.removeEventListener("canplay", () => {});
      };
    }
  }, [audioUrl, autoPlay, onPlay, onPause, onEnd]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  if (!audioUrl) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Text variant="body" className="text-gray-700 dark:text-gray-400">
          {text}
        </Text>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          transition-all duration-300 ease-out
          ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Icon src="/pause.svg" alt="Pausar" size={16} />
        ) : (
          <Icon src="/play.svg" alt="Reproduzir" size={16} />
        )}
      </button>

      <div className="flex-1">
        <Text variant="body" className="text-gray-800 dark:text-gray-200">
          {text}
        </Text>
        {isPlaying && (
          <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
