import { Icon } from '@/components/atoms/Icon/Icon';

export interface AudioRecordingButtonProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Atomic component for audio recording button
 * Follows Single Responsibility Principle
 */
export function AudioRecordingButton({
  isRecording,
  isDisabled = false,
  onStartRecording,
  onStopRecording,
  size = 'large',
  className = '',
}: AudioRecordingButtonProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center
        transition-all duration-300 transform hover:scale-105
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-blue-500 hover:bg-blue-600'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        text-white shadow-lg
        ${className}
      `}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <div className="w-6 h-6 bg-white rounded-sm" />
      ) : (
        <Icon src="/microphone.svg" alt="Microphone" size={iconSizes[size]} />
      )}
    </button>
  );
}
