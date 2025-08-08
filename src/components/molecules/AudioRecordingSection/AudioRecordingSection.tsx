import { AudioRecordingButton } from "@/components/atoms/AudioRecordingButton/AudioRecordingButton";
import { HelpButton } from "@/components/atoms/HelpButton/HelpButton";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import { RecordingTimer } from "@/components/atoms/RecordingTimer/RecordingTimer";
import { Text } from "@/components/atoms/Text/Text";
import { useProtectedAudio } from "@/hooks/useProtectedAudio";

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
  const { playProtectedAudio } = useProtectedAudio();

  const handleRecordingInstructionsHelp = () => {
    playProtectedAudio("recordingInstructions").catch(() => {
      console.info("Recording instructions audio blocked by browser");
    });
  };

  const getStatusText = () => {
    if (isTranscribing) return "🔄 Transcrevendo...";
    if (isRecording) return "🔴 Gravando... Clique para parar";
    return "🎤 Clique para gravar";
  };

  const getStatusColor = () => {
    if (isTranscribing) return "text-blue-600";
    if (isRecording) return "text-red-600";
    return "text-gray-700";
  };

  const handleStartRecording = () => {
    // User interaction - no audio feedback needed
    onStartRecording();
  };

  const handleStopRecording = () => {
    // User interaction - no audio feedback needed
    onStopRecording();
  };

  return (
    <div className={`space-y-4 text-center ${className}`}>
      {/* Status and Timer */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Text variant="body" className={getStatusColor()}>
            {getStatusText()}
          </Text>
          {isTranscribing && <LoadingSpinner size="small" color="primary" />}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center">
            <RecordingTimer isRecording={isRecording} />
          </div>
        )}
      </div>

      {/* Recording Button */}
      <div className="flex justify-center">
        <AudioRecordingButton
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isDisabled={isTranscribing}
          size="large"
        />
      </div>

      {/* Instructions with Help Button */}
      <div className="space-y-1 relative">
        {/* Help button for recording instructions */}
        <div className="flex justify-center mb-2">
          <HelpButton
            ariaLabel="Ouvir instruções sobre gravação"
            tooltip="Clique para ouvir instruções sobre como gravar"
            onHelp={handleRecordingInstructionsHelp}
            icon="speech"
            size="small"
            color="primary"
          />
        </div>

        <Text
          variant="caption"
          className="text-gray-700 dark:text-gray-400 font-medium"
        >
          {isRecording
            ? "Fale agora e clique novamente para parar"
            : "Clique no microfone e comece a falar"}
        </Text>

        {!isRecording && !isTranscribing && (
          <Text
            variant="caption"
            className="text-gray-700 dark:text-gray-500 text-xs"
          >
            Certifique-se de estar em um ambiente silencioso
          </Text>
        )}
      </div>
    </div>
  );
}
