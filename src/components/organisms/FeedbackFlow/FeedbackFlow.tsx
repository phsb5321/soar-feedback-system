"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { TTSPlayer } from "@/components/atoms/TTSPlayer/TTSPlayer";
import { CountdownTimer } from "@/components/molecules/CountdownTimer/CountdownTimer";
import { RecordingTimer } from "@/components/molecules/RecordingTimer/RecordingTimer";
import { PostRecordingActions } from "@/components/molecules/PostRecordingActions/PostRecordingActions";
import { NPSSurvey } from "@/components/molecules/NPSSurvey/NPSSurvey";
import { RecordButton } from "@/components/molecules/RecordButton/RecordButton";
import { TranscriptionDisplay } from "@/components/molecules/TranscriptionDisplay/TranscriptionDisplay";
import { Text } from "@/components/atoms/Text/Text";
import { Box, Paper } from "@mui/material";
import { Icon } from "@/components/atoms/Icon/Icon";

export type FlowStep = 
  | "welcome"
  | "countdown"
  | "recording"
  | "post-recording"
  | "transcription"
  | "nps-question"
  | "nps-survey"
  | "additional-comment"
  | "final-thanks";

export interface FeedbackFlowProps {
  onTranscribe: (audioBlob: Blob) => Promise<string>;
  onSendFeedback: (data: FeedbackData) => Promise<void>;
  className?: string;
}

export interface FeedbackData {
  audioBlob: Blob;
  transcription: string;
  npsScore?: number;
  additionalComment?: string;
}

export function FeedbackFlow({ onTranscribe, onSendFeedback, className = "" }: FeedbackFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("welcome");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [additionalComment, setAdditionalComment] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const MAX_RECORDING_TIME = 120; // 2 minutes

  useEffect(() => {
    if (currentStep === "recording" && !isRecording) {
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Função utilitária para detectar o melhor tipo MIME suportado
  const getSupportedMimeType = () => {
    if (typeof window === "undefined" || !window.MediaRecorder) return "";
    if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
    if (MediaRecorder.isTypeSupported("audio/aac")) return "audio/aac";
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
    return "";
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      console.log("Usando mimeType para gravação:", mimeType);
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log("ondataavailable", e.data, e.data.size);
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        console.log("onstop, chunks:", chunks.current);
        const blob = new Blob(chunks.current, { type: mimeType || undefined });
        console.log("Final blob", blob, blob.size, blob.type);
        setAudioBlob(blob);
        setIsRecording(false);
        setCurrentStep("post-recording");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setCurrentStep("recording");
    } catch (err) {
      setError("Microfone não disponível ou permissão negada.");
      console.error("Erro ao iniciar gravação:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!audioBlob) return;

    setIsSending(true);
    try {
      await onSendFeedback({
        audioBlob,
        transcription,
        npsScore: npsScore || undefined,
        additionalComment: additionalComment || undefined,
      });
      setCurrentStep("final-thanks");
    } catch (error) {
      setError("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    setError(null);

    try {
      const text = await onTranscribe(audioBlob);
      setTranscription(text);
      setCurrentStep("transcription");
    } catch (transcriptionError) {
      setError("Erro ao transcrever áudio.");
      console.error("Transcription error:", transcriptionError);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleNPSQuestion = (wantsNPS: boolean) => {
    if (wantsNPS) {
      setCurrentStep("nps-survey");
    } else {
      setCurrentStep("additional-comment");
    }
  };

  const handleNPSScore = (score: number) => {
    setNpsScore(score);
    setCurrentStep("additional-comment");
  };

  const handleAdditionalComment = (wantsComment: boolean) => {
    if (wantsComment) {
      setCurrentStep("recording");
    } else {
      handleSendFeedback();
    }
  };

  const resetFlow = () => {
    setCurrentStep("welcome");
    setAudioBlob(null);
    setTranscription("");
    setNpsScore(null);
    setAdditionalComment("");
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <TTSPlayer
              text="Olá! Vamos começar sua avaliação."
              autoPlay={true}
              onEnd={() => setCurrentStep("countdown")}
            />
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCurrentStep("countdown")}
              className="mt-8"
            >
              Começar Avaliação
            </Button>
          </div>
        );

      case "countdown":
        return (
          <CountdownTimer
            isActive={true}
            onComplete={() => setCurrentStep("recording")}
            duration={3}
          />
        );

      case "recording":
        return (
          <div className="space-y-6">
            <TTSPlayer
              text="Agora fale o que deseja compartilhar."
              autoPlay={true}
            />
            <RecordingTimer
              isRecording={isRecording}
              maxDuration={MAX_RECORDING_TIME}
              onTimeUp={stopRecording}
            />
            <RecordButton
              isRecording={isRecording}
              onToggleRecord={stopRecording}
              error={error}
              disabled={!isRecording}
            />
          </div>
        );

      case "post-recording":
        return (
          <div className="space-y-6">
            <Text variant="h3" className="text-center">
              Gravação Concluída!
            </Text>
            {audioBlob && (
              <PostRecordingActions
                audioBlob={audioBlob}
                onReRecord={() => setCurrentStep("countdown")}
                onSend={handleTranscribe}
                isSending={isTranscribing}
              />
            )}
          </div>
        );

      case "transcription":
        return (
          <div className="space-y-6">
            <TranscriptionDisplay
              transcription={transcription}
              isTranscribing={false}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep("countdown")}
              >
                Regravar
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep("nps-question")}
              >
                Continuar
              </Button>
            </div>
          </div>
        );

      case "nps-question":
        return (
          <div className="text-center space-y-6">
            <TTSPlayer
              text="Gostaria de avaliar sua experiência com uma nota de 0 a 10?"
              autoPlay={true}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => handleNPSQuestion(true)}
              >
                Sim
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleNPSQuestion(false)}
              >
                Pular
              </Button>
            </div>
          </div>
        );

      case "nps-survey":
        return (
          <div className="space-y-6">
            <TTSPlayer
              text="Como você avalia sua experiência? De 0 a 10."
              autoPlay={true}
            />
            <NPSSurvey
              onScoreSelect={handleNPSScore}
              onSkip={() => setCurrentStep("additional-comment")}
            />
          </div>
        );

      case "additional-comment":
        return (
          <div className="text-center space-y-6">
            <TTSPlayer
              text="Gostaria de deixar um comentário adicional por voz?"
              autoPlay={true}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => handleAdditionalComment(true)}
              >
                Sim
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAdditionalComment(false)}
              >
                Não
              </Button>
            </div>
          </div>
        );

      case "final-thanks":
        return (
          <div className="text-center space-y-6">
            <TTSPlayer
              text="Obrigado por sua participação!"
              autoPlay={true}
            />
            <Text variant="h3" className="text-green-600 dark:text-green-400">
              Feedback Enviado com Sucesso!
            </Text>
            <Button
              variant="primary"
              onClick={resetFlow}
              className="mt-8"
            >
              Voltar ao Início
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
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
        {renderStep()}
      </Paper>
    </div>
  );
} 