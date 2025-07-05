import { Text } from '@/components/atoms/Text/Text';

export interface TranscriptionDisplaySectionProps {
  transcription: string;
  className?: string;
}

/**
 * Molecule component for displaying transcription
 * Follows Single Responsibility Principle
 */
export function TranscriptionDisplaySection({
  transcription,
  className = '',
}: TranscriptionDisplaySectionProps) {
  if (!transcription) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <Text variant="h3" className="font-semibold text-gray-700">
        2. Transcrição do seu feedback
      </Text>
      
      <div className="bg-gray-50 rounded-lg p-4 border">
        <Text variant="body" className="text-gray-800 whitespace-pre-line">
          {transcription}
        </Text>
      </div>
    </div>
  );
}
