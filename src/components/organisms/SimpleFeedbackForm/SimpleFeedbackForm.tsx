"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Text } from "@/components/atoms/Text/Text";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Paper, TextField, Rating, Chip } from "@mui/material";

export interface SimpleFeedbackFormProps {
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

export function SimpleFeedbackForm({ 
  onTranscribe, 
  onSendFeedback, 
  className = "" 
}: SimpleFeedbackFormProps) {
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  
  // Form states
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [additionalComment, setAdditionalComment] = useState("");
  
  // UI states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setIsRecording(false);
        
        // Auto-transcribe when recording stops
        await handleTranscribe(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microfone não disponível ou permissão negada.");
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const text = await onTranscribe(blob);
      setTranscription(text);
    } catch (err) {
      setError("Erro ao transcrever áudio.");
      console.error("Transcription error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || !transcription) {
      setError("Por favor, grave um áudio primeiro.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSendFeedback({
        audioBlob,
        transcription,
        npsScore: npsScore || undefined,
        additionalComment: additionalComment || undefined,
      });
      setIsSuccess(true);
    } catch (err) {
      setError("Erro ao enviar feedback. Tente novamente.");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsRecording(false);
    setAudioBlob(null);
    setTranscription("");
    setNpsScore(null);
    setAdditionalComment("");
    setError(null);
    setIsSuccess(false);
  };

  const getNPSLabel = (score: number) => {
    if (score <= 2) return "Muito Insatisfeito";
    if (score <= 4) return "Insatisfeito";
    if (score <= 6) return "Neutro";
    if (score <= 8) return "Satisfeito";
    return "Muito Satisfeito";
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
          boxShadow: "0 25px 80px 0 rgba(34, 197, 94, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.15)",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
        }}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Icon src="/send.svg" alt="Sucesso" size={32} className="text-green-600" />
          </div>
          <Text variant="h3" className="text-green-600 font-bold">
            Feedback Enviado com Sucesso!
          </Text>
          <Text variant="body" className="text-gray-600 max-w-md">
            Obrigado por sua participação. Sua opinião é muito importante para nós.
          </Text>
          <Button
            variant="primary"
            onClick={resetForm}
            className="mt-8"
          >
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
          boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.15)",
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
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B)",
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
          <div className="space-y-4">
            <Text variant="h3" className="font-semibold text-gray-700">
              1. Grave seu feedback
            </Text>
            
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center
                  transition-all duration-300 transform hover:scale-105
                  ${isRecording 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-blue-500 hover:bg-blue-600"
                  }
                  ${isTranscribing ? "opacity-50 cursor-not-allowed" : ""}
                  text-white shadow-lg
                `}
                aria-label={isRecording ? "Parar gravação" : "Iniciar gravação"}
              >
                {isRecording ? (
                  <div className="w-6 h-6 bg-white rounded-sm" />
                ) : (
                  <Icon src="/microphone.svg" alt="Microfone" size={32} />
                )}
              </button>

              <Text variant="body" className="text-center text-gray-600">
                {isRecording ? "Gravando... Clique para parar" : "Clique para gravar"}
              </Text>

              {isTranscribing && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <Text variant="body" className="text-blue-600">
                    Transcrevendo áudio...
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Transcription Display */}
          {transcription && (
            <div className="space-y-4">
              <Text variant="h3" className="font-semibold text-gray-700">
                2. Transcrição do seu feedback
              </Text>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <Text variant="body" className="text-gray-800 whitespace-pre-line">
                  {transcription}
                </Text>
              </div>
            </div>
          )}

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
                  onChange={(_, newValue) => setNpsScore(newValue)}
                  max={10}
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: npsScore && npsScore <= 2 ? '#ef4444' :
                             npsScore && npsScore <= 4 ? '#f97316' :
                             npsScore && npsScore <= 6 ? '#eab308' :
                             npsScore && npsScore <= 8 ? '#3b82f6' : '#22c55e'
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
              onChange={(e) => setAdditionalComment(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text variant="body" className="text-red-700">
                {error}
              </Text>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!audioBlob || !transcription || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </Paper>
    </div>
  );
}
