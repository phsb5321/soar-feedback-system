import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import { Text } from "@/components/atoms/Text/Text";
import { Chip, Rating, TextField } from "@mui/material";

export interface FeedbackFormSectionProps {
  npsScore: number | null;
  additionalComment: string;
  onNpsScoreChange: (score: number | null) => void;
  onAdditionalCommentChange: (comment: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  className?: string;
}

/**
 * Molecule component for feedback form section
 * Follows Single Responsibility Principle and Interface Segregation Principle
 */
export function FeedbackFormSection({
  npsScore,
  additionalComment,
  onNpsScoreChange,
  onAdditionalCommentChange,
  onSubmit,
  isSubmitting,
  isDisabled,
  className = "",
}: FeedbackFormSectionProps) {
  const getNPSLabel = (score: number): string => {
    if (score <= 2) return "Muito Insatisfeito";
    if (score <= 4) return "Insatisfeito";
    if (score <= 6) return "Neutro";
    if (score <= 8) return "Satisfeito";
    return "Muito Satisfeito";
  };

  const getNPSColor = (score: number): string => {
    if (score <= 2) return "#ef4444";
    if (score <= 4) return "#f97316";
    if (score <= 6) return "#eab308";
    if (score <= 8) return "#3b82f6";
    return "#22c55e";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* NPS Rating Section */}
      <div className="space-y-4">
        <Text variant="h3" className="font-semibold text-gray-700">
          3. Avalie sua experiência (opcional)
        </Text>

        <div className="space-y-3">
          <div className="flex flex-col items-center space-y-2">
            <Rating
              name="nps-rating"
              value={npsScore}
              onChange={(_, newValue) => onNpsScoreChange(newValue)}
              max={10}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: npsScore ? getNPSColor(npsScore) : "#d1d5db",
                },
              }}
            />
            <div className="text-center">
              <Text variant="caption" className="text-gray-500">
                0 = Muito Insatisfeito | 10 = Muito Satisfeito
              </Text>
              {npsScore !== null && (
                <Chip
                  label={`${npsScore}/10 - ${getNPSLabel(npsScore)}`}
                  color="primary"
                  size="small"
                  className="mt-2"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Comment Section */}
      <div className="space-y-4">
        <Text variant="h3" className="font-semibold text-gray-700">
          4. Comentário adicional (opcional)
        </Text>
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Deixe um comentário adicional sobre sua experiência..."
          value={additionalComment}
          onChange={(e) => onAdditionalCommentChange(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={isDisabled || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="small" color="white" />
              <span>Enviando feedback...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Icon src="/send.svg" alt="Enviar" size={20} />
              <span>Enviar Feedback</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
