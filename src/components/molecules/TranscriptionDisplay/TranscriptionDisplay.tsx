import { Button } from "@/components/atoms/Button/Button";
import { Text } from "@/components/atoms/Text/Text";
import { Box, CircularProgress } from "@mui/material";

export interface TranscriptionDisplayProps {
  transcription: string;
  isTranscribing: boolean;
  onFinish?: () => void;
}

export function TranscriptionDisplay({
  transcription,
  isTranscribing,
  onFinish,
}: TranscriptionDisplayProps) {
  if (isTranscribing) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 px-2">
        <CircularProgress color="primary" size={32} />
        <Text
          variant="caption"
          color="secondary"
          className="animate-pulse text-center"
        >
          Processando áudio...
        </Text>
      </div>
    );
  }

  if (!transcription || transcription.trim() === "") {
    return null;
  }

  return (
    <Box mt={{ xs: 1, sm: 2 }} width="100%" className="space-y-4 sm:space-y-6">
      <Text
        variant="caption"
        className="text-blue-600 dark:text-blue-400 font-bold mb-1 tracking-wide font-mono uppercase block text-center sm:text-left"
      >
        TRANSCRIÇÃO
      </Text>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-inner border border-gray-200 dark:border-gray-700">
        <Text
          variant="body"
          className="font-mono text-sm sm:text-base md:text-lg whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200 break-words hyphens-auto"
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
          }}
        >
          {transcription}
        </Text>
      </div>

      {onFinish && (
        <div className="flex justify-center pt-4 sm:pt-6">
          <div className="relative group">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110" />

            <Button
              variant="primary"
              size="md"
              onClick={onFinish}
              className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold tracking-wide transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl min-h-[48px] touch-manipulation"
            >
              <div className="flex items-center gap-2 justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:rotate-180 flex-shrink-0"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span className="text-sm sm:text-base">Nova Transcrição</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </Box>
  );
}
