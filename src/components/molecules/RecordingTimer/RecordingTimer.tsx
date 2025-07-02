"use client";
import { useEffect, useState } from "react";
import { Text } from "@/components/atoms/Text/Text";

export interface RecordingTimerProps {
  isRecording: boolean;
  maxDuration: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
}

export function RecordingTimer({
  isRecording,
  maxDuration,
  onTimeUp,
  className = "",
}: RecordingTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            onTimeUp?.();
            return prev;
          }
          return newTime;
        });
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, maxDuration, onTimeUp]);

  if (!isRecording) {
    return null;
  }

  const progress = (elapsedTime / maxDuration) * 100;
  const remainingTime = maxDuration - elapsedTime;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            progress > 80
              ? "bg-red-500"
              : progress > 60
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer Display */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <Text
          variant="body"
          className={`font-mono text-lg font-bold ${
            remainingTime <= 10 ? "text-red-500 animate-pulse" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </Text>
      </div>

      {/* Warning Message */}
      {remainingTime <= 10 && (
        <Text
          variant="caption"
          color="error"
          className="text-center animate-pulse font-semibold"
        >
          Tempo acabando!
        </Text>
      )}
    </div>
  );
} 