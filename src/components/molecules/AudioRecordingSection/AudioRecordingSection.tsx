import { AudioRecordingButton } from "@/components/atoms/AudioRecordingButton/AudioRecordingButton";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import { Text } from "@/components/atoms/Text/Text";

export interface AudioRecordingSectionProps {
  isRecording: boolean;
  isTranscribing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  className?: string;
}

/**
 * Molecule component for audio recording section
 * Follows Single Responsibility Principle and Open/Closed Principle
 */
export function AudioRecordingSection({
  isRecording,
  isTranscribing,
  onStartRecording,
  onStopRecording,
  className = "",
}: AudioRecordingSectionProps) {
  const getStatusText = () => {
    if (isTranscribing) return "Transcrevendo áudio...";
    if (isRecording) return "Gravando... Clique para parar";
    return "Clique para gravar";
  };

  const getStatusColor = () => {
    if (isTranscribing) return "text-blue-600";
    if (isRecording) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Text variant="h3" className="font-semibold text-gray-700">
        1. Grave seu feedback
      </Text>

      <div className="flex flex-col items-center space-y-4">
        <AudioRecordingButton
          isRecording={isRecording}
          isDisabled={isTranscribing}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          size="large"
        />

        <Text variant="body" className={`text-center ${getStatusColor()}`}>
          {getStatusText()}
        </Text>

        {isTranscribing && (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="small" color="primary" />
            <Text variant="body" className="text-blue-600">
              Processando...
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
