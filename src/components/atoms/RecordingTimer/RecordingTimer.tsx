import { Text } from "@/components/atoms/Text/Text";
import { useEffect, useState } from "react";

export interface RecordingTimerProps {
  isRecording: boolean;
  onTimeUpdate?: (seconds: number) => void;
  className?: string;
}

/**
 * Timer component for recording interface
 * Shows elapsed recording time
 */
export function RecordingTimer({
  isRecording,
  onTimeUpdate,
  className = "",
}: RecordingTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          onTimeUpdate?.(newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, onTimeUpdate]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isRecording && seconds === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-red-100 border border-red-200 rounded-lg px-4 py-2">
        <div className="flex items-center space-x-2">
          {isRecording && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          <Text
            variant="body"
            className="font-mono font-semibold"
            style={{ color: "#dc2626" }}
          >
            {formatTime(seconds)}
          </Text>
        </div>
      </div>
    </div>
  );
}
