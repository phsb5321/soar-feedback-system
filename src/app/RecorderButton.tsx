"use client";
import { useRef, useState } from "react";

export default function RecorderButton({
  onTranscribe,
}: {
  onTranscribe: (audioBlob: Blob) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks.current, { type: "audio/webm" });
        onTranscribe(audioBlob);
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

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`rounded-full p-4 text-white shadow-lg focus:outline-none transition-colors duration-200 ${
          recording ? "bg-red-600" : "bg-green-600"
        }`}
        aria-label={recording ? "Parar Gravação" : "Gravar Áudio"}
      >
        {recording ? (
          // Inline SVG for Stop icon
          <svg width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
        ) : (
          // Inline SVG for Microphone icon
          <svg width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 17 12z" />
          </svg>
        )}
      </button>
      {error && <span className="text-red-600 text-xs">{error}</span>}
    </div>
  );
}
