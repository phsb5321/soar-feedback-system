"use client";
import { Button } from "@/components/atoms/Button/Button";
import { ErrorMessage } from "@/components/atoms/ErrorMessage/ErrorMessage";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Text } from "@/components/atoms/Text/Text";
import {
  AudioRecordingSection,
  FeedbackFormSection,
  TranscriptionDisplaySection,
} from "@/components/molecules";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { Paper } from "@mui/material";
import { useState } from "react";

export interface SimpleFeedbackFormProps {
  className?: string;
}

/**
 * Organism component for the complete feedback form
 * Follows Single Responsibility Principle and uses composition
 */
export function SimpleFeedbackForm({
  className = "",
}: SimpleFeedbackFormProps) {
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [additionalComment, setAdditionalComment] = useState("");

  const {
    isRecording,
    audioBlob,
    transcription,
    isTranscribing,
    isSubmitting,
    error,
    isSuccess,
    startRecording,
    stopRecording,
    submitFeedback,
    resetForm,
  } = useAudioFeedback();

  const handleSubmit = async () => {
    await submitFeedback(npsScore || undefined, additionalComment || undefined);
  };

  const handleReset = () => {
    resetForm();
    setNpsScore(null);
    setAdditionalComment("");
  };

  if (isSuccess) {
    return (
      <Paper
        elevation={20}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          borderRadius: { xs: 6, sm: 8 },
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 25px 80px 0 rgba(34, 197, 94, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.15)",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
        }}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Icon
              src="/send.svg"
              alt="Sucesso"
              size={32}
              className="text-green-600"
            />
          </div>
          <Text variant="h3" className="text-green-600 font-bold">
            Feedback Enviado com Sucesso!
          </Text>
          <Text variant="body" className="text-gray-600 max-w-md">
            Obrigado por sua participação. Sua opinião é muito importante para
            nós.
          </Text>
          <Button variant="primary" onClick={handleReset} className="mt-8">
            Enviar Novo Feedback
          </Button>
        </div>
      </Paper>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <Paper
        elevation={20}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          borderRadius: { xs: 6, sm: 8 },
          minHeight: "500px",
          boxShadow:
            "0 25px 80px 0 rgba(59, 130, 246, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.15)",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: { xs: "3px", sm: "5px" },
            background:
              "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B)",
          },
        }}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <Text variant="h3" className="font-bold text-gray-800 mb-2">
              Sistema de Avaliação SOAR
            </Text>
            <Text variant="body" className="text-gray-600">
              Compartilhe sua experiência conosco
            </Text>
          </div>

          {/* Audio Recording Section */}
          <AudioRecordingSection
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />

          {/* Transcription Display Section - Show after recording stops */}
          {!isRecording && transcription && (
            <TranscriptionDisplaySection transcription={transcription} />
          )}

          {/* Feedback Form Section - Show CSAT only after recording stops and transcription is available */}
          {!isRecording && audioBlob && transcription && !isTranscribing && (
            <FeedbackFormSection
              npsScore={npsScore}
              additionalComment={additionalComment}
              onNpsScoreChange={setNpsScore}
              onAdditionalCommentChange={setAdditionalComment}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isDisabled={!audioBlob || !transcription}
            />
          )}

          {/* Error Display */}
          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => {}} // Error will be cleared on next action
            />
          )}
        </div>
      </Paper>
    </div>
  );
}
