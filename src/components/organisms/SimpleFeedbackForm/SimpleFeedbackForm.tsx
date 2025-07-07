"use client";
import { Button } from "@/components/atoms/Button/Button";
import { ErrorMessage } from "@/components/atoms/ErrorMessage/ErrorMessage";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Text } from "@/components/atoms/Text/Text";
import {
  AudioRecordingSection,
  TranscriptionDisplaySection,
} from "@/components/molecules";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
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
          <Text variant="h3" className="font-bold" style={{ color: "#16a34a" }}>
            Feedback Enviado com Sucesso!
          </Text>
          <Text
            variant="body"
            className="max-w-md"
            style={{ color: "#6b7280" }}
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
            <Text
              variant="h3"
              className="font-bold mb-2"
              style={{ color: "#1f2937" }}
            >
              Sistema de Avaliação SOAR
            </Text>
            <Text variant="body" style={{ color: "#6b7280" }}>
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
            <>
              <TranscriptionDisplaySection transcription={transcription} />

              {/* Action buttons for transcription review */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-blue-600 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Text
                        variant="body"
                        className="font-medium"
                        style={{ color: "#1f2937" }}
                      >
                        Revise sua transcrição
                      </Text>
                      <Text variant="caption" style={{ color: "#6b7280" }}>
                        Verifique se a transcrição está correta. Você pode
                        regravar se necessário ou prosseguir para a avaliação.
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="secondary"
                    onClick={handleReRecord}
                    className="w-full sm:w-auto"
                    style={{ color: "#6b7280", borderColor: "#d1d5db" }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Icon src="/mic.svg" alt="Regravar" size={20} />
                      <span>Regravar</span>
                    </div>
                  </Button>

                  <Button
                    variant="primary"
                    onClick={handleProceedToCSAT}
                    disabled={!transcription || isTranscribing}
                    className="w-full sm:flex-1"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Icon src="/arrow-right.svg" alt="Continuar" size={20} />
                      <span>Continuar para Avaliação</span>
                    </div>
                  </Button>
                </div>
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
