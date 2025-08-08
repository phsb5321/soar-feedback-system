"use client";
import { Button } from "@/components/atoms/Button/Button";
import { ErrorMessage } from "@/components/atoms/ErrorMessage/ErrorMessage";
import { HelpButton } from "@/components/atoms/HelpButton/HelpButton";
import { Text } from "@/components/atoms/Text/Text";
import {
  AudioRecordingSection,
  TranscriptionDisplaySection,
} from "@/components/molecules";
import { useContrastContext } from "@/components/providers/ContrastProvider";

import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { useProtectedAudio } from "@/hooks/useProtectedAudio";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { colors, getSmartBackground } = useContrastContext();

  const { playProtectedAudio } = useProtectedAudio();

  const {
    isRecording,
    audioBlob,
    transcription,
    isTranscribing,
    error,
    isSuccess,
    startRecording,
    stopRecording,
    resetForm,
  } = useAudioFeedback();

  const handleSuccessHelp = () => {
    playProtectedAudio("successMessage").catch(() => {
      console.info("Success audio blocked, proceeding without audio feedback");
    });
  };

  const handleProceedToCSAT = () => {
    if (transcription) {
      const params = new URLSearchParams({
        transcription,
        audioUrl: audioBlob ? "recorded" : "",
      });
      router.push(`/csat?${params.toString()}`);
    }
  };

  const handleReRecord = () => {
    resetForm();
  };

  if (isSuccess) {
    const successBg = getSmartBackground("success", "subtle");

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
          background: successBg.backgroundColor,
          color: successBg.textColor,
          backdropFilter: "blur(20px)",
          border: `1px solid ${successBg.borderColor}`,
        }}
      >
        <div className="text-center space-y-6 relative">
          {/* Help button for success message */}
          <div className="absolute top-0 right-0">
            <HelpButton
              ariaLabel="Ouvir mensagem de sucesso"
              tooltip="Clique para ouvir confirmação de sucesso"
              onHelp={handleSuccessHelp}
              icon="help"
              size="small"
              color="primary"
            />
          </div>

          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✅</span>
          </div>
          <Text
            variant="h3"
            className="font-bold"
            style={{ color: colors.success }}
          >
            Feedback Enviado com Sucesso!
          </Text>
          <Text
            variant="body"
            className="max-w-md"
            style={{ color: colors.secondary }}
          >
            Obrigado por sua participação. Sua opinião é muito importante para
            nós.
          </Text>
          <Button variant="primary" onClick={handleReRecord} className="mt-8">
            Enviar Novo Feedback
          </Button>
        </div>
      </Paper>
    );
  }

  const formBg = getSmartBackground("neutral", "subtle");

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
          background: formBg.backgroundColor,
          color: formBg.textColor,
          backdropFilter: "blur(20px)",
          border: `1px solid ${formBg.borderColor}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: { xs: "3px", sm: "5px" },
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent}, ${colors.info}, ${colors.warning})`,
          },
        }}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <Text
              variant="h3"
              className="font-bold mb-2"
              style={{ color: colors.primary }}
            >
              🎙️ Sistema de Feedback SOAR
            </Text>
            <Text variant="body" style={{ color: colors.secondary }}>
              Grave seu feedback em voz
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
            <>
              <TranscriptionDisplaySection
                transcription={transcription}
                audioBlob={audioBlob || undefined}
              />

              {/* Simplified action buttons with icons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="secondary"
                  onClick={handleReRecord}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">🔄</span>
                  <span>Regravar</span>
                </Button>

                <Button
                  variant="primary"
                  onClick={handleProceedToCSAT}
                  disabled={!transcription || isTranscribing}
                  className="w-full sm:flex-1 flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">▶️</span>
                  <span>Continuar</span>
                </Button>
              </div>
            </>
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
