"use client";
import { RecordButton } from "@/components/molecules/RecordButton/RecordButton";
import { TranscriptionDisplay } from "@/components/molecules/TranscriptionDisplay/TranscriptionDisplay";
import { useOptimistic, useRef, useState, useTransition } from "react";

export interface AudioTranscriberProps {
  onTranscribe: (audioBlob: Blob) => Promise<string>;
}

export function AudioTranscriber({ onTranscribe }: AudioTranscriberProps) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [optimisticTranscription, setOptimisticTranscription] =
    useOptimistic(transcription);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [, startTransition] = useTransition();

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

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks.current, { type: "audio/webm" });
        handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      setError("Microfone não disponível ou permissão negada.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleTranscribe = async (audioBlob: Blob) => {
    setTranscribing(true);
    setOptimisticTranscription("Transcrevendo...");

    try {
      const text = await onTranscribe(audioBlob);
      setTranscription(text);
      setOptimisticTranscription(text);
    } catch (transcriptionError) {
      const errorMessage = "Erro ao transcrever áudio.";
      setTranscription(errorMessage);
      setOptimisticTranscription(errorMessage);
      setError(errorMessage);
      console.error("Transcription error:", transcriptionError);
    } finally {
      setTranscribing(false);
    }
  };

  const handleFinish = () => {
    // Reset all states to start a new transcription
    setTranscription("");
    setOptimisticTranscription("");
    setError(null);
    setTranscribing(false);
    setRecording(false);

    // Stop any ongoing recording
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startTransition(() => {
        startRecording();
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <RecordButton
        isRecording={recording}
        onToggleRecord={toggleRecording}
        error={error}
        disabled={transcribing}
      />
      <TranscriptionDisplay
        transcription={optimisticTranscription}
        isTranscribing={transcribing}
        onFinish={transcription && !transcribing ? handleFinish : undefined}
      />
    </div>
  );
}
