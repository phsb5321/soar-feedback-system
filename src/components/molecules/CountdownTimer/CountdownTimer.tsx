"use client";
import { useEffect, useState } from "react";
import { Text } from "@/components/atoms/Text/Text";

export interface CountdownTimerProps {
  isActive: boolean;
  onComplete: () => void;
  duration?: number; // in seconds
  className?: string;
}

export function CountdownTimer({
  isActive,
  onComplete,
  duration = 3,
  className = "",
}: CountdownTimerProps) {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setCount(duration);
      return;
    }

    if (count === 0) return;

    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration, count]);

  useEffect(() => {
    if (isActive && count === 0) {
      onComplete();
    }
  }, [count, isActive, onComplete]);

  if (!isActive) {
    return null;
  }

  const getMessage = () => {
    if (count > 1) return `${count}...`;
    if (count === 1) return "1...";
    return "FALE!";
  };

  const getColor = () => {
    if (count > 1) return "text-blue-600 dark:text-blue-400";
    if (count === 1) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Pulsing background */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150" />
        
        {/* Main countdown display */}
        <div className="relative z-10 flex items-center justify-center w-32 h-32 bg-white dark:bg-gray-800 rounded-full shadow-2xl border-4 border-blue-200 dark:border-gray-600">
          <Text
            variant="h1"
            className={`font-bold text-4xl sm:text-5xl md:text-6xl ${getColor()} animate-pulse`}
          >
            {getMessage()}
          </Text>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <Text
          variant="body"
          className="text-gray-600 dark:text-gray-400 font-medium"
        >
          {count > 0 ? "Prepare-se para falar..." : "Agora fale o que deseja compartilhar!"}
        </Text>
      </div>
    </div>
  );
} 