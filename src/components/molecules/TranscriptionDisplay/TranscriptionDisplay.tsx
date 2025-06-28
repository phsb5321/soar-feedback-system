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
      <div className="flex flex-col items-center gap-3 py-4">
        <CircularProgress color="primary" size={32} />
        <Text variant="caption" color="secondary" className="animate-pulse">
          Processando áudio...
        </Text>
      </div>
    );
  }

  if (!transcription || transcription.trim() === "") {
    return null;
  }

  return (
    <Box mt={2} width="100%" className="space-y-4">
      <Text
        variant="caption"
        className="text-blue-600 dark:text-blue-400 font-bold mb-1 tracking-wide font-mono uppercase block"
      >
        TRANSCRIÇÃO
      </Text>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-inner border border-gray-200 dark:border-gray-700">
        <Text
          variant="body"
          className="font-mono text-lg whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200 break-words"
        >
          {transcription}
        </Text>
      </div>

      {onFinish && (
        <div className="flex justify-center pt-4">
          <Button
            variant="secondary"
            size="md"
            onClick={onFinish}
            className="px-8 py-3 transition-all duration-200 hover:scale-105"
          >
            Nova Transcrição
          </Button>
        </div>
      )}
    </Box>
  );
}
