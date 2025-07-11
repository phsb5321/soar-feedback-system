import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Text } from "@/components/atoms/Text/Text";

export interface RecordButtonProps {
  isRecording: boolean;
  onToggleRecord: () => void;
  error?: string | null;
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  onToggleRecord,
  error,
  disabled = false,
}: RecordButtonProps) {
  const variant = isRecording ? "danger" : "success";
  const iconSrc = isRecording ? "/file.svg" : "/microphone.svg";
  const iconAlt = isRecording ? "Stop Recording" : "Start Recording";
  const ariaLabel = isRecording ? "Parar Gravação" : "Gravar Áudio";

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full px-2">
      <div className="relative">
        {/* Pulsing ring animation for recording state */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping scale-110 sm:scale-125" />
        )}

        {/* Glowing ring effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-lg scale-110 sm:scale-125" />

        <Button
          variant={variant}
          size="lg"
          shape="circle"
          onClick={onToggleRecord}
          disabled={disabled}
          aria-label={ariaLabel}
          className={`
            transform transition-all duration-300 ease-out relative z-10
            ${
              isRecording
                ? "scale-105 sm:scale-110 shadow-2xl shadow-red-500/40"
                : "hover:scale-105 active:scale-95 shadow-2xl shadow-green-500/40"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            min-w-[64px] min-h-[64px] sm:min-w-[80px] sm:min-h-[80px]
          `}
        >
          <span className="sr-only">{ariaLabel}</span>
          <Icon
            src={iconSrc}
            alt={iconAlt}
            size={isRecording ? 28 : 32}
            priority
            className={`transition-all duration-300 ${
              isRecording ? "text-white" : "text-white drop-shadow-sm"
            }`}
          />
        </Button>
      </div>

      {error && (
        <div className="max-w-xs sm:max-w-sm">
          <Text
            variant="caption"
            color="error"
            className="mt-2 text-center animate-fade-in px-2 leading-relaxed"
          >
            {error}
          </Text>
        </div>
      )}
    </div>
  );
}
