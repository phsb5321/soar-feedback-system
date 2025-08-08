import { RecordingPlayback } from "@/components/atoms/RecordingPlayback/RecordingPlayback";
import { Text } from "@/components/atoms/Text/Text";
import { useState } from "react";

export interface TranscriptionDisplaySectionProps {
  transcription: string;
  audioBlob?: Blob;
  className?: string;
}

/**
 * Molecule component for displaying transcription
 * Follows Single Responsibility Principle
 */
export function TranscriptionDisplaySection({
  transcription,
  audioBlob,
  className = "",
}: TranscriptionDisplaySectionProps) {
  // Remove TTS functionality - only show transcription without audio playback
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  if (!transcription) return null;

  const handlePlayTranscription = () => {
    // Only mark as played for visual feedback, no audio playback
    setHasPlayedOnce(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Simplified header with audio icon */}
      <div className="flex items-center justify-between">
        <Text
          variant="h3"
          className="font-semibold"
          style={{ color: "#1f2937" }}
        >
          🎯 Seu feedback
        </Text>
        <button
          onClick={handlePlayTranscription}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
          aria-label="Marcar como lido"
        >
          <span className="text-xl">{hasPlayedOnce ? "✅" : "�️"}</span>
          <Text
            variant="caption"
            style={{ color: "#1d4ed8", fontWeight: "600" }}
          >
            {hasPlayedOnce ? "Lido" : "Marcar como lido"}
          </Text>
        </button>
      </div>

      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
        {/* Audio wave decoration */}
        <div className="absolute top-3 left-3 flex space-x-1">
          <div className="w-1 h-4 bg-blue-400 rounded-full opacity-60"></div>
          <div className="w-1 h-3 bg-blue-400 rounded-full opacity-40"></div>
          <div className="w-1 h-5 bg-blue-400 rounded-full opacity-60"></div>
          <div className="w-1 h-2 bg-blue-400 rounded-full opacity-40"></div>
        </div>

        {/* Transcription text */}
        <div className="ml-8">
          <Text
            variant="body"
            className="text-lg leading-relaxed font-medium"
            style={{ color: "#374151" }}
          >
            &ldquo;{transcription}&rdquo;
          </Text>
        </div>

        {/* Play hint for first-time users */}
        {!hasPlayedOnce && (
          <div className="mt-4 flex items-center space-x-2 text-blue-600">
            <span className="text-sm">💡</span>
            <Text
              variant="caption"
              style={{ color: "#2563eb", fontStyle: "italic" }}
            >
              Clique em &ldquo;Ouvir&rdquo; para escutar sua transcrição
            </Text>
          </div>
        )}
      </div>

      {/* Recording playback section */}
      {audioBlob && (
        <div className="mt-4">
          <Text variant="caption" className="text-gray-600 mb-2 block">
            Sua gravação original:
          </Text>
          <RecordingPlayback audioBlob={audioBlob} />
        </div>
      )}
    </div>
  );
}
