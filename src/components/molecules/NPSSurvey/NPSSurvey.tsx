"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Text } from "@/components/atoms/Text/Text";

export interface NPSSurveyProps {
  onScoreSelect: (score: number) => void;
  onSkip?: () => void;
  className?: string;
}

export function NPSSurvey({ onScoreSelect, onSkip, className = "" }: NPSSurveyProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score);
  };

  const handleSubmit = () => {
    if (selectedScore !== null) {
      setIsSubmitting(true);
      onScoreSelect(selectedScore);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return "bg-red-500 hover:bg-red-600";
    if (score <= 4) return "bg-orange-500 hover:bg-orange-600";
    if (score <= 6) return "bg-yellow-500 hover:bg-yellow-600";
    if (score <= 8) return "bg-blue-500 hover:bg-blue-600";
    return "bg-green-500 hover:bg-green-600";
  };

  const getScoreLabel = (score: number) => {
    if (score <= 2) return "Muito Insatisfeito";
    if (score <= 4) return "Insatisfeito";
    if (score <= 6) return "Neutro";
    if (score <= 8) return "Satisfeito";
    return "Muito Satisfeito";
  };

  return (
    <div className={`flex flex-col items-center gap-6 w-full max-w-md mx-auto ${className}`}>
      <div className="text-center">
        <Text variant="h3" className="mb-2 font-bold text-gray-800 dark:text-gray-200">
          Como você avalia sua experiência?
        </Text>
        <Text variant="body" className="text-gray-600 dark:text-gray-400">
          De 0 (muito insatisfeito) a 10 (muito satisfeito)
        </Text>
      </div>

      {/* Score Buttons */}
      <div className="grid grid-cols-11 gap-1 w-full">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleScoreSelect(i)}
            className={`
              aspect-square rounded-lg transition-all duration-300
              flex items-center justify-center text-white font-bold
              ${selectedScore === i ? "scale-110 ring-4 ring-blue-300" : "hover:scale-105"}
              ${getScoreColor(i)}
              ${i === 0 ? "text-xs" : "text-sm"}
            `}
            aria-label={`Nota ${i}: ${getScoreLabel(i)}`}
          >
            {i}
          </button>
        ))}
      </div>

      {/* Selected Score Display */}
      {selectedScore !== null && (
        <div className="text-center">
          <Text variant="body" className="font-semibold text-gray-700 dark:text-gray-300">
            Você selecionou: <span className="text-blue-600 dark:text-blue-400">{selectedScore}</span>
          </Text>
          <Text variant="caption" className="text-gray-500 dark:text-gray-400">
            {getScoreLabel(selectedScore)}
          </Text>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {onSkip && (
          <Button
            variant="secondary"
            size="md"
            onClick={onSkip}
            disabled={isSubmitting}
            className="flex-1"
          >
            Pular
          </Button>
        )}
        
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={selectedScore === null || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Enviando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
} 