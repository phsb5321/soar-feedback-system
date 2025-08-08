import { AudioPlayer } from "@/components/atoms/AudioPlayer/AudioPlayer";
import { Text } from "@/components/atoms/Text/Text";
import { useEffect, useState } from "react";

export interface RecordingPlaybackProps {
  audioBlob?: Blob;
  className?: string;
}

/**
 * Component for playing back recorded audio
 * Converts audio blob to playable URL
 */
export function RecordingPlayback({
  audioBlob,
  className = "",
}: RecordingPlaybackProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioBlob) {
      // Create object URL for the blob
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Cleanup function to revoke the URL
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioUrl(null);
    }
  }, [audioBlob]);

  if (!audioBlob || !audioUrl) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
        <AudioPlayer
          src={audioUrl}
          onError={(error) => console.error("Recording playback error:", error)}
        />
        <Text variant="caption" className="text-gray-700">
          🎧 Ouvir gravação
        </Text>
      </div>
    </div>
  );
}
